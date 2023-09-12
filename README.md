# Socket comunication by event

## Use events to communicate via socket; Make managing socket communications between your clients and your server easier, more readable (and more typified)

Install package socket-event


# Server
## Create the socket server
```js
import { SocketServer } from "socket-event/server";

const server = new SocketServer();
 ```

## Add an event to server
```js
// Register the handler for an example event
server.Event<string>("example", (data: string, sender: net.Socket) => {  
    console.log("\"example\" event handler >>>", data);
});
 ```

## Liste to the server
```js
server.Listen("localhost", 3001);
 ```

# Client
## Create the socket client and set connected event
```js
import { SocketClient } from "socket-event/client";

const client = new SocketClient();
 ```

## Create event emitter
```js
const {emit:exampleEmit} = client.EventEmitter<string>("example");
 ```

## Connect the client
```js
client.Connect("localhost", 3001);
 ```
When connected, emit the event
```js
client.connected = () => {
    console.log("Client connected");
    exampleEmit("Example event emit")
};
 ```

