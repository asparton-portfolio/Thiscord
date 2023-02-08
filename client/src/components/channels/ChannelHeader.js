import { PropTypes } from "prop-types";

import { ActionIcon, Group } from "@mantine/core";
import { IconUsers, IconDots } from "@tabler/icons";

import "../../resources/styles/channels/channelHeader.css";
import ChannelMenu from "./ChannelMenu";

export default function ChannelHeader({ name, users, setOpened }) {
    return (
        <section className="channel-header">
            <Group
                position="apart"
                style={{
                    paddingRight: "1em",
                    paddingLeft: "1em",
                }}
            >
                <div>
                    <h1>{`# ${name}`}</h1>
                    <Group spacing="xs">
                        <IconUsers size={20} />
                        <p>{users.length}</p>
                    </Group>
                </div>
                <ChannelMenu
                    menuTarget={
                        <ActionIcon color="dark" size="xl">
                            <IconDots size={32} />
                        </ActionIcon>
                    }
                    channelName={name}
                    setOpened={setOpened}
                />
            </Group>
        </section>
    );
}

ChannelHeader.propTypes = {
    name: PropTypes.string.isRequired,
    users: PropTypes.array.isRequired,
    setOpened: PropTypes.func.isRequired,
};
