import { SocketClient } from "../client/socket.client";
import * as net from "net";

const client = new SocketClient();

client.connected = () => {
    console.log("Client connected");
    client.emit<string>("example", "Example event emit");
};

client.registerEvent<string>("example-response", (data: string, sender: net.Socket) => {
    console.log("\"example-response\" client event handler >>>", data);
});

client.connect("localhost", 3001);