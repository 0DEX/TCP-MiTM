export interface Server {
  originPort: number;
  targetHost: string;
  targetPort: number;
  exchangeName: string;
  exchangeType: string;
  routingKey: string;
  databaseName: string;
  collectionName: string;
}
