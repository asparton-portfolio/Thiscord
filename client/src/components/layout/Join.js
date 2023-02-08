import { PropTypes } from "prop-types";
import { useContext } from "react";

import { ClientSocketContext } from "../../services/ClientSocket";

import { Center, Button } from "@mantine/core";

export default function Join({ channelName }) {
    const clientSocket = useContext(ClientSocketContext);

    return (
        <Center w="83%">
            <div
                style={{
                    display: "flex",
                    flexFlow: "column nowrap",
                    alignItems: "center",
                }}
            >
                <h1>{channelName}</h1>
                <Button
                    onClick={() => clientSocket.joinChannel(channelName)}
                    w="20em"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: "#8093f1" }}
                    mt="1em"
                >
                    Join channel
                </Button>
            </div>
        </Center>
    );
}

Join.propTypes = {
    channelName: PropTypes.string.isRequired,
};
