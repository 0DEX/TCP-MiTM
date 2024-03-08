import { connectToServer } from "./connectToServer";
import { consumeServer } from "./consumeServer";
import { getOrThrow } from "./getOrThrow";
import { Server } from "./interfaces/Server";

const SERVERS = getOrThrow("SERVERS");

const servers: Server[] = JSON.parse(SERVERS);

for (const server of servers) {
  connectToServer(server);
  consumeServer(server);
}
