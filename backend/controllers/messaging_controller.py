from flask import Blueprint, request, jsonify
from services.messaging_service import MessagingService

messaging_app = Blueprint('messaging_app', __name__)
messaging_service = MessagingService()

@messaging_app.route('/messages/send', methods=['POST'])
def send_message():
    connection_details = request.json['connection_details']
    message = request.json['message']
    messaging_service.send_message(connection_details, message)
    return jsonify({"status": "sent"})

@messaging_app.route('/messages/receive', methods=['POST'])
def receive_message():
    connection_details = request.json['connection_details']
    received_message = messaging_service.receive_message(connection_details)
    return jsonify({"received_message": received_message})

@messaging_app.route('/messages/assert', methods=['POST'])
def assert_message():
    received_message = request.json['received_message']
    expected_message = request.json['expected_message']
    result = messaging_service.assert_message(received_message, expected_message)
    return jsonify({"assertion_result": result})