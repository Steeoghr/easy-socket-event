import { createServer } from "../server/functions";
import { ConnectionInfo } from "./models/connection";
import {ConnectionResponse} from "./models/connection-response";
import { MessageSocketEvent } from "./models/message";
import * as net from "net";
import { NetUserInfo } from "./models/user";
import { EventSocket } from "types";

const server = createServer();

const {emit:connectionResponseEmit} = server.EventEmitter<ConnectionResponse>("connection-response");
const {emit:messageEmit} = server.EventEmitter<MessageSocketEvent>("message");

interface NetUser extends NetUserInfo {
    socket: EventSocket;
}

const usersConnected: NetUser[] = [];

// Register the handler for connection event

server.Event<ConnectionInfo>("connection", (data: ConnectionInfo, sender: EventSocket) => {  
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

    connectionResponseEmit(sender, response);
});

// Register the handler for message event

server.Event<MessageSocketEvent>("message", (message: MessageSocketEvent, sender: EventSocket) => {
    const user = usersConnected.find(user => user.username === message.to);
    if (!user) {
        sender.emit(JSON.stringify({
            from: "system",
            type: "message",
            message: "Unreachable user"
        }));
        return;
    }

    console.log("Socket send message to user " + message.to)

    messageEmit(user.socket, message);
});

const port: any = process.env.PORT || 3001;
server.Listen(port);