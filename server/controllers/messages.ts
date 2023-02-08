import { Server, Socket } from "socket.io";
import { getChannelByName } from "../procedures/channels";
import {
    getSocketIdByUserId,
    getUserBySocketId,
    getUserByUsername,
} from "../procedures/users";
import { handleMessage, handlePrivateMessage } from "../utils/functions";

export const onSendMessage = (io: Server, socket: Socket) => {
    socket.on("send message", async (channelName: string, content: string) => {
        const user = await getUserBySocketId(socket.id);
        const channel = await getChannelByName(channelName);

        if (!user || !channel) return;

        await handleMessage(io, {
            channel: channel,
            sender: user,
            content: content,
        });

        console.log(
            `In #${channel.name}, ${user.nickname} [${user.username}] said "${content}"`,
        );
    });
};

export const onSendPrivateMessage = (io: Server, socket: Socket) => {
    socket.on(
        "send private message",
        async (username: string, content: string) => {
            const user = await getUserBySocketId(socket.id);
            const recipient = await getUserByUsername(username);

            if (!user || !recipient) return;

            await handlePrivateMessage(io, {
                sender: user,
                recipient: recipient,
                content: content,
            });

            console.log(
                `To ${recipient.nickname} [${recipient.username}], ${user.nickname} [${user.username}] said "${content}"`,
            );
        },
    );
};
