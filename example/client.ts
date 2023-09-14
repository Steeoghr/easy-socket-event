import { EventSocket } from "types";
import { SocketClient } from "../client";
import { createClient } from "../client/functions";

// Create a new socket client
const client = createClient("ws://localhost:3000");

// Create a new event emitter for the "example" event
const {emit:exampleEmit} = client.EventEmitter<string>("example");

// Called when the client is connected to the server
client.connected = () => {
    console.log("Client connected");
    // Emit an event on the "example" channel
    exampleEmit("Example event emit")
};

// Create a new event handler for the "example-response" event
client.Event<string>("example-response", (data: string, sender: EventSocket) => {
    console.log("\"example-response\" client event handler >>>", data);
});