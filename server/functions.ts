
import {Server} from "socket.io";
import http from "http";
import { SocketServer } from "../server";

export function createServer() {
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: [
            'http://localhost:8081',
            'https://chat-client-98edf.web.app',
            // Altre origini consentite
            ],
        }
    });
    app.get("/", (req: any, res: any) => {
        res.send("Server running...");
    })
    return new SocketServer(io, server, app);
}