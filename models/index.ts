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

export type SockerServerEventEmitter<T> = {
    name: string;
    data: T;
};

export interface ISocketActor {
    registerEvent<T>(name: string, handler: SocketServerEventHandlerDelegate<T>): SocketServerEventHandler<T>;
}

export interface ISocketServer extends ISocketActor {
    listen(host: string, port: number): void;
    emit<T>(eventName: string, data: T, socket: net.Socket): void;
}

export interface ISocketClient extends ISocketActor {
    connect(host: string, port: number): void;
    emit<T>(eventName: string, data: T): void;
}

export abstract class SocketActor implements ISocketActor {
    public events: Dictionary<SocketServerEventHandler<any>> = {};

    public registerEvent<T>(name: string, handler: SocketServerEventHandlerDelegate<T>) {
        this.events[name] = {
            name,
            handler
        };

        return <SocketServerEventHandler<T>>this.events[name];
    }
}


