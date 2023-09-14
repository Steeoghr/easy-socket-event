import { EventSocket } from "types";
import { createServer } from "../server/functions";

// create an instance of the SocketServer class
const server = createServer();

// create an event emitter
const {emit:exampleResponseEmit} = server.EventEmitter<string>("example-response");

// create an event handler
server.Event<string>("example", (data: string, sender: EventSocket) => {  
    console.log("\"example\" event handler >>>", data)

    // emit an event
    exampleResponseEmit(sender, "Server example response for: " + data);
});

// start listening
server.Listen(3000);