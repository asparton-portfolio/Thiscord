import { PropTypes } from "prop-types";
import { useContext, useState } from "react";

import ChannelHeader from "./ChannelHeader";
import MessagesContainer from "./MessagesContainer";
import MessageBar from "./MessageBar";
import { Drawer, ScrollArea } from "@mantine/core";

import { ClientSocketContext } from "../../services/ClientSocket";
import { ChannelsContext } from "../../pages/Thiscord";

import "../../resources/styles/channels/channelView.css";

export default function ChannelView({ currentChannelName }) {
    const clientSocket = useContext(ClientSocketContext);
    const currentChannel = useContext(ChannelsContext).get(currentChannelName);

    if (!currentChannel.historyFetched)
        clientSocket.getChannelHistory(currentChannelName);

    const [opened, setOpened] = useState(false);

    return (
        <main className="channel-view">
            <ChannelHeader
                name={currentChannelName}
                users={currentChannel.users}
                setOpened={setOpened}
            />
            <MessagesContainer messages={currentChannel.messages} />
            <MessageBar
                channelName={currentChannelName}
                setOpened={setOpened}
            />
            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                withCloseButton={false}
                padding="xl"
                position="right"
                size="xl"
            >
                <h1>Channel members</h1>
                <ScrollArea>
                    <ul style={{ marginTop: "2em" }}>
                        {currentChannel.users.map((user) => (
                            <li key={user.username} className="user-new-mp">
                                <h2>{user.nickname}</h2>
                                <p
                                    style={{
                                        color: "gray",
                                    }}
                                >{`@${user.username}`}</p>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
            </Drawer>
        </main>
    );
}

ChannelView.propTypes = {
    currentChannelName: PropTypes.string.isRequired,
};
