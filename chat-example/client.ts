import { createClient } from "../client/functions";
import * as net from "net";
// @ts-ignore
import * as blessed from 'blessed';
import { generateKeys } from './core/keys-pair-generator';
import { RSACryptor } from './core/message-cryptor';
import { RSADecryptor } from './core/message-decryptor';
import {ConnectionInfo} from "./models/connection";
import {ConnectionResponse} from "./models/connection-response";
import { NetUserInfo } from "./models/user";
import { MessageSocketEvent } from "./models/message";
import { EventSocket } from "types";

// recupero delle chiavi pubblica e privata col metodo generteKeys
const { privateKey, publicKey } = generateKeys();

const decryptor = new RSADecryptor(privateKey);

let readlineSync = require('readline-sync');

const username = readlineSync.question("Enter your username: ");
const to = readlineSync.question("Enter your friend username: ");

readlineSync = undefined;

let toUser: NetUserInfo | null = null;

const host= "ws://prova-chat-server-ce604a0974e3.herokuapp.com";

const client = createClient(host, () => {
  // console.log("Client connected");
  connectionEmit({
      to,
      username,
      key: publicKey
  });
});

const {emit:connectionEmit} = client.EventEmitter<ConnectionInfo>("connection");
const {emit:messageEmit} = client.EventEmitter<MessageSocketEvent>("message");

// init blessed

// Crea la schermata principale
const screen = blessed.screen({
    smartCSR: true,
    title: 'Chat CLI Example'
  });
  
  // Crea un riquadro per visualizzare i messaggi della chat
  const chatBox = blessed.box({
    top: 0,
    left: 0,
    width: '100%',
    height: '90%',
    content: '',
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: ' ',
      inverse: true,
      style: {
        bg: 'yellow'
      }
    },
    style: {
      fg: 'black',
      bg: 'white'
    }
  });
  
  // Crea un riquadro di input per l'utente
  const inputBox = blessed.textbox({
    bottom: 0,
    left: 0,
    width: '100%',
    height: '10%',
    inputOnFocus: true,
    style: {
      fg: 'white',
      bg: 'teal'
    }
  });
  
  // Aggiungi i riquadri alla schermata
  screen.append(chatBox);
  screen.append(inputBox);
  
  // Gestisci l'invio del messaggio
  inputBox.key('enter', () => {
    const input = inputBox.getValue();
    
    if (!input || !toUser) return;
  
    if (input === "FORCE_EXIT") {
      process.exit(0);
    }
  
    const cryptor = new RSACryptor(toUser.key);
    const message = {
        from: username,
        to,
        message: cryptor.execute(input),
        key: publicKey,
      } as MessageSocketEvent;
    messageEmit(message);
  
    chatBox.content += `\n[You] >>> ${input}`;
    inputBox.clearValue();
    chatBox.setScrollPerc(100);
    inputBox.focus();
    screen.render();
  });
  
  // focus input con Ctrl-W
  screen.key(['C-w'], () => {
    inputBox.focus();
    screen.render();
  });

  // focus input con Ctrl-W
  inputBox.key(['C-c'], () => {
    process.exit(0);
  });
  // Esci dall'app con Ctrl+C
  screen.key(['C-c'], () => {
    process.exit(0);
  });
  

let init = false;

// export const testHandler = client.registerHandler<string>();

client.Event<ConnectionResponse>("connection-response", (data: ConnectionResponse, sender: EventSocket) => {
    // console.log("connection response event handler", data)
    
    if (!data.connected) {
        console.log("Connection refused");
        return;
    }
    
    const user = data.user;
    // console.log("Connection response", user);
    toUser = user;
    if (!toUser){
        console.log("Waiting a message by [" + to + "]...");
        return;
    }

    init = true;
    // Esegui la schermata
    screen.render();
    inputBox.focus();
});


client.Event("message", (message: MessageSocketEvent, sender: EventSocket) => {
    if (!toUser) {
        toUser = { 
          username: message.from,
          key: message.key
        };
      } else {
        console.log("ottengo key")
        toUser.key = message.key;
    }
    
    if (toUser && !init) {
        init = true;
        console.clear();
    }

    const decryptedMessage = decryptor.execute(message.message);

    chatBox.content += `\n[${message.from}] >>> ${decryptedMessage}`;
    
    chatBox.setScrollPerc(100);
    inputBox.focus();
    screen.render();
});