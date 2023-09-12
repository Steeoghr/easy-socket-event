import { SocketServer } from "../server/socker.server";
import * as net from "net";

const server = new SocketServer();

// Register the handler for an example event
server.registerEvent<string>("example", (data: string, sender: net.Socket) => {  
    console.log("\"example\" event handler >>>", data)
    
    // Return a message to sender
    server.emit("example-response", "Server example response for: " + data, sender);
});

server.listen("localhost", 3001);