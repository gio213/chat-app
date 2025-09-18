import { Server } from "socket.io";
import { getRedisPubSub } from "../lib/redis";
import { createAdapter } from "@socket.io/redis-adapter";
import type { Server as HttpServer } from "http";
import { registerSocketHandlers } from "../sockets/handlers";
import { socketAuth } from "../middlewares/socketAuth";

export async function attachSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN, credentials: true },
  });

  // auth middleware
  io.use(socketAuth);

  // Redis adapter (optional)
  const pubsub = await getRedisPubSub();
  if (pubsub) {
    const { pub, sub } = pubsub;
    io.adapter(createAdapter(pub, sub));
    console.log("Using Redis adapter for Socket.IO");
  } else {
    console.log("Not using Redis adapter for Socket.IO");
  }

  io.on("connection", (socket) => registerSocketHandlers(io, socket));
  return io;
}
