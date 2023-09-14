
import {Server} from "socket.io";
// @ts-ignore
import express from "express";
import http from "http";
import { SocketServer } from "../server";

export function createServer() {
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);
    app.get("/", (req: any, res: any) => {
        res.send("Server running...");
    })
    return new SocketServer(io, server);
}