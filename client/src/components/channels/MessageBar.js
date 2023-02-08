import { PropTypes } from "prop-types";
import { useContext, useState } from "react";

import { MantineProvider, Modal, ScrollArea, Textarea } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

import { isCommand, parseCommand } from "../../services/Parser";
import { ClientSocketContext } from "../../services/ClientSocket";
import { ChannelsContext } from "../../pages/Thiscord";
import { PCsContext } from "../../pages/Thiscord";

import "../../resources/styles/channels/messageBar.css";

let isPressingShift = false;

export default function MessageBar({ channelName, setOpened, nickname }) {
    const clientSocket = useContext(ClientSocketContext);
    const channels = useContext(ChannelsContext);
    const { PCs, setPCs, setCurrentPCName } = useContext(PCsContext);

    const [modalOpened, setModalOpened] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const onTextareaKeyDown = (keyDownEvent) => {
        if (keyDownEvent.code.includes("Shift")) isPressingShift = true;
    };

    const onTextareaKeyUp = (keyUpEvent) => {
        if (keyUpEvent.code.includes("Shift")) isPressingShift = false;

        if (keyUpEvent.code === "Enter" && !isPressingShift) {
            const message = keyUpEvent.target.value.trim();

            console.log(`message: ${message}`);
            if (!message) {
                keyUpEvent.target.value = "";
                return;
            }

            if (isCommand(message)) {
                parseCommand(
                    clientSocket,
                    message,
                    setOpened,
                    channels,
                    PCs,
                    setPCs,
                    setCurrentPCName,
                    setModalOpened,
                    setSearchResults,
                );
            } else {
                if (nickname) handlePrivateMessage(message);
                else clientSocket.sendMessage(channelName, message);
            }

            keyUpEvent.target.value = "";
        }
    };

    const handlePrivateMessage = (message) => {
        clientSocket.sendPrivateMessage(channelName, message);
        const newMessage = {
            sender: {
                username: clientSocket.username,
                nickname: clientSocket.nickname,
            },
            content: message,
            date: new Date(),
        };

        if (PCs.has(channelName))
            PCs.get(channelName).messages.push(newMessage);
        else
            PCs.set(channelName, {
                nickname: nickname,
                messages: [newMessage],
            });
        setPCs(new Map(PCs));
    };

    const placeholder = nickname
        ? `Message @${channelName}`
        : `Message #${channelName}`;

    return (
        <MantineProvider withNormalizeCSS withGlobalStyles>
            <NotificationsProvider position="top-right">
                <Modal
                    opened={modalOpened}
                    onClose={() => setModalOpened(false)}
                    withCloseButton={false}
                >
                    <h1>Search results</h1>
                    {searchResults.length > 0 ? (
                        <ScrollArea>
                            <ul style={{ marginTop: "1em" }}>
                                {searchResults.map((channel) => (
                                    <li
                                        key={channel.name}
                                        className="user-new-mp"
                                    >
                                        <h2>{channel.name}</h2>
                                        <p
                                            style={{
                                                color: "gray",
                                            }}
                                        >{`@${channel.owner.username}`}</p>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    ) : (
                        <h3 style={{ marginTop: "1em" }}>No channels found</h3>
                    )}
                </Modal>
                <section className="message-bar">
                    <Textarea
                        placeholder={placeholder}
                        autosize
                        minRows={4}
                        maxRows={4}
                        onKeyUp={(keyUpEvent) => onTextareaKeyUp(keyUpEvent)}
                        onKeyDown={(keyDownEvent) =>
                            onTextareaKeyDown(keyDownEvent)
                        }
                    />
                </section>
            </NotificationsProvider>
        </MantineProvider>
    );
}

MessageBar.propTypes = {
    channelName: PropTypes.string.isRequired,
    setOpened: PropTypes.func,
    nickname: PropTypes.string,
};
