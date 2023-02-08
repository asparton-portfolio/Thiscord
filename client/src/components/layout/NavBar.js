import { PropTypes } from "prop-types";
import { useState } from "react";

import { Navbar, ScrollArea } from "@mantine/core";
import Header from "./Header";
import Nickname from "./Nickname";
import ChannelNav from "./ChannelNav";
import NewChannelForm from "../channels/NewChannelForm";
import { IconSpeakerphone, IconBrandTelegram } from "@tabler/icons";

import "../../resources/styles/layout/navbar.css";
import NewPrivateMessages from "./NewPrivateMessages";

export default function NavBar({
    channelsName,
    mps,
    onChannelClick,
    onPCClick,
}) {
    const [channelFormOpened, setChannelFormOpened] = useState(false);
    const [privateMessageFormOpened, setPrivateMessageFormOpened] =
        useState(false);

    return (
        <Navbar className="navbar" p="md">
            <ScrollArea scrollbarSize={6}>
                <Navbar.Section className="nav-section">
                    <Header />
                </Navbar.Section>
                <Navbar.Section className="nav-section">
                    <Nickname />
                </Navbar.Section>
                <Navbar.Section className="nav-section">
                    <ChannelNav
                        title="Channels"
                        icon={<IconSpeakerphone size={22} />}
                        channelsName={channelsName}
                        onChannelClick={onChannelClick}
                        channelModalOpened={channelFormOpened}
                        onModalChange={(opened) => setChannelFormOpened(opened)}
                        newChannelModalContent={
                            <NewChannelForm
                                onFormClosed={() => setChannelFormOpened(false)}
                            />
                        }
                    />
                </Navbar.Section>
                <Navbar.Section>
                    <ChannelNav
                        title="Private messages"
                        icon={<IconBrandTelegram size={22} />}
                        channelsName={mps}
                        onChannelClick={onPCClick}
                        channelModalOpened={privateMessageFormOpened}
                        onModalChange={(opened) =>
                            setPrivateMessageFormOpened(opened)
                        }
                        newChannelModalContent={
                            <NewPrivateMessages
                                closeModal={() =>
                                    setPrivateMessageFormOpened(false)
                                }
                            />
                        }
                    />
                </Navbar.Section>
            </ScrollArea>
        </Navbar>
    );
}

NavBar.propTypes = {
    channelsName: PropTypes.arrayOf(PropTypes.string).isRequired,
    mps: PropTypes.arrayOf(PropTypes.string.isRequired),
    onChannelClick: PropTypes.func.isRequired,
    onPCClick: PropTypes.func.isRequired,
};
