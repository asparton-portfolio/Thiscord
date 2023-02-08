import { PropTypes } from "prop-types";

import { NavLink, Modal } from "@mantine/core";
import ChannelButton from "./ChannelButton";

export default function ChannelNav({
    title,
    icon,
    channelsName,
    onChannelClick,
    channelModalOpened,
    onModalChange,
    newChannelModalContent,
}) {
    return (
        <div>
            <Modal
                opened={channelModalOpened}
                onClose={() => onModalChange(false)}
                centered
                size="xl"
                withCloseButton={false}
                zIndex={1000}
            >
                {newChannelModalContent}
            </Modal>
            <ChannelButton
                title={title}
                icon={icon}
                onButtonClick={() => onModalChange(true)}
            />
            {channelsName.map((channelName) => (
                <NavLink
                    key={channelName}
                    label={channelName}
                    variant="light"
                    className="channel"
                    onClick={(_) => onChannelClick(channelName)}
                />
            ))}
        </div>
    );
}

ChannelNav.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired,
    channelsName: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    onChannelClick: PropTypes.func.isRequired,
    channelModalOpened: PropTypes.bool.isRequired,
    onModalChange: PropTypes.func.isRequired,
    newChannelModalContent: PropTypes.element.isRequired,
};
