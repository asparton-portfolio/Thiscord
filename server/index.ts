import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

import {
    onAskHistory,
    onCreateChannel,
    onDeleteChannel,
    onJoinChannel,
    onListChannels,
    onQuitChannel,
    onRenameChannel,
} from "./controllers/channels";
import { onSendMessage, onSendPrivateMessage } from "./controllers/messages";
import {
    onGetConversations,
    onLogIn,
    onRegister,
    onSetNickname,
} from "./controllers/users";

const app = express();
const port = parseInt(process.env.PORT || "4000");

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket: Socket) => {
    // When a new nickname is set
    onSetNickname(io, socket);

    // When a new user registers
    onRegister(socket);

    // When a user login
    onLogIn(socket);

    // When a user creates a channel
    onCreateChannel(io, socket);

    // When a user joins a channel
    onJoinChannel(io, socket);

    // When a user quits a channel
    onQuitChannel(io, socket);

    // When a user deletes a channel
    onDeleteChannel(io, socket);

    // When a channel is renamed
    onRenameChannel(io, socket);

    // When a user asks for the list of channels
    onListChannels(socket);

    // When a user asks for the history (messages) of a channel
    onAskHistory(io, socket);

    // When a user asks for the user he has talked to
    onGetConversations(socket);

    // When a user sends a mesage in a channel
    onSendMessage(io, socket);

    // When a user sends a private message
    onSendPrivateMessage(io, socket);
});

server.listen(port, () => console.log(`:: Server listening on port ${port}`));
