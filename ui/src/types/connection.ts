export type ConnectionType = "TCP" | "Kafka"
export const connectionTypes: ConnectionType[] = ["TCP", "Kafka"];

export interface ConnectionDetails {
    connectionType: ConnectionType;
    host: string;
    port: number | undefined;
    topic?: string;
}

export const initialConnectionDetails: ConnectionDetails = {
    connectionType: "TCP",
    host: "",
    port: undefined,
}