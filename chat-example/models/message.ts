import * as net from "net";

export type MessageSocketEvent = {
    from: string,
    to: string,
    message: string,
    key: string,
};

// export class MessageSocketEventHandler implements SocketServerEventHandler<MessageSocketEvent> {
//     name: string = "message";

//     constructor(public onMessageReceived: (data: MessageSocketEvent, sender: net.Socket) => void) {
//     }

//     public handler(data: MessageSocketEvent, sender: net.Socket): void {
//         this.onMessageReceived(data, sender);
//     }
// }
