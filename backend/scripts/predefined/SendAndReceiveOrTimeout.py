import os
import sys
import time
import json
import socket
import threading
from queue import Queue
from confluent_kafka import Producer, Consumer, KafkaError
import logging
from datetime import datetime

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

    try:
        p.produce(connection_details['topic'], key='key', value=data, callback=delivery_report)
        p.flush()
        logging.error("Data sent via Kafka successfully")
        return {"status": "success"}
    except Exception as e:
        error_message = f"Failed to send data via Kafka: {str(e)}"
        logging.error(error_message)
        return {"status": "failure", "error": error_message}

def send_data_via_tcp(connection_details, data):
    logging.error(f"Preparing to send data via TCP to {connection_details['host']}:{connection_details['port']}")
    try:
        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.connect((connection_details['host'], connection_details['port']))
        client.sendall(data.encode())
        client.close()
        logging.error("Data sent via TCP successfully")
        return {"status": "success"}
    except Exception as e:
        error_message = f"Failed to send data via TCP: {str(e)}"
        logging.error(error_message)
        return {"status": "failure", "error": error_message}

def receive_data_via_kafka(connection_details, result_queue):
    logging.error(f"Setting up Kafka consumer for topic {connection_details['topic']} on {connection_details['host']}")
    try:
        c = Consumer({
            'bootstrap.servers': f"{connection_details['host']}:{connection_details['port']}",
            'group.id': 'my-super-special-group',
            'auto.offset.reset': 'latest'
        })

        c.subscribe([connection_details['topic']])
        logging.error("Kafka consumer subscribed and polling for messages")

        start_time = time.time()
        timeout = 30  # Increase timeout to 30 seconds

        while True:
            if time.time() - start_time > timeout:
                error_message = "Kafka polling timed out after 30 seconds"
                logging.error(error_message)
                result_queue.put({"status": "failure", "error": error_message})
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
                result_queue.put({"status": "failure", "error": error_message})
                c.close()
                return
            logging.error(f"Received message from Kafka: {msg.value().decode('utf-8')}")
            result_queue.put({"status": "success", "data": msg.value().decode('utf-8')})
            c.close()
            return
    except Exception as e:
        error_message = f"Exception in receive_data_via_kafka: {str(e)}"
        logging.error(error_message)
        result_queue.put({"status": "failure", "error": error_message})

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
        return {"status": "success", "data": received_data}
    except Exception as e:
        error_message = f"Exception in receive_data_via_tcp: {str(e)}"
        logging.error(error_message)
        return {"status": "failure", "error": error_message}

def execute_test(connection_sender, connection_receiver, input_file, output_file):
    logging.error("Starting test execution")
    result = {"result": "Fail", "resultMessage": "Test failed unexpectedly.", "details": {}}
    try:
        with open(input_file, 'r') as file:
            input_data = file.read()
            logging.debug(f"Loaded input data from {input_file}")

        # Start Kafka consumer first if receiving via Kafka
        received_data = None

        result_queue = Queue()

        if connection_receiver['connectionType'] == 'Kafka':
            logging.debug("Starting Kafka consumer thread")
            receive_thread = threading.Thread(target=receive_data_via_kafka, args=(connection_receiver, result_queue))
            receive_thread.start()

        # Send data after Kafka consumer is set up
        if connection_sender['connectionType'] == 'Kafka':
            send_result = send_data_via_kafka(connection_sender, input_data)
        elif connection_sender['connectionType'] == 'TCP':
            send_result = send_data_via_tcp(connection_sender, input_data)
        else:
            error_message = f"Unsupported connection type: {connection_sender['connectionType']}"
            logging.error(error_message)
            result["resultMessage"] = error_message
            return result

        if send_result["status"] == "failure":
            result["resultMessage"] = send_result["error"]
            return result  # Return failure result if sending data failed

        if connection_receiver['connectionType'] == 'TCP':
            receive_result = receive_data_via_tcp(connection_receiver)
        else:
            logging.debug("Waiting for Kafka consumer thread to finish")
            receive_thread.join()  # Wait for the Kafka consumer thread to finish

            logging.debug("Retrieving result from result queue")
            receive_result = result_queue.get()  # Get the result from the queue
            logging.debug(f"Received result from Kafka: {receive_result}")

        # Explicitly log the receive result
        logging.debug(f"Receive result after join/get: {receive_result}")

        if receive_result["status"] == "failure":
            logging.error(f"Test failed during receive: {receive_result['error']}")
            result["resultMessage"] = receive_result["error"]
            result["result"] = "Fail"
            return result  # Return failure result if receiving data failed

        # Compare received data with expected data
        logging.debug(f"Input data: {input_data}")
        logging.debug(f"Receive result data: {receive_result.get("data", "")}")

        with open(output_file, 'r') as file:
            expected_output = file.read()
            logging.debug(f"Loaded expected output data: {expected_output}")
        
        match = (expected_output == receive_result.get("data", ""))
        result_status = "Pass" if match else "Fail"

        # Save the received data to the output file if specified
        if received_data:
            output_file = output_file.replace('.xml', '.json')
            logging.debug(f"Writing received data to {output_file}")
            with open(output_file, 'w') as file:
                file.write(json.dumps(received_data, indent=4))

        result = {
            "result": result_status,
            "resultMessage": "Test completed" if match else "Test failed: data mismatch",
            "details": {
                "expected": input_data,
                "received": receive_result.get("data", ""),
                "match": str(match).lower()
            }
        }

    except Exception as e:
        logging.error(f"Exception during test execution: {str(e)}")
        result = {
            "result": "Fail",
            "resultMessage": f"Test failed due to an exception: {str(e)}",
            "details": {}
        }
    finally:
        logging.debug("Test execution completed, outputting results.")
        print("START_JSON_OUTPUT")
        print(json.dumps(result))
        print("END_JSON_OUTPUT")

if __name__ == "__main__":
    logging.error("Starting SendAndReceiveOrTimeout script")
    sender_connection = json.loads(sys.argv[1])
    receiver_connection = json.loads(sys.argv[2])
    input_file = sys.argv[3]
    output_file = sys.argv[4]

    execute_test(sender_connection, receiver_connection, input_file, output_file)
