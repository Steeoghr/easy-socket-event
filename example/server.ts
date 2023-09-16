import { EventSocket } from "../types";
import { createServer } from "../server/functions";
// @ts-ignore
import express from "express";
import path from "path";
import fs from "fs";

const app = express();

// Configura EJS come motore di template
app.set('view engine', 'ejs');
// ../../../
const views = 'views';
const relPath = path.join(__dirname, views);
console.log("relPath", relPath)
// Specifica la cartella contenente i file HTML
app.set('views', relPath);

app.get("/", (req: any, res: any) => {
    res.render('index');
})

// create an instance of the SocketServer class
const server = createServer(app);

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