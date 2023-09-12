import { NetSocket, NetServer, NetCreateServer, ISocketServer, SocketActor, SocketServerEmitter, SocketServerEvent, SocketServerEventEmitter } from '../types';

export class SocketServer extends SocketActor implements ISocketServer {
    private server: NetServer;
    public clientsConnected: NetSocket[] = [];

    public clientConnected: (socket: NetSocket) => void = () => {};
    public onClose: (socket: NetSocket) => void = () => {};
    public onError: (err: Error, socket: NetSocket) => void = () => {};
    public onEmit: <T>(event: SocketServerEvent<T>, socket: NetSocket) => void = <T>() => {};

    constructor() {
        super();
        this.server = NetCreateServer();
        this.server.on('connection', (socket: NetSocket) => {
            console.log('Client connected:', socket.remoteAddress, socket.remotePort);
            this.clientsConnected.push(socket);
            this.clientConnected(socket);

            socket.on('data', (message: string) => this.handleEvent(socket, message));
            socket.on('close', () => this.handleClose(socket));
            socket.on('error', (err) => this.handleError(err, socket));
        });
    }

    private handleEvent<T>(socket: NetSocket, message: string) {
        const messageEvent: SocketServerEvent<T> = JSON.parse(message);
        const registeredEvent = this.events[messageEvent.name];

        if (!registeredEvent) {
            throw new Error(`Event ${messageEvent.name} not registered`);
        }

        registeredEvent.handler(messageEvent.data, socket);
    };

    private handleClose(socket: NetSocket) {
        console.log('Client disconnected:', socket.remoteAddress, socket.remotePort);
        this.onClose(socket);
    };

    private handleError(err: Error, socket: NetSocket) {
        console.error('Socket error:', err.message);
        this.onError(err, socket);
    };

    protected emit<T>(eventName: string, data: T, socket: NetSocket) {
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
            emit: <T>(eventName: S, socket: NetSocket, data?: T) => {
                self.emit(eventName, data, socket);
            }
        };
    }

    public EventEmitter<T>(eventName: string): SocketServerEventEmitter<T> {
        return <SocketServerEventEmitter<T>> {
            emit: <T>(socket: NetSocket, data?: T) => {
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