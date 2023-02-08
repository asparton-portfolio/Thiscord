import { Server, Socket } from "socket.io";
import { Message } from "@prisma/client";
import {
    createUser,
    getConversations,
    getUserBySocketId,
    getUserByUsername,
    updateUserNickname,
    userExists,
} from "../procedures/users";
import database from "../utils/database";
import { clearUserId, hash } from "../utils/functions";
import { users } from "../utils/types";

export const onSetNickname = (io: Server, socket: Socket) => {
    socket.on("set nickname", async (nickname: string) => {
        const user = await getUserBySocketId(socket.id);

        if (!user) return;

        await updateUserNickname(user, nickname);
        io.emit("nickname updated", {
            nickname: nickname,
            username: user.username,
        });

        console.log(`-> ${user.username}'s nickname changed to ${nickname}`);
    });
};

export const onRegister = (socket: Socket) => {
    socket.on(
        "register",
        async (
            username: string,
            password: string,
            isSuccess: (success: boolean) => void,
        ) => {
            if (await userExists(username)) {
                isSuccess(false);
                return;
            }

            const user = await createUser(username, password);

            clearUserId(user.id);
            users.set(socket.id, user.id);

            isSuccess(true);
            console.log(`-> New user ${user.nickname} [${user.username}]`);
        },
    );
};

/**
 * Action of logging a user in.
 *
 * @param socket - the client socket
 */
export const onLogIn = (socket: Socket) => {
    socket.on(
        "log in",
        async (
            username: string,
            password: string,
            isSuccess: (success: string | null) => void,
        ) => {
            const user = await getUserByUsername(username);

            if (!user || user.password !== hash(password)) {
                isSuccess(null);
                return;
            }

            users.set(socket.id, user.id);

            const channels = await database.channelMember.findMany({
                where: {
                    user: {
                        id: user.id,
                    },
                },

                select: {
                    channel: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            for (let channel of channels) {
                socket.join(channel.channel.name);
            }

            isSuccess(user.nickname);
            console.log(`-> ${user.nickname} [${user.username}] logged in`);
        },
    );
};

export const onGetConversations = (socket: Socket) => {
    socket.on(
        "get conversations",
        async (cb: (conversations: Message[]) => void) => {
            const user = await getUserBySocketId(socket.id);

            if (!user) return;

            const conversations = await getConversations(user);

            cb(conversations);
        },
    );
};
