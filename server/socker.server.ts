import * as net from 'net';
import { ISocketServer, SocketActor, SocketServerEmitter, SocketServerEvent, SocketServerEventEmitter } from '../models';

// creazione di una classe SocketServer che permetta la gestione di sottoeventi nell'evento "data"
export class SocketServer extends SocketActor implements ISocketServer {
    private server: net.Server;
    public clientsConnected: net.Socket[] = [];

    public clientConnected: (socket: net.Socket) => void = () => {};
    public onClose: () => void = () => {};
    public onError: (err: Error) => void = () => {};
    public onEmit: <T>(event: SocketServerEvent<T>, socket: net.Socket) => void = <T>() => {};

    constructor() {
        super();
        this.server = net.createServer();
        this.server.on('connection', (socket: net.Socket) => {
            console.log('Client connected:', socket.remoteAddress, socket.remotePort);
            this.clientsConnected.push(socket);
            this.clientConnected(socket);

            socket.on('data', (message: string) => this.handleEvent(socket, message));
            socket.on('close', () => this.handleClose(socket));
            socket.on('error', (err) => this.handleError(err));
        });
    }

    private handleEvent<T>(socket: net.Socket, message: string) {
        const messageEvent: SocketServerEvent<T> = JSON.parse(message);
        const registeredEvent = this.events[messageEvent.name];

        if (!registeredEvent) {
            console.error(`Event ${messageEvent.name} not registered`);
            return;
        }

        registeredEvent.handler(messageEvent.data, socket);
    };

    private handleClose(socket: net.Socket) {
        console.log('Client disconnected:', socket.remoteAddress, socket.remotePort);
        this.onClose();
    };

    private handleError(err: Error) {
        console.error('Socket error:', err.message);
        this.onError(err);
    };

    protected emit<T>(eventName: string, data: T, socket: net.Socket) {
        const event = {
            name: eventName,
            data
        };

        socket.write(JSON.stringify(event));

        this.onEmit(event, socket);
    }

    public Emitter<S extends string>(...params: S[]): SocketServerEmitter<S> {
        const self = this;
        return <SocketServerEmitter<S>> {
            emit: <T>(eventName: S, socket: net.Socket, data?: T) => {
                self.emit(eventName, data, socket);
            }
        };
    }

    public EventEmitter<T>(eventName: string): SocketServerEventEmitter<T> {
        return <SocketServerEventEmitter<T>> {
            emit: <T>(socket: net.Socket, data?: T) => {
                this.emit(eventName, data, socket);
            }
        };
    }

    public Listen(host: string, port: number) {
        this.server.listen(port, host, () => {
          console.log(`Server listening on ${host}:${port}`);
        });
    }

    public broadcast(message: string, sender: net.Socket) {
        this.clientsConnected.forEach(user => {
            if (user !== sender) {
                this.emit("boradcast", message, user);
            }
        });
    }
}