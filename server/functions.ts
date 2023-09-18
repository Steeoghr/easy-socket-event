
import {Server} from "socket.io";
import http from "http";
import { SocketServer } from "../server";

export function createServer(expressApp: any, cors?: any) {

    const server = http.createServer(expressApp);
    const io = new Server(server, cors ? {
        cors
    } : undefined);
    return new SocketServer(io, server, expressApp);
}