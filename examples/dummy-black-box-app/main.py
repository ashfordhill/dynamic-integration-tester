import os
import threading
import socket
import logging
from confluent_kafka import Producer, Consumer, KafkaError

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)

# Stubs out real app logic.
# Receive .pcapng? lookup key to value to sent on the outgoing connection
# Receive .xml? reverse lookup here and send key to outgoing connection
data_mapping = {
    '01000000': '<CmdStatus>Status 1</CmdStatus>',
    '05060708': '<CmdStatus>Status 2</CmdStatus>',
    '090a0b0c': '<CmdStatus>Status 3</CmdStatus>',
    # Add more mappings as needed
}


reverse_data_mapping = {v: k for k, v in data_mapping.items()}  # Reverse dictionary for XML to .pcapng mapping

# TCP Server
def tcp_server(host, port, kafka_producer):
    logging.info(f"Starting TCP Server on {host}:{port}...")
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((host, port))
    server.listen(1)

    while True:
        logging.info("TCP Server waiting for connection...")
        conn, addr = server.accept()
        logging.debug(f"Accepted connection from {addr}")
        received_data = b""
        while True:
            data = conn.recv(1024)
            if not data:
                break
            logging.debug(f"Received data chunk (raw): {data}")
            received_data += data
        conn.close()
        logging.info(f"Finished receiving .pcapng data (raw): {received_data}")

        # Convert received data to a string directly
        received_data_str = received_data.decode('utf-8', errors='ignore')  # If it's UTF-8 encoded
        logging.debug(f"Received data (str): {received_data_str}")

        # Lookup corresponding XML data
        xml_data = data_mapping.get(received_data_str, "")
        if xml_data:
            logging.info(f"Found corresponding XML data: {xml_data}")
            kafka_producer(xml_data)
        else:
            logging.warning("No corresponding XML data found, returning empty data.")
            kafka_producer("<Error>No matching XML for provided data on TCP connection</Error>")


# TCP Client
def tcp_client(host, port, xml_data):
    logging.debug(f"Connecting to TCP Server at {host}:{port} to send XML data...")
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((host, port))

    # Lookup corresponding .pcapng data
    pcapng_data = reverse_data_mapping.get(xml_data, b"")
    if pcapng_data:
        logging.debug(f"Sending corresponding .pcapng data: {pcapng_data}")
        client.sendall(pcapng_data)
    else:
        logging.warning("No corresponding .pcapng data found, sending empty data.")
        client.sendall(b"")

    client.close()
    logging.debug("Finished sending .pcapng data")

# Kafka Producer
def kafka_producer(kafka_host, kafka_topic, xml_data):
    logging.debug(f"Producing XML message to Kafka topic '{kafka_topic}' on {kafka_host}...")
    p = Producer({'bootstrap.servers': kafka_host})

    def delivery_report(err, msg):
        if err is not None:
            logging.error(f'Message delivery failed: {err}')
        else:
            logging.debug(f'Message delivered to {msg.topic()} [{msg.partition()}]')

    p.produce(kafka_topic, key='key', value=xml_data, callback=delivery_report)
    p.flush()

# Kafka Consumer
def kafka_consumer(kafka_host, kafka_topic, tcp_host, tcp_port):
    logging.debug(f"Starting Kafka Consumer for topic '{kafka_topic}' on {kafka_host}...")
    c = Consumer({
        'bootstrap.servers': kafka_host,
        'group.id': 'dummy-app-kafka-consumer-group-id',
        'auto.offset.reset': 'earliest'
    })

    # Retry logic to wait for topic to become available
    while True:
        try:
            c.subscribe([kafka_topic])
            logging.debug(f"Kafka Consumer subscribed to '{kafka_topic}'")
            break
        except KafkaError as e:
            logging.error(f"Kafka subscription error: {e}")
            logging.debug("Retrying in 5 seconds...")
            time.sleep(5)

    while True:
        msg = c.poll(10)
        if msg is None:
            logging.info(f"No message received on {kafka_topic} yet. Awaiting..")
            continue
        if msg.error():
            logging.error(f"Kafka error: {msg.error()}")
            continue
        xml_data = msg.value().decode("utf-8")
        logging.debug(f'Received XML message: {xml_data}')
        tcp_client(tcp_host, tcp_port, xml_data)
        break
    
    c.close()
    logging.debug("Kafka Consumer closed")

# Main function to run all components
def main():
    tcp_host = os.getenv('TCP_HOST', '0.0.0.0')
    tcp_port = int(os.getenv('TCP_PORT', 12345))
    kafka_host = os.getenv('KAFKA_HOST', 'kafka:9092')
    kafka_topic = os.getenv('KAFKA_TOPIC', 'topic-name')

    logging.debug("Starting the application...")

    threading.Thread(target=tcp_server, args=(tcp_host, tcp_port, lambda xml_data: kafka_producer(kafka_host, kafka_topic, xml_data))).start()
    threading.Thread(target=kafka_consumer, args=(kafka_host, kafka_topic, tcp_host, tcp_port)).start()

if __name__ == '__main__':
    main()
