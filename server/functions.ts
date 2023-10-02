
import {Server} from "socket.io";
import http from "http";
import { SocketServer } from "../server";

export function createServer(expressApp: any, origin: string) {

    const server = http.createServer(expressApp);
    const io = new Server(server, {
        cors:  {
            origin,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD", "CONNECT", "TRACE"],
        }
    });
    return new SocketServer(io, server, expressApp);
}