# Dockerfile for combined service
FROM python:3.9-slim

# Install Kafka Python client
RUN pip install confluent-kafka

WORKDIR /app

COPY main.py .
COPY wait-for-it.sh .

# Convert Windows line endings (CRLF) to Unix line endings (LF) and make the script executable
RUN sed -i 's/\r$//' wait-for-it.sh && chmod +x wait-for-it.sh

EXPOSE 12345

CMD ["/app/wait-for-it.sh", "kafka:9092", "--timeout=60", "--strict", "--", "python", "/app/main.py", "--tcp-host", "${TCP_HOST}", "--tcp-port", "${TCP_PORT}", "--kafka-host", "${KAFKA_HOST}", "--kafka-topic", "${KAFKA_TOPIC}"]
