import { SocketServer } from './server';
import { SocketClient } from './client';
import {createServer as _createServer} from './server/functions';
import {createClient as _createClient} from './client/functions';

export function createServer() {
    return _createServer();
}
export function createClient(host: string, connected: () => void) {
    return _createClient(host, connected);
}

export {
    SocketServer,
    SocketClient,
}