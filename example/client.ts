import { NetSocket } from "types";
import { SocketClient } from "../client";

// Create a new socket client
const client = new SocketClient();

// Create a new event emitter for the "example" event
const {emit:exampleEmit} = client.EventEmitter<string>("example");

// Called when the client is connected to the server
client.connected = () => {
    console.log("Client connected");
    // Emit an event on the "example" channel
    exampleEmit("Example event emit")
};

// Create a new event handler for the "example-response" event
client.Event<string>("example-response", (data: string, sender: NetSocket) => {
    console.log("\"example-response\" client event handler >>>", data);
});

// Connect the client to the server
client.Connect("localhost", 3001);