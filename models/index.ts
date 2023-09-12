import { Server, Socket, createServer } from 'net';
import { Dictionary } from 'utility/dictionary';

// define the net socket and server types
export class NetSocket extends Socket {
    
}
export class NetServer extends Server {

}

// define the function to create a net server
export function NetCreateServer(): NetServer {
    return createServer();
}

// Define the type of the function to handle the event.
export type SocketServerEventHandlerDelegate<T> = (data: T, sender: Socket) => void;

// Define the type of the object that will hold the event name and the handler.
export interface SocketServerEventHandler<T> {
    name: string;
    handler: SocketServerEventHandlerDelegate<T>;
};

// Define the type of the event data
export type SocketServerEvent<T> = {
    name: string;
    data: T;
};

// Client Emitter types
export type SocketClientEmitterResultDelegate<S extends string> = <T>(eventName: S, data?: T) => void;
export type SocketClientEventEmitterResultDelegate = <T>(data?: T) => void;

export interface SocketClientEventEmitter<T> {
    emit(data?: T): SocketClientEventEmitterResultDelegate;
}

export interface SocketClientEmitter<S extends string> {
    emit<T>(eventName: S, data?: T): SocketClientEmitterResultDelegate<S>;
}

// Server Emitter types

// Create a type alias for the emit method of server event emitter
type SocketServerEventEmitterResultDelegate = <T>(socket: Socket, data?: T) => void;
// Create a type alias for the emit method of server emitter
type SocketServerEmitterResultDelegate<S extends string> = <T>(eventName: S, socket: Socket, data?: T) => void;

// Define the type of the server event emitter
export interface SocketServerEventEmitter<T> {
    emit(socket: Socket, data?: T): SocketServerEventEmitterResultDelegate;
}

// Define the type of the server emitter
export interface SocketServerEmitter<S extends string> {
    emit<T>(eventName: S, data?: T): SocketServerEmitterResultDelegate<S>;
}


// Define the interface of base socket actor
export interface ISocketActor {
    Event<T>(name: string, handler: SocketServerEventHandlerDelegate<T>): SocketServerEventHandler<T>;
}

// Define the base socket actor
export abstract class SocketActor implements ISocketActor {
    public events: Dictionary<SocketServerEventHandler<any>> = {};

    public Event<T>(name: string, handler: SocketServerEventHandlerDelegate<T>) {
        this.events[name] = {
            name,
            handler
        };

        return <SocketServerEventHandler<T>>this.events[name];
    }
}

// Define the interface of socket server
export interface ISocketServer extends ISocketActor {
    Listen(host: string, port: number): void;
    Emitter<S extends string>(...params: S[]): SocketServerEmitter<S>;
    EventEmitter<T>(eventName: string): SocketServerEventEmitter<T>;
    clientConnected: (socket: Socket) => void;
    onClose: (socket: Socket) => void;
    onError: (err: Error, socket: Socket) => void;
    onEmit: <T>(event: SocketServerEvent<T>, socket: Socket) => void;
}

// Define the interface of socket client
export interface ISocketClient extends ISocketActor {
    Connect(host: string, port: number): void;
    Emitter<S extends string>(...params: S[]): SocketClientEmitter<S>;
    EventEmitter<T>(eventName: string): SocketClientEventEmitter<T>;
    connected: () => void;
    onClose: () => void;
    onError: (err: Error) => void;
    onEmit: <T>(event: SocketServerEvent<T>) => void;
}