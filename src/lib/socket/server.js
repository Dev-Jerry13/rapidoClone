import { Server } from "socket.io";
import { SOCKET_EVENTS } from "@/config/socket-events";

export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on(SOCKET_EVENTS.JOIN_ROLE_ROOM, ({ role, userId }) => {
      socket.join(`${role}:${userId}`);
    });

    socket.on(SOCKET_EVENTS.JOIN_RIDE_ROOM, ({ rideId }) => {
      socket.join(`ride:${rideId}`);
    });

    socket.on(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, ({ rideId, coordinates }) => {
      socket.to(`ride:${rideId}`).emit(SOCKET_EVENTS.RIDE_LOCATION_UPDATE, { coordinates });
      socket.to("admin:ops").emit(SOCKET_EVENTS.RIDE_LOCATION_UPDATE, { rideId, coordinates });
    });
  });

  return io;
}
