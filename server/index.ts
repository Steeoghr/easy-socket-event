import { IIoSocketServer, SocketActor, SocketServerEmitter, SocketServerEvent, SocketServerEventEmitter, IoSocket, IoServer, HttpServer } from '../types';

export class SocketServer extends SocketActor implements IIoSocketServer {
    public clientsConnected: IoSocket[] = [];

    clientConnected: (socket: IoSocket) => void = () => {};
    onClose: (socket: IoSocket) => void = () => {};
    onError: (err: Error, socket: IoSocket) => void = () => {};
    onEmit: <T>(event: SocketServerEvent<T>, socket: IoSocket) => void = () => {};
    constructor(private io: IoServer, private server: HttpServer) {
        super();
        this.io.on('connection', (socket) => {
            this.clientConnected(socket);
            socket.emit("connected");
            socket.on("message", (message) => {
                this.handleEvent(socket, message);
            });

            socket.on('data', (...message: string[]) => this.handleEvent(socket, message[1]));
            socket.on('disconnect', () => this.handleClose(socket));
            socket.on('error', (err) => this.handleError(err, socket));
        });
    }

    private handleEvent<T>(socket: IoSocket, message: string) {
        console.log("message", message)
        const messageEvent: SocketServerEvent<T> = JSON.parse(message);
        const registeredEvent = this.events[messageEvent.name];

        if (!registeredEvent) {
            throw new Error(`Event ${messageEvent.name} not registered`);
        }

        registeredEvent.handler(messageEvent.data, socket);
    };

    private handleClose(socket: IoSocket) {
        this.clientsConnected = this.clientsConnected.filter(client => client.conn.remoteAddress !== socket.conn.remoteAddress);
        console.log('Client disconnected:', socket.conn.remoteAddress, this.clientsConnected.length);
        this.onClose(socket);
    };

    private handleError(err: Error, socket: IoSocket) {
        console.error('Socket error:', err.message);
        this.onError(err, socket);
    };

    protected emit<T>(eventName: string, data: T, socket: IoSocket) {
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
            emit: <T>(eventName: S, socket: IoSocket, data?: T) => {
                self.emit(eventName, data, socket);
            }
        };
    }

    public EventEmitter<T>(eventName: string): SocketServerEventEmitter<T> {
        const self = this;
        return <SocketServerEventEmitter<T>> {
            emit: <T>(socket: IoSocket, data?: T) => {
                self.emit(eventName, data, socket);
            }
        };
    }


    public Listen(port: number) {
        this.server.listen(port, () => {
          console.log(`Server listening on ${port}`);
        });
    }
}