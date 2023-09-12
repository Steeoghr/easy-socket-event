import { SocketServer } from "../server/socker.server";
import * as net from "net";

const server = new SocketServer();

const {emit:exampleResponseEmit} = server.EventEmitter<string>("example-response");

// Register the handler for an example event
server.Event<string>("example", (data: string, sender: net.Socket) => {  
    console.log("\"example\" event handler >>>", data)
    
    // Return a message to sender
    exampleResponseEmit(sender, "Server example response for: " + data);
});

server.Listen("localhost", 3001);