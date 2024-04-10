import { EventSocket } from "../types";
import { createServer } from "../server/functions";
// @ts-ignore
import express from "express";

const app = express();

// Configura EJS come motore di template
// Specifica la cartella contenente i file HTML

app.get("/", (req: any, res: any) => {
    res.send('Server running');
})

// create an instance of the SocketServer class
const server = createServer(app, "https://localhot:3000");

// create an event emitters
const {emit:exampleResponseEmit} = server.EventEmitter<string>("example-response");

// create an event handler
server.Event<string>("example", (data: string, sender: EventSocket) => {  
    console.log("\"example\" event handler >>>", data)

    // emit an event
    exampleResponseEmit(sender, "Server example response for: " + data);
});

// start listening
server.Listen(3000);