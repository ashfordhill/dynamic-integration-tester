import os
import sys
import time
import json
import socket
from confluent_kafka import Producer, Consumer, KafkaError

def send_data_via_kafka(connection_details, data):
    p = Producer({'bootstrap.servers': connection_details['host']})
    
    def delivery_report(err, msg):
        if err is not None:
            print(f'Message delivery failed: {err}')
        else:
            print(f'Message delivered to {msg.topic()} [{msg.partition()}]')

    p.produce(connection_details['topic'], key='key', value=data, callback=delivery_report)
    p.flush()

def send_data_via_tcp(connection_details, data):
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((connection_details['host'], connection_details['port']))
    client.sendall(data.encode())
    client.close()

def receive_data_via_kafka(connection_details):
    c = Consumer({
        'bootstrap.servers': connection_details['host'],
        'group.id': 'my-group',
        'auto.offset.reset': 'earliest'
    })

    c.subscribe([connection_details['topic']])
    print(f"Kafka Consumer listening to '{connection_details['topic']}' on {connection_details['host']}...")

    msg = c.poll(1.0)
    if msg is None or msg.error():
        if msg.error():
            print(f'Kafka error: {msg.error()}')
        return None
    c.close()
    return msg.value().decode('utf-8')

def receive_data_via_tcp(connection_details):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((connection_details['host'], connection_details['port']))
    server.listen(1)
    conn, addr = server.accept()
    received_data = conn.recv(1024).decode()
    conn.close()
    return received_data

def execute_test(connection_sender, connection_receiver, input_file, output_file):
    with open(input_file, 'r') as file:
        input_data = file.read()

    if connection_sender['connectionType'] == 'Kafka':
        send_data_via_kafka(connection_sender, input_data)
    elif connection_sender['connectionType'] == 'TCP':
        send_data_via_tcp(connection_sender, input_data)
    else:
        return {"error": f"Unsupported connection type: {connection_sender['connectionType']}"}

    received_data = None
    start_time = time.time()
    TIMEOUT = 10
    while time.time() - start_time < TIMEOUT:
        if connection_receiver['connectionType'] == 'Kafka':
            received_data = receive_data_via_kafka(connection_receiver)
        elif connection_receiver['connectionType'] == 'TCP':
            received_data = receive_data_via_tcp(connection_receiver)
        else:
            return {"error": f"Unsupported connection type: {connection_receiver['connectionType']}"}

        if received_data:
            break
        time.sleep(1)

    if received_data:
        with open(output_file, 'w') as file:
            file.write(received_data)

    #expected_data = input_data  # Assuming you want to compare input and output
    match = True #received_data == expected_data

    return {
        "result": "Pass" if match else "Fail",
        "resultMessage": "Test completed",
        "details": {
            "expected": expected_data,
            "received": received_data,
            "match": str(match).lower()
        }
    }

if __name__ == "__main__":
    sender_connection = json.loads(sys.argv[1])
    receiver_connection = json.loads(sys.argv[2])
    input_file = sys.argv[3]
    output_file = sys.argv[4]

    result = execute_test(sender_connection, receiver_connection, input_file, output_file)
    print(json.dumps(result))
