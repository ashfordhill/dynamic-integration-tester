# Dockerfile for combined service
FROM python:3.9-slim

# Install Kafka Python client
RUN pip install confluent-kafka

# Copy the combined application
COPY main.py /app/main.py
WORKDIR /app

# Expose TCP port
EXPOSE 12345

# Use CMD to pass environment variables at runtime
CMD ["python", "main.py", "--tcp-host", "${TCP_HOST}", "--tcp-port", "${TCP_PORT}", "--kafka-host", "${KAFKA_HOST}", "--kafka-topic", "${KAFKA_TOPIC}"]
