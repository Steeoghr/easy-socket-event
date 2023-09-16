import { SocketServer } from './server';
import { SocketClient } from './client';
import {createServer as _createServer} from './server/functions';
import {createClient as _createClient} from './client/functions';
import { EventSocket } from './types';

export function createServer(expressApp: any) {
    return _createServer(expressApp);
}
export function createClient(host: string, connected: () => void) {
    return _createClient(host, connected);
}

export {
    SocketServer,
    SocketClient,
    EventSocket,
}