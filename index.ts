import { SocketServer } from './server';
import { SocketClient } from './client';
import {createServer as _createServer} from './server/functions';
import {createClient as _createClient} from './client/functions';

export function createServer() {
    return _createServer();
}
export function createClient(host: string) {
    return _createClient(host);
}

export {
    SocketServer,
    SocketClient,
}