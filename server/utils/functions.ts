import { Channel, Message, User } from "@prisma/client";
import { Server } from "socket.io";
import { createHash } from "crypto";
import { users } from "./types";
import {
    addMessageToChannel,
    addNotificationToChannel,
    addPrivateMessage,
} from "../procedures/messages";
import { getSocketIdByUserId } from "../procedures/users";

const sendMessage = (
    io: Server,
    opts: {
        sender: { username: string; nickname: string };
        recipient: string;
        message: Message;
    },
    isPrivate: boolean,
) => {
    io.to(opts.recipient).emit(
        isPrivate ? "receive private message" : "receive message",
        {
            sender: opts.sender,
            content: opts.message.content,
            date: opts.message.date,
        },
        opts.recipient,
    );
};

export const handleMessage = async (
    io: Server,
    {
        channel,
        sender,
        content,
    }: {
        channel: Channel;
        sender: User;
        content: string;
    },
) => {
    const message = await addMessageToChannel(channel, sender, content);

    sendMessage(
        io,
        {
            sender: { username: sender.username, nickname: sender.nickname },
            recipient: channel.name,
            message: message,
        },
        false,
    );
};

export const handlePrivateMessage = async (
    io: Server,
    {
        recipient,
        sender,
        content,
    }: {
        recipient: User;
        sender: User;
        content: string;
    },
) => {
    const socketId = getSocketIdByUserId(recipient.id);

    if (!socketId) return;

    const message = await addPrivateMessage(recipient, sender, content);

    sendMessage(
        io,
        {
            sender: { username: sender.username, nickname: sender.nickname },
            recipient: socketId,
            message: message,
        },
        true,
    );
};

export const handleNotification = async (
    io: Server,
    {
        channel,
        content,
    }: {
        channel: Channel;
        content: string;
    },
) => {
    const message = await addNotificationToChannel(channel, content);

    sendMessage(
        io,
        {
            sender: { username: "Thiscord", nickname: "Thiscord" },
            recipient: channel.name,
            message: message,
        },
        false,
    );
};

/**
 * Hashes a string with SHA256 and returns the digested hex
 *
 * @param rawPassword - The string to hash.
 * @returns the hashed string.
 */
export const hash = (rawPassword: string) => {
    return createHash("sha256").update(rawPassword).digest("hex");
};

export const getRandomJoinMessage = (user: User) => {
    const messages = [
        `${user.nickname} has joined the channel !`,
        `Everyone, say hi to ${user.nickname} !`,
        `${user.nickname} is here !`,
        `Glad to see you here ${user.nickname} !`,
    ];

    return randomChoice(messages);
};

export const randomChoice = (array: string[]) => {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
};

export const clearUserId = (id: number) => {
    for (let [socketId, userId] of users.entries()) {
        if (userId === id) users.delete(socketId);
    }
};
