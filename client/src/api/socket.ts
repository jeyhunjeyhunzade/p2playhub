import { io, Socket } from "socket.io-client";
import { socketServerUrl } from "./apiClient";

export const socket: Socket = io(socketServerUrl, { autoConnect: false });
