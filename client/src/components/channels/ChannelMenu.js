import { PropTypes } from "prop-types";
import { useContext, useState } from "react";

import { ClientSocketContext } from "../../services/ClientSocket";

import { Menu, Modal } from "@mantine/core";
import { IconUsers, IconTrash, IconSettings, IconLogout } from "@tabler/icons";
import ChannelSettings from "./ChannelSettings";

export default function ChannelMenu({ menuTarget, channelName, setOpened }) {
    const clientSocket = useContext(ClientSocketContext);
    const [channelSettingsOpened, setChannelSettingsOpened] = useState(false);

    return (
        <>
            <Menu shadow="md" width={200} trigger="hover">
                <Menu.Target>{menuTarget}</Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item
                        icon={<IconUsers size={14} />}
                        onClick={() => setOpened(true)}
                    >
                        List channel users
                    </Menu.Item>
                    <Menu.Item
                        icon={<IconLogout size={14} />}
                        onClick={() => clientSocket.quitChannel(channelName)}
                    >
                        Quit channel
                    </Menu.Item>
                    {clientSocket.ownedChannels.has(channelName) && (
                        <>
                            <Menu.Item
                                icon={<IconSettings size={14} />}
                                onClick={() => setChannelSettingsOpened(true)}
                            >
                                Channel settings
                            </Menu.Item>
                            <Menu.Item
                                color="red"
                                icon={<IconTrash size={14} />}
                                onClick={() =>
                                    clientSocket.deleteChannel(channelName)
                                }
                            >
                                Delete channel
                            </Menu.Item>
                        </>
                    )}
                </Menu.Dropdown>
            </Menu>
            <Modal
                opened={channelSettingsOpened}
                onClose={() => setChannelSettingsOpened(false)}
                withCloseButton={false}
                centered
                size="xl"
                zIndex={1000}
            >
                <ChannelSettings
                    channelName={channelName}
                    closeModal={() => setChannelSettingsOpened(false)}
                />
            </Modal>
        </>
    );
}

ChannelMenu.propTypes = {
    menuTarget: PropTypes.element.isRequired,
    channelName: PropTypes.string.isRequired,
    setOpened: PropTypes.func.isRequired,
};
