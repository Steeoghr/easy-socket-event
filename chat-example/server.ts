import { SocketServer } from "../server/socker.server";
import { ConnectionInfo } from "./models/connection";
import {ConnectionResponse} from "./models/connection-response";
import { MessageSocketEvent } from "./models/message";
import * as net from "net";
import { NetUserInfo } from "./models/user";

const server = new SocketServer();

interface NetUser extends NetUserInfo {
    socket: net.Socket;
}

const usersConnected: NetUser[] = [];

// Register the handler for connection event

server.registerEvent<ConnectionInfo>("connection", (data: ConnectionInfo, sender: net.Socket) => {  
    console.log("responseEmitter")
    const connectionMessage = data;
    const user = {
        socket: sender,
        username: connectionMessage.username,
        key: connectionMessage.key
    } as NetUser;
    usersConnected.push(user);

    const userTo = usersConnected.find(user => user.username === connectionMessage.to);

    const response: ConnectionResponse = {
        connected: true,
        user: userTo ? {
            username: userTo.username,
            key: userTo.key,
        } : null,
    };

    server.emit("connection-response", response, sender);
});

// Register the handler for message event

server.registerEvent<MessageSocketEvent>("message", (message: MessageSocketEvent, sender: net.Socket) => {
    const user = usersConnected.find(user => user.username === message.to);
    if (!user) {
        sender.write(JSON.stringify({
            from: "system",
            type: "message",
            message: "Unreachable user"
        }));
        return;
    }

    console.log("Socket send message to user " + sender.remoteAddress)

    server.emit("message", message, user.socket);
});

server.listen("localhost", 3001);