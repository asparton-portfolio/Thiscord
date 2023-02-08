import { showNotification } from "@mantine/notifications";
import { ClientSocket } from "./ClientSocket";
import { getUserNicknameByUsername, userIsKnown } from "./Users";

/**
 * Check whether the message can be interpreted as a command.
 *
 * @param {string} message the message sent by the user
 * @returns {boolean} whether the message is a command of not
 */
export const isCommand = (message) => {
    return message.startsWith("/");
};

/**
 * Parse the given message in search for commands to execute then
 * execute the command.
 *
 * @param {ClientSocket} clientSocket wrapper class around the client socket
 * @param {string} message content of the command
 */
export const parseCommand = (
    clientSocket,
    message,
    setDrawerOpened,
    channels,
    PCs,
    setPCs,
    setCurrentPCName,
    setModalOpened,
    setSearchResults,
) => {
    let command = message.split(" ");
    console.log(`command: ${command}`);

    switch (command[0]) {
        case "/nick":
            changeNickname(clientSocket, command);
            break;

        case "/create":
            createChannel(clientSocket, command);
            break;

        case "/delete":
            deleteChannel(clientSocket, command);
            break;

        case "/join":
            joinChannel(clientSocket, command);
            break;

        case "/quit":
            quitChannel(clientSocket, command);
            break;

        case "/msg":
            sendPrivateMessage(
                clientSocket,
                command,
                channels,
                PCs,
                setPCs,
                setCurrentPCName,
            );
            break;

        case "/users":
            if (!setDrawerOpened)
                showNotification({
                    title: "Oops",
                    message: "You can't use this command outside a channel",
                    color: "red",
                });
            setDrawerOpened(true);
            break;

        case "/list":
            listChannels(
                clientSocket,
                command,
                setModalOpened,
                setSearchResults,
            );
            break;

        default:
            showNotification({
                title: "Too bad...",
                message:
                    "The command you typed is not recognized by Thiscord. Better luck next time !",
                color: "red",
            });
            break;
    }
};

/**
 * @param {ClientSocket} clientSocket wrapper class around the client socket
 * @param {string[]} command the array of words in the command
 */
const changeNickname = (clientSocket, command) => {
    if (command.length === 1) {
        showNotification({
            title: "Oops",
            message:
                "You must provide a nickname as the second argument of the command",
            color: "red",
        });
        return;
    }

    command.shift();
    clientSocket.setNickname(command.join(" "));
};

/**
 * Create a new channel.
 *
 * @param {ClientSocket} clientSocket wrapper class around the client socket
 * @param {string[]} command the array of words in the command
 */
const createChannel = (clientSocket, command) => {
    if (command.length === 1) {
        showNotification({
            title: "Oops",
            message:
                "You must provide a channel name as the second argument of the command",
            color: "red",
        });
        return;
    }

    command.shift();
    clientSocket.createChannel(command.join(" "), (success) => {
        const title = success ? "Well done 🎉" : "Too bad...";
        const message = success
            ? "You new channel is up and ready !"
            : "A channel with this name already exists. Try a different name or join the existing channel !";

        showNotification({ title, message, color: success ? "green" : "red" });
    });
};

/**
 * Delete a channel.
 *
 * @param {ClientSocket} clientSocket wrapper class around the client socket
 * @param {string[]} command the array of words in the command
 */
const deleteChannel = (clientSocket, command) => {
    if (command.length === 1) {
        showNotification({
            title: "Oops",
            message:
                "You must provide a channel name as the second argument of the command",
            color: "red",
        });
        return;
    }

    command.shift();
    const channelName = command.join(" ");

    if (!clientSocket.ownedChannels.has(channelName)) {
        showNotification({
            title: "Oops",
            message:
                "It appears that either you do not own the server or the server does not exist.",
            color: "red",
        });
        return;
    }

    clientSocket.deleteChannel(channelName);
    showNotification({
        title: "Well done 🎉",
        message: `${channelName} was successfully deleted.`,
        color: "green",
    });
};

/**
 * Join a channel.
 *
 * @param {ClientSocket} clientSocket wrapper class around the client socket
 * @param {string[]} command the array of words in the command
 */
const joinChannel = (clientSocket, command) => {
    if (command.length === 1) {
        showNotification({
            title: "Oops",
            message:
                "You must provide a channel name as the second argument of the command",
            color: "red",
        });
        return;
    }

    command.shift();
    const channelName = command.join(" ");

    if (clientSocket.joinedChannels.has(channelName)) {
        showNotification({
            title: "Oops",
            message:
                "It appears that are already on that channel! Nice try though.",
            color: "red",
        });
        return;
    }

    clientSocket.joinChannel(channelName);
    showNotification({
        title: "Well done 🎉",
        message: `You joined ${channelName}! Be polite and say hi.`,
        color: "green",
    });
};

/**
 * Quit a channel.
 *
 * @param {ClientSocket} clientSocket wrapper class around the client socket
 * @param {string[]} command the array of words in the command
 */
const quitChannel = (clientSocket, command) => {
    if (command.length === 1) {
        showNotification({
            title: "Oops 🚧",
            message:
                "You must provide a channel name as the second argument of the command",
            color: "red",
        });
        return;
    }

    command.shift();
    const channelName = command.join(" ");

    if (!clientSocket.joinedChannels.has(channelName)) {
        showNotification({
            title: "Oops",
            message:
                "It appears that you are not a member of that channel! Nice try though.",
            color: "red",
        });
        return;
    }

    clientSocket.quitChannel(channelName);
    showNotification({
        title: "Well done 🎉",
        message: `You left ${channelName}! No more messages from annoying people.`,
        color: "green",
    });
};

/**
 * Send a message in a channel.
 *
 * @param {ClientSocket} clientSocket wrapper class around the client socket
 * @param {string[]} command the array of words in the command
 */
const sendPrivateMessage = (
    clientSocket,
    command,
    channels,
    PCs,
    setPCs,
    setCurrentPCName,
) => {
    if (command.length <= 2) {
        showNotification({
            title: "Oops 🚧",
            message:
                "You must provide a channel name as the second argument of the command",
            color: "red",
        });
        return;
    }

    command.shift();
    const user = command.shift();
    const content = command.join(" ");

    if (!userIsKnown(user, channels)) {
        showNotification({
            title: "Oops",
            message: `The user ${user} does not exist, did you provide the correct username?`,
            color: "red",
        });
        return;
    }

    clientSocket.sendPrivateMessage(user, content);

    const newMessage = {
        sender: {
            username: clientSocket.username,
            nickname: clientSocket.nickname,
        },
        content: content,
        date: new Date(),
    };

    if (PCs.has(user)) PCs.get(user).messages.push(newMessage);
    else
        PCs.set(user, {
            nickname: getUserNicknameByUsername(channels, user),
            messages: [newMessage],
        });
    setPCs(new Map(PCs));
    setCurrentPCName(user);
};

/**
 * Send a message in a channel.
 *
 * @param {ClientSocket} clientSocket wrapper class around the client socket
 * @param {string[]} command the array of words in the command
 */
const listChannels = (
    clientSocket,
    command,
    setModalOpened,
    setSearchResults,
) => {
    command.shift();

    clientSocket.listChannels(command.join(" "), (channelsInfo) => {
        setSearchResults(channelsInfo);
        setModalOpened(true);
    });
};
