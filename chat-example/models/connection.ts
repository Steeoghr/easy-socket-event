// import { Socket } from "net";
// import { ConnectionInfo, ConnectionSocketEventResponse, SocketServerEventHandler } from "../../models";
// import { NetUser } from "../../../server/tunnelServer";
// import * as net from "net";

export type ConnectionInfo = {
    username: string;
    key: string;
    to: string;
}

// export class ConectionSocketEventHandler implements SocketServerEventHandler<ConnectionInfo> {
//     name: string = "connection";

//     constructor(public responseEmitter: (socket: net.Socket, data: ConnectionInfo) => void) {
//     }

//     public handler(data: ConnectionInfo, sender: net.Socket): void {
//         this.responseEmitter(sender, data);
//     }
// }
