import { NetSocket } from "types";
import { SocketServer } from "../server";

// create an instance of the SocketServer class
const server = new SocketServer();

// create an event emitter
const {emit:exampleResponseEmit} = server.EventEmitter<string>("example-response");

// create an event handler
server.Event<string>("example", (data: string, sender: NetSocket) => {  
    console.log("\"example\" event handler >>>", data)

    // emit an event
    exampleResponseEmit(sender, "Server example response for: " + data);
});

// start listening
server.Listen("localhost", 3001);