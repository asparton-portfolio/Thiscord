import { createContext } from "react";
import io from "socket.io-client";

export class ClientSocket {
    static SERVER_URL = "http://localhost:4000";

    constructor() {
        this.joinedChannels = new Set();
        this.ownedChannels = new Set();
        this.username = null;
        this.nickname = null;
    }

    register(username, password, callback) {
        if (!this.socket) this.socket = io(ClientSocket.SERVER_URL);
        this.socket.emit("register", username, password, callback);
    }

    login(username, password, callback) {
        if (!this.socket) this.socket = io(ClientSocket.SERVER_URL);
        this.socket.emit("log in", username, password, callback);
    }

    setNickname(nickname) {
        this.socket.emit("set nickname", nickname);
        this.nickname = nickname;
    }

    listChannels(query, cb) {
        this.socket.emit("list channels", query, cb);
    }

    joinChannel(channelName) {
        this.socket.emit("join channel", channelName);
        this.getChannelHistory(channelName);
    }

    quitChannel(channelName) {
        this.socket.emit("quit channel", channelName);
        this.joinedChannels.delete(channelName);
        this.ownedChannels.delete(channelName);
    }

    createChannel(channelName, cb) {
        this.socket.emit("create channel", channelName, cb);
    }

    getChannelHistory(channelName) {
        this.socket.emit("channel history", channelName);
    }

    deleteChannel(channelName) {
        this.socket.emit("delete channel", channelName);
        this.joinedChannels.delete(channelName);
        this.ownedChannels.delete(channelName);
    }

    renameChannel(currentChannelName, newChannelName) {
        this.socket.emit("rename channel", currentChannelName, newChannelName);
    }

    sendMessage(channelName, content) {
        this.socket.emit("send message", channelName, content);
    }

    getPCs(cb) {
        this.socket.emit("get conversations", cb);
    }

    sendPrivateMessage(recipient, content) {
        this.socket.emit("send private message", recipient, content);
    }

    localJoinChannel(channelName) {
        this.joinedChannels.add(channelName);
    }

    localQuitChannel(channelName) {
        this.joinedChannels.delete(channelName);
        this.ownedChannels.delete(channelName);
    }

    channelJoined(channelName) {
        return this.joinedChannels.has(channelName);
    }

    ownChannel(channelName) {
        this.localJoinChannel(channelName);
        this.ownedChannels.add(channelName);
    }
}

export const ClientSocketContext = createContext(new ClientSocket());
