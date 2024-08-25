export type ConnectionType = "TCP" | "Kafka"
export const connectionTypes: ConnectionType[] = ["TCP", "Kafka"];

export interface ConnectionDetails {
    connectionType: ConnectionType;
    host: string;
    port: number | undefined;
    topic?: string;
}

export const initialConnectionDetails: ConnectionDetails = {
    connectionType: 'TCP',
    host: 'localhost',
    port: 12345,
    topic: 'topic',
}

export interface ConnectionState {
    senderConnection: ConnectionDetails
    receiverConnection: ConnectionDetails
  }
  
  export const initialState: ConnectionState = {
    senderConnection: { connectionType: 'TCP', host: '127.0.0.1', port: 1234 },
    receiverConnection: { connectionType: 'Kafka', host: '127.0.0.1', port: 9092, topic: '' }
  }