import { io } from "socket.io-client";

export default function getWebSocket() {
  return io;
}
