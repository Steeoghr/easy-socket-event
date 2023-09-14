import { SocketClient } from "../client";
import io from "socket.io-client";
import { IoClientSocket } from "../types";

export function createClient(host: string, connected: () => void) {
    const socket: IoClientSocket = io(host);
    socket.on('connected', () => connected());
    return new SocketClient(socket);
}