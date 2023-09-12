import {Socket, Server, createServer} from 'net';
import { ISocketServer, SocketActor, SocketServerEmitter, SocketServerEvent, SocketServerEventEmitter } from '../models';

export class SocketServer extends SocketActor implements ISocketServer {
    private server: Server;
    public clientsConnected: Socket[] = [];

    public clientConnected: (socket: Socket) => void = () => {};
    public onClose: (socket: Socket) => void = () => {};
    public onError: (err: Error, socket: Socket) => void = () => {};
    public onEmit: <T>(event: SocketServerEvent<T>, socket: Socket) => void = <T>() => {};

    constructor() {
        super();
        this.server = createServer();
        this.server.on('connection', (socket: Socket) => {
            console.log('Client connected:', socket.remoteAddress, socket.remotePort);
            this.clientsConnected.push(socket);
            this.clientConnected(socket);

            socket.on('data', (message: string) => this.handleEvent(socket, message));
            socket.on('close', () => this.handleClose(socket));
            socket.on('error', (err) => this.handleError(err, socket));
        });
    }

    private handleEvent<T>(socket: Socket, message: string) {
        const messageEvent: SocketServerEvent<T> = JSON.parse(message);
        const registeredEvent = this.events[messageEvent.name];

        if (!registeredEvent) {
            throw new Error(`Event ${messageEvent.name} not registered`);
        }

        registeredEvent.handler(messageEvent.data, socket);
    };

    private handleClose(socket: Socket) {
        console.log('Client disconnected:', socket.remoteAddress, socket.remotePort);
        this.onClose(socket);
    };

    private handleError(err: Error, socket: Socket) {
        console.error('Socket error:', err.message);
        this.onError(err, socket);
    };

    protected emit<T>(eventName: string, data: T, socket: Socket) {
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
            emit: <T>(eventName: S, socket: Socket, data?: T) => {
                self.emit(eventName, data, socket);
            }
        };
    }

    public EventEmitter<T>(eventName: string): SocketServerEventEmitter<T> {
        return <SocketServerEventEmitter<T>> {
            emit: <T>(socket: Socket, data?: T) => {
                this.emit(eventName, data, socket);
            }
        };
    }

    public Listen(host: string, port: number) {
        this.server.listen(port, host, () => {
          console.log(`Server listening on ${host}:${port}`);
        });
    }
}