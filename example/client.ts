import { SocketClient } from "../client/socket.client";
import * as net from "net";

const client = new SocketClient();

const {emit:exampleEmit} = client.EventEmitter<string>("example");

client.connected = () => {
    console.log("Client connected");
    exampleEmit("Example event emit")
};

client.Event<string>("example-response", (data: string, sender: net.Socket) => {
    console.log("\"example-response\" client event handler >>>", data);
});

client.Connect("localhost", 3001);