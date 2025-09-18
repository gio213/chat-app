import { Socket } from "socket.io";
import { getUserIdFromToken } from "../lib/auth";

export function socketAuth(socket: Socket, next: (err?: any) => void) {
  const tok =
    (socket.handshake.auth as any)?.token ||
    socket.handshake.headers.authorization?.split(" ")[1];
  (socket.data as any).userId = getUserIdFromToken(tok);
  next();
}
