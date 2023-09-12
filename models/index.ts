import * as net from 'net';
import { Dictionary } from 'utility/dictionary';

export type SocketServerEvent<T> = {
    name: string;
    data: T;
};

export type SocketServerEventHandlerDelegate<T> = (data: T, sender: net.Socket) => void;

export type SocketServerEventHandler<T> = {
    name: string;
    handler: SocketServerEventHandlerDelegate<T>;
};


// Client Emitter types
export type SocketClientEmitterResultDelegate<S extends string> = <T>(eventName: S, data?: T) => void;
export type SocketClientEventEmitterResultDelegate = <T>(data?: T) => void;

export type SocketClientEventEmitter<T> = {
    emit(data?: T): SocketClientEventEmitterResultDelegate;
}

export type SocketClientEmitter<S extends string> = {
    emit<T>(eventName: S, data?: T): SocketClientEmitterResultDelegate<S>;
}

// Server Emitter types
export type SocketServerEmitterResultDelegate<S extends string> = <T>(eventName: S, socket: net.Socket, data?: T) => void;
export type SocketServerEventEmitterResultDelegate = <T>(socket: net.Socket, data?: T) => void;


export type SocketServerEventEmitter<T> = {
    emit(socket: net.Socket, data?: T): SocketServerEventEmitterResultDelegate;
}

export type SocketServerEmitter<S extends string> = {
    emit<T>(eventName: S, data?: T): SocketServerEmitterResultDelegate<S>;
}


export interface ISocketActor {
    Event<T>(name: string, handler: SocketServerEventHandlerDelegate<T>): SocketServerEventHandler<T>;
    // defineEmit() TODO
}

export interface ISocketServer extends ISocketActor {
    Listen(host: string, port: number): void;
    Emitter<S extends string>(...params: S[]): SocketServerEmitter<S>;
    EventEmitter<T>(eventName: string): SocketServerEventEmitter<T>;
    clientConnected: (socket: net.Socket) => void;
    onClose: () => void;
    onError: (err: Error) => void;
    onEmit: <T>(event: SocketServerEvent<T>, socket: net.Socket) => void;
}

export interface ISocketClient extends ISocketActor {
    Connect(host: string, port: number): void;
    Emitter<S extends string>(...params: S[]): SocketClientEmitter<S>;
    EventEmitter<T>(eventName: string): SocketClientEventEmitter<T>;
    connected: () => void;
    onClose: () => void;
    onError: (err: Error) => void;
    onEmit: <T>(event: SocketServerEvent<T>) => void;
}

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


