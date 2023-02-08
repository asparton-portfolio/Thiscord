/**
 * Search for all the known users with who the current client never started
 * a private conversation with.
 * @param {[object]} channels the current known channels.
 * @param {[object]} currentPCs the current private conversations.
 * @param {string} clientSocketUsername the username of the current client.
 * @returns {[object]} an array containing all the users with who the current
 * client never started a private conversation with.
 */
export const getAllNewPCs = (channels, currentPCs, clientSocketUsername) => {
    let users = [];
    for (let channelValues of channels.values()) {
        for (let user of channelValues.users)
            if (
                !users.find((u) => u.username === user.username) &&
                user.username !== clientSocketUsername &&
                !currentPCs.has(user.username)
            )
                users.push(user);
    }
    return users;
};

/**
 * Verify if a user with the given username exists.
 * @param {string} username the username of the user to verify.
 * @param {[object]} channels all the known channels.
 * @returns true if a user has been found, false otherwise.
 */
export const userIsKnown = (username, channels) => {
    for (let channelValues of channels.values()) {
        if (channelValues.users.find((u) => u.username === username))
            return true;
    }
    return false;
};

/**
 * Search through all the known channels for the nickname of the user
 * identified by the given username.
 * @param {[object]} channels the current known channels.
 * @param {string} username the username of the user to search for.
 * @returns {string} The nickname of the user identified by the given username
 * if found, null otherwise.
 */
export const getUserNicknameByUsername = (channels, username) => {
    for (let channelValues of channels.values()) {
        const correspondingUser = channelValues.users.find(
            (u) => u.username === username,
        );
        if (correspondingUser) return correspondingUser.nickname;
    }
    return null;
};
