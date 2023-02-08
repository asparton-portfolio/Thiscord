import { Channel, User } from "@prisma/client";
import database from "../utils/database";
import { createOrGetUser } from "./users";

export const addMessageToChannel = async (
    channel: Channel,
    sender: User,
    content: string,
) => {
    return await database.message.create({
        data: {
            sender_id: sender.id,
            channel_id: channel.id,
            content: content,
        },
    });
};

export const addPrivateMessage = async (
    recipient: User,
    sender: User,
    content: string,
) => {
    return await database.message.create({
        data: {
            sender_id: sender.id,
            recipient_id: recipient.id,
            content: content,
        },
    });
};

export const addNotificationToChannel = async (
    channel: Channel,
    content: string,
) => {
    const thiscord = await createOrGetUser(
        "Thiscord",
        "a robust admin password",
    );
    console.log(`WARN :: creating Thiscord account`);
    return await addMessageToChannel(channel, thiscord, content);
};
