/**
 * Builds a usable channels map to use in the front app from the data received
 * by the server.
 * @param {[object]} channels the channels data received from the backend.
 * @returns {Map<string, object>} a usable channels map to use in the front app.
 */
export const getBuiltChannels = (channels) => {
    const builtChannels = new Map();
    for (let channel of channels) {
        builtChannels.set(channel.name, {
            owner: channel.owner,
            users: getChannelMembers(channel),
            messages: [],
            historyFetched: false,
        });
    }
    return builtChannels;
};

const getChannelMembers = (channel) => {
    const users = [];
    for (let member of channel.members) users.push(member.user);
    return users;
};

/**
 * Builds a usable private conversations map to use in the front app from the
 * data received by the server.
 * @param {[object]} allPrivateMessages an array of all the private messages
 * in which the current client is whether the sender or recipient.
 * @param {string} currentClientUsername the username of the current client.
 * @returns {Map<string, object>} a usable private conversations map to use in
 * the front app.
 */
export const getBuiltPCs = (allPrivateMessages, currentClientUsername) => {
    const builtPCs = new Map();
    for (let message of allPrivateMessages) {
        const newPCIds =
            message.sender.username === currentClientUsername
                ? [message.recipient.username, message.recipient.nickname]
                : [message.sender.username, message.sender.nickname];
        if (builtPCs.has(newPCIds[0]))
            builtPCs.get(newPCIds[0]).messages.push({
                sender: message.sender,
                content: message.content,
                date: new Date(message.date),
            });
        else {
            builtPCs.set(newPCIds[0], {
                nickname: newPCIds[1],
                messages: [
                    {
                        sender: message.sender,
                        content: message.content,
                        date: new Date(message.date),
                    },
                ],
            });
        }
    }
    return builtPCs;
};
