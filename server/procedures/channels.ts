import { Channel, User } from "@prisma/client";
import database from "../utils/database";

export const createChannel = async (channelName: string, user: User) => {
    return await database.channel.create({
        data: {
            name: channelName,
            owner_id: user.id,
        },
    });
};

export const getChannelByName = async (channelName: string) => {
    return await database.channel.findUnique({
        where: {
            name: channelName,
        },
    });
};

export const addUserToChannel = async (user: User, channel: Channel) => {
    return await database.channelMember.create({
        data: {
            channel_id: channel.id,
            user_id: user.id,
        },
    });
};

export const removeUserFromChannel = async (user: User, channel: Channel) => {
    await database.channelMember.delete({
        where: {
            channel_id_user_id: {
                user_id: user.id,
                channel_id: channel.id,
            },
        },
    });
};

export const getChannels = async () => {
    return await database.channel.findMany({
        select: {
            name: true,
            members: {
                select: {
                    user: {
                        select: {
                            nickname: true,
                            username: true,
                        },
                    },
                },
            },

            owner: {
                select: {
                    username: true,
                    nickname: true,
                },
            },
        },
    });
};

export const searchChannelByName = async (query: string) => {
    return await database.channel.findMany({
        where: {
            name: {
                contains: query,
            },
        },
        select: {
            name: true,
            members: {
                select: {
                    user: {
                        select: {
                            nickname: true,
                            username: true,
                        },
                    },
                },
            },

            owner: {
                select: {
                    username: true,
                    nickname: true,
                },
            },
        },
    });
};

/**
 * Delete a channel from the database.
 *
 * @param channel - the channel object to delete
 */
export const deleteChannel = async (channel: Channel) => {
    await database.channel.delete({
        where: {
            id: channel.id,
        },
    });
};

export const renameChannel = async (channel: Channel, newName: string) => {
    await database.channel.update({
        where: {
            id: channel.id,
        },

        data: {
            name: newName,
        },
    });
};

export const getChannelMessages = async (channel: Channel) => {
    return await database.message.findMany({
        select: {
            sender: {
                select: {
                    username: true,
                    nickname: true,
                },
            },
            content: true,
            date: true,
        },
        where: {
            channel_id: channel.id,
        },
        orderBy: {
            date: "asc",
        },
    });
};

export const getPrivateMessages = async (user: User) => {
    return await database.message.findMany({
        where: {
            recipient_id: user.id,
        },
        orderBy: {
            date: "asc",
        },
    });
};

export const getChannelMembers = async (channel: Channel) => {
    return await database.channelMember.findMany({
        where: {
            channel_id: channel.id,
        },
    });
};
