import { ISocketClient, SocketActor, SocketClientEmitter, SocketServerEvent, SocketClientEventEmitter, IoSocket, IoClientSocket } from '../types';

export class SocketClient extends SocketActor implements ISocketClient {
    public onClose: () => void = () => {};
    public onError: (err: Error) => void = () => {};
    public onEmit: <T>(event: SocketServerEvent<T>) => void = <T>(event: SocketServerEvent<T>) => {};
    
    constructor(public socket: IoClientSocket) {
        super();
        this.socket.on('message', (message: string) => this.handleEvent(message));
        this.socket.on('close', this.handleClose);
        this.socket.on('error', (err) => this.handleError(err));
    }

    private handleEvent<T>(message: string) {
        const messageEvent: SocketServerEvent<T> = JSON.parse(message);
        const registeredEvent = this.events[messageEvent.name];

        if (!registeredEvent) {
            console.error(`Event ${messageEvent.name} not registered`);
            return;
        }

        registeredEvent.handler(messageEvent.data, this.socket);
    };

    private handleClose() {
        console.log('Client disconnected');
        this.onClose();
    };

    private handleError(err: Error) {
        console.error('Socket error:', err.message);
        this.onError(err);
    };

    protected emit<T>(eventName: string, data?: T) {
        const event = {
            name: eventName,
            data
        };

        this.socket.emit("message", JSON.stringify(event));
        this.onEmit(event);
    }

    public Emitter<S extends string>(...params: S[]): SocketClientEmitter<S> {
        const self = this;
        return <SocketClientEmitter<S>> {
            emit: <T>(eventName: S, data?: T) => {
                self.emit(eventName, data);
            }
        };
    }

    public EventEmitter<T>(eventName: string): SocketClientEventEmitter<T> {
        return <SocketClientEventEmitter<T>> {
            emit: <T>(data?: T) => {
                this.emit(eventName, data);
            }
        };
    }
}