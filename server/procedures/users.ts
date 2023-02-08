import { User } from "@prisma/client";
import database from "../utils/database";
import { hash } from "../utils/functions";
import { users } from "../utils/types";

export const getUserByUsername = async (username: string) => {
    return await database.user.findUnique({
        where: { username },
    });
};

export const getUserBySocketId = async (socketId: string) => {
    const userId = users.get(socketId);

    if (!userId) return null;

    return await database.user.findUnique({
        where: {
            id: userId,
        },
    });
};

export const getSocketIdByUserId = (id: number) => {
    for (const [socketId, userId] of users) {
        if (userId === id) return socketId;
    }
    return null;
};

export const userExists = async (username: string) => {
    const user = await getUserByUsername(username);

    if (user) return true;
    return false;
};

export const createUser = async (username: string, password: string) => {
    return await database.user.create({
        data: {
            username: username,
            nickname: username,
            password: hash(password),
        },
    });
};

export const updateUserNickname = async (user: User, nickname: string) => {
    await database.user.update({
        where: {
            id: user.id,
        },
        data: {
            nickname: nickname,
        },
    });
};

export const createOrGetUser = async (username: string, password: string) => {
    const user = await getUserByUsername(username);

    if (user) return user;

    return await createUser(username, password);
};

export const getConversations = async (user: User) => {
    return await database.message.findMany({
        where: {
            OR: [
                {
                    sender_id: user.id,
                },
                {
                    recipient_id: user.id,
                },
            ],
            AND: {
                channel_id: null,
            },
        },

        include: {
            sender: {
                select: {
                    nickname: true,
                    username: true,
                },
            },
            recipient: {
                select: {
                    username: true,
                    nickname: true,
                },
            },
        },

        orderBy: {
            date: "asc",
        },
    });
};
