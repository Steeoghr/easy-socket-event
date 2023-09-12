// import { Socket } from "net";
// import { ConnectionInfo, SocketServerEventHandler } from "refactor/models";
// import { NetUser } from "../../../server/tunnelServer";
// import * as net from "net";
import { NetUserInfo } from "./user";

export type ConnectionResponse = {
    connected: boolean;
    user: NetUserInfo | null;
};

// export class ConectionResponseSocketEventHandler implements SocketServerEventHandler<ConnectionSocketEventResponse> {
//     name: string = "connection-response";

//     constructor(public connected: (user: NetUserInfo | null) => void) {
//     }
    
//     public handler(data: ConnectionSocketEventResponse, sender: Socket): void {
//         console.log("Connection response handler");
//         if (data.connected) {
//             this.connected(data.user);
//         }
//     }
// }
