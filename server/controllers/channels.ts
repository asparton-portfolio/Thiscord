import { Server, Socket } from "socket.io";
import {
    getSocketIdByUserId,
    getUserBySocketId,
    getUserByUsername,
} from "../procedures/users";
import {
    addUserToChannel,
    createChannel,
    deleteChannel,
    getChannelByName,
    getChannelMembers,
    getChannelMessages,
    getChannels,
    getPrivateMessages,
    removeUserFromChannel,
    renameChannel,
    searchChannelByName,
} from "../procedures/channels";
import { getRandomJoinMessage, handleNotification } from "../utils/functions";
import { Channels } from "../utils/types";

export const onCreateChannel = (io: Server, socket: Socket) => {
    socket.on(
        "create channel",
        async (
            channelName: string,
            available: (isAvailable: boolean) => void,
        ) => {
            const user = await getUserBySocketId(socket.id);

            if (!user) {
                return;
            }

            if ((await getChannelByName(channelName)) !== null) {
                available(false);
                return;
            }

            const channel = await createChannel(channelName, user);
            await addUserToChannel(user, channel);

            socket.join(channel.name);
            io.emit("new channel", channel.name, {
                nickname: user.nickname,
                username: user.username,
            });

            console.log(
                `New channel ${channel.name} created by ${user.nickname} [${user.username}]`,
            );

            // On sait jamais
            available(true);
        },
    );
};

export const onJoinChannel = (io: Server, socket: Socket) => {
    socket.on("join channel", async (channelName: string) => {
        const user = await getUserBySocketId(socket.id);

        if (!user) return;

        const channel = await getChannelByName(channelName);

        if (!channel) return; // TODO: check is channel already contains user

        socket.join(channel.name);

        await handleNotification(io, {
            channel: channel,
            content: getRandomJoinMessage(user),
        });

        io.to(channel.name).emit(
            "user joined",
            { nickname: user.nickname, username: user.username },
            channel.name,
        );

        addUserToChannel(user, channel);
        console.log(
            `${user.nickname} [${user.username}] joined the channel ${channel.name}`,
        );
    });
};

export const onQuitChannel = (io: Server, socket: Socket) => {
    socket.on("quit channel", async (channelName: string) => {
        const user = await getUserBySocketId(socket.id);

        const channel = await getChannelByName(channelName);

        if (!user || !channel) return;

        io.to(channelName).emit(
            "user quitted",
            { username: user.username, nickname: user.nickname },
            channel.name,
        );
        socket.leave(channel.name);

        await handleNotification(io, {
            channel: channel,
            content: `${user.nickname} has leaved the channel.`,
        });

        await removeUserFromChannel(user, channel);
        console.log(
            `${user.nickname} [${user.username}] leaved the channel ${channel.name}`,
        );
    });
};

/**
 * List the available channels.
 *
 * @param socket - the client socket
 */
export const onListChannels = (socket: Socket) => {
    socket.on(
        "list channels",
        async (query: string | null, cb: (channels: Channels) => void) => {
            const channels = query
                ? await searchChannelByName(query)
                : await getChannels();
            cb(channels);
        },
    );
};

/**
 * Actions to perform when a "delete channel" event is received.
 *
 * @param io - the socket server
 * @param socket - the client socket
 */
export const onDeleteChannel = (io: Server, socket: Socket) => {
    socket.on("delete channel", async (channelName: string) => {
        const user = await getUserBySocketId(socket.id);
        const channel = await getChannelByName(channelName);

        if (!user || !channel || channel.owner_id !== user.id) return;

        io.emit("channel deleted", channel.name);
        await deleteChannel(channel);

        console.log(
            `-> Channel ${channel.name} was deleted by ${user.nickname} [${user.username}]`,
        );
    });
};

export const onRenameChannel = (io: Server, socket: Socket) => {
    socket.on(
        "rename channel",
        async (channelName: string, newName: string) => {
            const channel = await getChannelByName(channelName);

            if (!channel) return;

            await renameChannel(channel, newName);

            io.emit("channel renamed", channelName, newName);

            io.in(channelName).socketsJoin(newName);
            io.in(newName).socketsLeave(channelName);

            console.log(`-> Channel ${channelName} was renamed to ${newName}`);
        },
    );
};

export const onAskHistory = (io: Server, socket: Socket) => {
    socket.on("channel history", async (channelName: string) => {
        const channel = await getChannelByName(channelName);

        if (!channel) return;

        const history = await getChannelMessages(channel);

        io.to(socket.id).emit("channel history", channel.name, history);
    });
};
