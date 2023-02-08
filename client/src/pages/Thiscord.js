import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import NavBar from "../components/layout/NavBar";
import FirstChannel from "../components/layout/FirstChannel";
import Join from "../components/layout/Join";
import PCView from "../components/channels/PCView";
import ChannelView from "../components/channels/ChannelView";

import "../resources/styles/layout/app.css";

import { ClientSocketContext } from "../services/ClientSocket";
import { showNotification } from "@mantine/notifications";

export const ChannelsContext = createContext(new Map());
export const PCsContext = createContext({
    PCs: new Map(),
    setPCs: () => {},
    setCurrentPCName: () => {},
});

export default function Thiscord() {
    const clientSocket = useContext(ClientSocketContext);
    const navigate = useNavigate();
    const locationState = useLocation().state;

    const [channels, setChannels] = useState(
        locationState !== null ? new Map(locationState.channels) : new Map(),
    );
    const [currentChannelName, setCurrentChannelName] = useState(
        channels.size > 0 ? Array.from(channels)[0][0] : null,
    );

    const [PCs, setPCs] = useState(
        locationState !== null ? new Map(locationState.PCs) : new Map(),
    );
    const [currentPCName, setCurrentPCName] = useState(null);

    useEffect(() => {
        if (!clientSocket.username) {
            navigate("/login");
            return;
        }

        clientSocket.socket.on("new channel", (channelName, channelOwner) => {
            channels.set(channelName, {
                owner: channelOwner,
                users: [channelOwner],
                messages: [],
                historyFetched: true,
            });
            setChannels(new Map(channels));

            if (channelOwner.username === clientSocket.username) {
                clientSocket.ownChannel(channelName);
                setCurrentChannelName(channelName);
            }

            showNotification({
                title: `#${channelName}`,
                message: `A wild channel appeared!`,
                color: "blue",
            });
        });

        clientSocket.socket.on("user joined", (newUser, channelName) => {
            channels.get(channelName).users.push(newUser);
            setChannels(new Map(channels));

            if (newUser.username === clientSocket.username) {
                clientSocket.localJoinChannel(channelName);
                setCurrentChannelName(channelName);
                clientSocket.listChannels(channelName, (channelInfo) => {
                    channels.get(channelName).users = [];
                    for (let user of channelInfo[0].members)
                        channels.get(channelName).users.push(user.user);
                    setChannels(new Map(channels));
                });
            }

            if (currentChannelName !== channelName) {
                showNotification({
                    title: `#${channelName}`,
                    message: `${newUser.nickname} joined the channel`,
                    color: "blue",
                });
            }
        });

        clientSocket.socket.on("receive message", (message, channelName) => {
            message.date = new Date(message.date);
            channels.get(channelName).messages.push(Object.assign({}, message));
            setChannels(new Map(channels));

            if (
                currentChannelName !== channelName &&
                message.sender.nickname !== "Thiscord"
            ) {
                showNotification({
                    title: `#${channelName}`,
                    message: `New message from ${message.sender.nickname}`,
                    color: "blue",
                });
            }
        });

        clientSocket.socket.on("user quitted", (user, channelName) => {
            if (user.username === clientSocket.username) {
                channels.set(channelName, {
                    owner: null,
                    users: [],
                    messages: [],
                    historyFetched: false,
                });
                setChannels(new Map(channels));
                return;
            }

            channels.get(channelName).users = channels
                .get(channelName)
                .users.filter((u) => u.username !== user.username);
            setChannels(new Map(channels));

            if (currentChannelName !== channelName) {
                showNotification({
                    title: `#${channelName}`,
                    message: `${user.nickname} left the channel`,
                    color: "blue",
                });
            }
        });

        clientSocket.socket.on("channel deleted", (channelName) => {
            channels.delete(channelName);
            setChannels(new Map(channels));

            if (channelName === currentChannelName) {
                setCurrentChannelName(
                    channels.size > 0 ? Array.from(channels)[0][0] : null,
                );
            }

            showNotification({
                title: `#${channelName}`,
                message: `The channel was deleted by its owner`,
                color: "blue",
            });
        });

        clientSocket.socket.on(
            "channel renamed",
            (prevChannelName, newChannelName) => {
                clientSocket.localQuitChannel(prevChannelName);
                if (
                    channels.get(prevChannelName).owner.username ===
                    clientSocket.username
                )
                    clientSocket.ownChannel(newChannelName);
                else clientSocket.localJoinChannel(newChannelName);

                channels.set(newChannelName, {
                    owner: channels.get(prevChannelName).owner,
                    users: channels.get(prevChannelName).users,
                    messages: channels.get(prevChannelName).messages,
                    historyFetched: true,
                });
                channels.delete(prevChannelName);
                setChannels(new Map(channels));

                if (prevChannelName === currentChannelName)
                    setCurrentChannelName(newChannelName);

                showNotification({
                    title: `#${prevChannelName}`,
                    message: `${prevChannelName} has been renamed to ${newChannelName}`,
                    color: "blue",
                });
            },
        );

        clientSocket.socket.on("nickname updated", (updatedUser) => {
            for (let channelValues of channels.values()) {
                for (let user of channelValues.users) {
                    if (user.username === updatedUser.username)
                        user.nickname = updatedUser.nickname;
                }
                for (let message of channelValues.messages) {
                    if (message.sender.username === updatedUser.username)
                        message.sender.nickname = updatedUser.nickname;
                }
            }
            setChannels(new Map(channels));

            if (updatedUser.username == clientSocket.username) {
                console.log("test");

                for (let PCName of PCs.keys()) {
                    for (let message of PCs.get(PCName).messages) {
                        if (message.sender.username === updatedUser.username)
                            message.sender.nickname = updatedUser.nickname;
                    }
                }
                showNotification({
                    title: "You're good to go 👀",
                    message:
                        "Your new nickname has been set ! Enjoy your new identity.",
                    color: "blue",
                });
            } else {
                PCs.get(updatedUser.username).nickname = updatedUser.nickname;
                for (let message of PCs.get(updatedUser.username).messages) {
                    if (message.sender.username === updatedUser.username)
                        message.sender.nickname = updatedUser.nickname;
                }
            }
            setPCs(new Map(PCs));
        });

        clientSocket.socket.on("channel history", (channelName, history) => {
            const channelMessages = channels.get(channelName).messages;
            for (let messageHistory of history) {
                channelMessages.push({
                    sender: Object.assign({}, messageHistory.sender),
                    content: messageHistory.content,
                    date: new Date(messageHistory.date),
                });
            }
            channels.get(channelName).historyFetched = true;
            setChannels(new Map(channels));
        });

        clientSocket.socket.on("receive private message", (message) => {
            message.date = new Date(message.date);
            console.log("hre");

            if (PCs.has(message.sender.username)) {
                console.log(message);
                PCs.get(message.sender.username).messages.push(message);
            } else
                PCs.set(message.sender.username, {
                    nickname: message.sender.nickname,
                    messages: [
                        {
                            sender: message.sender,
                            content: message.content,
                            date: new Date(message.date),
                        },
                    ],
                });
            setPCs(new Map(PCs));

            if (message.sender.username === clientSocket.username)
                setCurrentPCName(message.recipient.username);
        });

        return function cleanup() {
            clientSocket.socket.off("new channel");
            clientSocket.socket.off("user joined");
            clientSocket.socket.off("receive message");
            clientSocket.socket.off("user quitted");
            clientSocket.socket.off("channel deleted");
            clientSocket.socket.off("nickname updated");
            clientSocket.socket.off("channel renamed");
            clientSocket.socket.off("channel history");
            clientSocket.socket.off("receive private message");
        };
    });

    // Update the view to see the selected channel
    const onChannelClick = (channelName) => {
        setCurrentChannelName(channelName);
        setCurrentPCName(null);
    };

    // Update the view to see the selected private conversation
    const onPCClick = (username) => {
        setCurrentPCName(username);
    };

    return (
        <div className="app-container">
            <ChannelsContext.Provider value={channels}>
                <PCsContext.Provider value={{ PCs, setPCs, setCurrentPCName }}>
                    <NavBar
                        channelsName={Array.from(channels.keys())}
                        mps={Array.from(PCs.keys())}
                        onChannelClick={onChannelClick}
                        onPCClick={onPCClick}
                    />
                </PCsContext.Provider>
            </ChannelsContext.Provider>
            {currentPCName && (
                <PCsContext.Provider value={{ PCs, setPCs, setCurrentPCName }}>
                    <PCView currentPCName={currentPCName} />
                </PCsContext.Provider>
            )}
            {currentChannelName && !currentPCName ? (
                <>
                    {clientSocket.channelJoined(currentChannelName) ? (
                        <ChannelsContext.Provider value={channels}>
                            <PCsContext.Provider
                                value={{ PCs, setPCs, setCurrentPCName }}
                            >
                                <ChannelView
                                    currentChannelName={currentChannelName}
                                />
                            </PCsContext.Provider>
                        </ChannelsContext.Provider>
                    ) : (
                        <Join channelName={currentChannelName} />
                    )}
                </>
            ) : (
                !currentPCName && <FirstChannel />
            )}
        </div>
    );
}
