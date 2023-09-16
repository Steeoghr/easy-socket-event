
import {Server} from "socket.io";
// @ts-ignore
import express from "express";
import http from "http";
import { SocketServer } from "../server";
import path from "path";
import fs from "fs";

export function createServer() {
    const app = express();

    // Configura EJS come motore di template
    app.set('view engine', 'ejs');
// ../../../
const views = '../views';
    const relPath = path.join(__dirname, views);
    console.log("relPath", relPath)
    // Specifica la cartella contenente i file HTML
    app.set('views', relPath);

    const server = http.createServer(app);
    const io = new Server(server);
    app.get("/", (req: any, res: any) => {
        res.render('index');
    })
    return new SocketServer(io, server, app);
}