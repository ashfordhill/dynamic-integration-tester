import os
import threading
import socket
from confluent_kafka import Producer, Consumer, KafkaError

# TCP Server
def tcp_server(host, port, kafka_producer):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((host, port))
    server.listen(1)
    print(f"TCP Server listening on {host}:{port}...")

    while True:
        conn, addr = server.accept()
        with open('received.pcapng', 'wb') as f:
            while True:
                data = conn.recv(1024)
                if not data:
                    break
                f.write(data)
        conn.close()
        print("Received .pcapng file")
        kafka_producer()

# TCP Client
def tcp_client(host, port):
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((host, port))

    with open('send.pcapng', 'rb') as f:
        data = f.read(1024)
        while data:
            client.send(data)
            data = f.read(1024)

    client.close()
    print("Sent .pcapng file")

# Kafka Producer
def kafka_producer(kafka_host, kafka_topic):
    p = Producer({'bootstrap.servers': kafka_host})

    def delivery_report(err, msg):
        if err is not None:
            print(f'Message delivery failed: {err}')
        else:
            print(f'Message delivered to {msg.topic()} [{msg.partition()}]')

    p.produce(kafka_topic, key='key', value='<message>Dummy XML</message>', callback=delivery_report)
    p.flush()

# Kafka Consumer
def kafka_consumer(kafka_host, kafka_topic, tcp_host, tcp_port):
    c = Consumer({
        'bootstrap.servers': kafka_host,
        'group.id': 'my-group',
        'auto.offset.reset': 'earliest'
    })

    c.subscribe([kafka_topic])
    print(f"Kafka Consumer listening to '{kafka_topic}' on {kafka_host}...")

    while True:
        msg = c.poll(1.0)
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(msg.error())
                break
        print(f'Received message: {msg.value().decode("utf-8")}')
        tcp_client(tcp_host, tcp_port)  # Trigger TCP client to send .pcapng data
    c.close()

# Main function to run all components
def main():
    tcp_host = os.getenv('TCP_HOST', '0.0.0.0')
    tcp_port = int(os.getenv('TCP_PORT', 12345))
    kafka_host = os.getenv('KAFKA_HOST', 'localhost:9092')
    kafka_topic = os.getenv('KAFKA_TOPIC', 'topic-name')

    threading.Thread(target=tcp_server, args=(tcp_host, tcp_port, lambda: kafka_producer(kafka_host, kafka_topic))).start()
    threading.Thread(target=kafka_consumer, args=(kafka_host, kafka_topic, tcp_host, tcp_port)).start()

if __name__ == '__main__':
    main()
