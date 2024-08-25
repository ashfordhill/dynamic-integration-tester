export type ConnectionType = 'TCP' | 'Kafka'
export const connectionTypes: ConnectionType[] = ['TCP', 'Kafka']

export interface ConnectionDetails {
  connectionType: ConnectionType
  host: string
  port: number | undefined
  topic?: string
}

export interface ConnectionState {
  senderConnection: ConnectionDetails
  receiverConnection: ConnectionDetails
}

export const initialState: ConnectionState = {
  senderConnection: { connectionType: 'TCP', host: '127.0.0.1', port: 12345 },
  receiverConnection: { connectionType: 'Kafka', host: 'host.docker.internal', port: 9093, topic: 'DummyTopic' }
}
