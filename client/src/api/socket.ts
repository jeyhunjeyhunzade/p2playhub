import { io } from "socket.io-client";
import { socketServerUrl } from "./apiClient";

export const socket = io(socketServerUrl, { autoConnect: false });
