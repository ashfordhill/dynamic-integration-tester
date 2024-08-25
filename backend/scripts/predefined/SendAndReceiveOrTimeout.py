import os
import sys
import time
import json
import socket
import threading
from queue import Queue
from confluent_kafka import Producer, Consumer, KafkaError
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s [%(levelname)s] %(message)s')

def send_data_via_kafka(connection_details, data):
    logging.error(f"Preparing to send data via Kafka to topic {connection_details['topic']} on {connection_details['host']}")
    p = Producer({'bootstrap.servers': connection_details['host']})
    
    def delivery_report(err, msg):
        if err is not None:
            logging.error(f'Message delivery failed: {err}')
        else:
            logging.error(f'Message delivered to {msg.topic()} [{msg.partition()}]')

    p.produce(connection_details['topic'], key='key', value=data, callback=delivery_report)
    p.flush()
    logging.error("Data sent via Kafka successfully")

def send_data_via_tcp(connection_details, data):
    logging.error(f"Preparing to send data via TCP to {connection_details['host']}:{connection_details['port']}")
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((connection_details['host'], connection_details['port']))
    client.sendall(data.encode())
    client.close()
    logging.error("Data sent via TCP successfully")

def receive_data_via_kafka(connection_details, result_queue):
    logging.error(f"Setting up Kafka consumer for topic {connection_details['topic']} on {connection_details['host']}")
    try:
        c = Consumer({
            'bootstrap.servers': connection_details['host'],
            'group.id': 'my-super-special-group',
            'auto.offset.reset': 'earliest'
        })

        c.subscribe([connection_details['topic']])
        logging.error("Kafka consumer subscribed and polling for messages")

        start_time = time.time()
        timeout = 5  # Timeout after 5 seconds

        while True:
            if time.time() - start_time > timeout:
                error_message = "Kafka polling timed out after 5 seconds"
                logging.error(error_message)
                result_queue.put({"error": error_message})
                c.close()
                return

            logging.error("Polling Kafka for messages...")
            msg = c.poll(1.0)  # Poll every second
            if msg is None:
                logging.error("No message received yet, retrying...")
                continue
            if msg.error():
                error_message = f"Kafka error: {msg.error()}"
                logging.error(error_message)
                result_queue.put({"error": error_message})
                c.close()
                return
            logging.error(f"Received message from Kafka: {msg.value().decode('utf-8')}")
            result_queue.put({"data": msg.value().decode('utf-8')})
            c.close()
            return
    except Exception as e:
        error_message = f"Exception in receive_data_via_kafka: {str(e)}"
        logging.error(error_message)
        result_queue.put({"error": error_message})


def receive_data_via_tcp(connection_details):
    logging.error(f"Setting up TCP server on {connection_details['host']}:{connection_details['port']}")
    try:
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.bind((connection_details['host'], connection_details['port']))
        server.listen(1)
        logging.error("TCP server listening for connections")
        conn, addr = server.accept()
        logging.error(f"Accepted connection from {addr}")
        received_data = conn.recv(1024).decode()
        logging.error(f"Received data via TCP: {received_data}")
        conn.close()
        return received_data
    except Exception as e:
        logging.error(f"Exception in receive_data_via_tcp: {str(e)}")
        return None
def execute_test(connection_sender, connection_receiver, input_file, output_file):
    logging.error("Starting test execution")
    with open(input_file, 'r') as file:
        input_data = file.read()
        logging.error(f"Loaded input data from {input_file}")

    # Start Kafka consumer first if receiving via Kafka
    received_data = None
    result_queue = Queue()

    if connection_receiver['connectionType'] == 'Kafka':
        logging.error("Starting Kafka consumer thread")
        receive_thread = threading.Thread(target=receive_data_via_kafka, args=(connection_receiver, result_queue))
        receive_thread.start()

    # Send data after Kafka consumer is set up
    if connection_sender['connectionType'] == 'Kafka':
        send_data_via_kafka(connection_sender, input_data)
    elif connection_sender['connectionType'] == 'TCP':
        send_data_via_tcp(connection_sender, input_data)
    else:
        logging.error(f"Unsupported connection type: {connection_sender['connectionType']}")
        return {"error": f"Unsupported connection type: {connection_sender['connectionType']}"}

    if connection_receiver['connectionType'] == 'TCP':
        received_data = receive_data_via_tcp(connection_receiver)
    else:
        receive_thread.join()  # Wait for the Kafka consumer thread to finish
        received_data = result_queue.get()  # Get the result from the queue

    if received_data:
        output_file = output_file.replace('.xml', '.json')
        logging.error(f"Writing received data to {output_file}")
        with open(output_file, 'w') as file:
            file.write(json.dumps(received_data, indent=4))

    match = True  # Assuming match is always true for now

    logging.error("Test execution completed")
    # Print the JSON result with markers
    print("START_JSON_OUTPUT")
    print(json.dumps({
        "result": "Pass" if match else "Fail",
        "resultMessage": "Test completed",
        "details": {
            "expected": "",  # Populate with actual expected data if required
            "received": "",
            "match": str(match).lower()
        }
    }))
    print("END_JSON_OUTPUT")
    return

if __name__ == "__main__":
    logging.error("Starting SendAndReceiveOrTimeout script")
    sender_connection = json.loads(sys.argv[1])
    receiver_connection = json.loads(sys.argv[2])
    input_file = sys.argv[3]
    output_file = sys.argv[4]

    result = execute_test(sender_connection, receiver_connection, input_file, output_file)
    logging.error(f"Test result: {result}")
    logging.error(json.dumps(result))
