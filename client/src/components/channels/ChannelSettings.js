import { PropTypes } from "prop-types";
import { useContext } from "react";

import { TextInput, Button } from "@mantine/core";

import { ClientSocketContext } from "../../services/ClientSocket";

export default function ChannelSettings({ channelName, closeModal }) {
    const clientSocket = useContext(ClientSocketContext);

    const onFormSubmit = (formEvent) => {
        formEvent.preventDefault();
        const channelNameEntered = formEvent.target.channelNameInput.value;
        clientSocket.renameChannel(channelName, channelNameEntered);
        closeModal();
    };

    return (
        <form
            onSubmit={onFormSubmit}
            style={{
                display: "flex",
                flexFlow: "column nowrap",
                justifyContent: "center",
                alignItems: "center",
                padding: "3em",
            }}
        >
            <h1>Channel settings</h1>
            <TextInput
                name="channelNameInput"
                label="Channel name"
                placeholder={channelName}
                mb="0.5em"
                size="lg"
                style={{ margin: "1em" }}
                w="20vw"
                color="#8093f1"
            />
            <Button
                type="submit"
                size="lg"
                w="20vw"
                variant="gradient"
                gradient={{ from: "#8093f1" }}
            >
                Update channel
            </Button>
        </form>
    );
}

ChannelSettings.propTypes = {
    channelName: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
};
