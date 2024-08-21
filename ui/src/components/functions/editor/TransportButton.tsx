import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectSenderConnection, selectReceiverConnection } from '../../../store/connectionsSlice';

interface TransportButtonProps {
  onSelectTransport: (importStatement: string, transportCode: string) => void;
}

const TransportButton: React.FC<TransportButtonProps> = ({ onSelectTransport }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Access the connection details directly from Redux
  const senderConnection = useSelector(selectSenderConnection);
  const receiverConnection = useSelector(selectReceiverConnection);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectTransport = (type: 'Kafka' | 'TCP' | 'UDP', action: 'send' | 'receive') => {
    if (!senderConnection || !receiverConnection) {
      console.error('Connection details are not defined.');
      return;
    }

    let importStatement = '';
    let transportCode = '';

    const kafkaSendCode = `
producer = KafkaProducer(bootstrap_servers='${senderConnection.host}:${senderConnection.port}')
producer.send('${senderConnection.topic}', content.encode('utf-8'))
`;

    const kafkaReceiveCode = `
consumer = KafkaConsumer('${receiverConnection.topic}', bootstrap_servers='${receiverConnection.host}:${receiverConnection.port}', auto_offset_reset='earliest')
for message in consumer:
    content = message.value.decode('utf-8')
    break
`;

    const tcpUdpSendCode = (protocol: 'TCP' | 'UDP') => `
with socket.socket(socket.AF_INET, socket.SOCK_${protocol === 'TCP' ? 'STREAM' : 'DGRAM'}) as s:
    s.connect(('${senderConnection.host}', ${senderConnection.port}))
    s.sendall(content.encode('utf-8'))
`;

    const tcpUdpReceiveCode = (protocol: 'TCP' | 'UDP') => `
with socket.socket(socket.AF_INET, socket.SOCK_${protocol === 'TCP' ? 'STREAM' : 'DGRAM'}) as s:
    s.bind(('${receiverConnection.host}', ${receiverConnection.port}))
    if '${protocol}' == 'TCP':
        s.listen()
        conn, addr = s.accept()
        with conn:
            content = conn.recv(4096).decode('utf-8')
    else:
        content, addr = s.recvfrom(4096)
`;

    switch (type) {
      case 'Kafka':
        importStatement = 'from kafka import KafkaProducer, KafkaConsumer';
        transportCode = action === 'send' ? kafkaSendCode : kafkaReceiveCode;
        break;
      case 'TCP':
      case 'UDP':
        importStatement = 'import socket';
        transportCode = action === 'send' ? tcpUdpSendCode(type) : tcpUdpReceiveCode(type);
        break;
      default:
        console.error('Unknown transport type:', type);
        return;
    }

    onSelectTransport(importStatement, transportCode);
    handleClose();
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Add Transport
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleSelectTransport('Kafka', 'send')}>Kafka Send</MenuItem>
        <MenuItem onClick={() => handleSelectTransport('Kafka', 'receive')}>Kafka Receive</MenuItem>
        <MenuItem onClick={() => handleSelectTransport('TCP', 'send')}>TCP Send</MenuItem>
        <MenuItem onClick={() => handleSelectTransport('TCP', 'receive')}>TCP Receive</MenuItem>
        <MenuItem onClick={() => handleSelectTransport('UDP', 'send')}>UDP Send</MenuItem>
        <MenuItem onClick={() => handleSelectTransport('UDP', 'receive')}>UDP Receive</MenuItem>
      </Menu>
    </>
  );
};

export default TransportButton;
