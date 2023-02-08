import { useContext, useState } from "react";

import { ClientSocketContext } from "../../services/ClientSocket";

import { Center, TextInput, Button } from "@mantine/core";

export default function FirstChannel() {
    const clientSocket = useContext(ClientSocketContext);
    const [nameAvailable, setNameAvailable] = useState(true);

    const onFormSubmit = (formEvent) => {
        formEvent.preventDefault();
        clientSocket.createChannel(
            formEvent.target.channelNameInput.value,
            (nameAvailable) => setNameAvailable(nameAvailable),
        );
    };

    return (
        <Center w="83vw">
            <form
                style={{
                    display: "flex",
                    flexFlow: "column nowrap",
                    alignItems: "center",
                }}
                onSubmit={onFormSubmit}
            >
                <div
                    style={{
                        marginBottom: "1.5em",
                        textAlign: "center",
                    }}
                >
                    <h1>Create your first channel</h1>
                    {!nameAvailable && (
                        <i style={{ color: "#e63946" }}>
                            This channel name is not available. Please choose
                            another one.
                        </i>
                    )}
                </div>
                <TextInput
                    name="channelNameInput"
                    placeholder="Channel name"
                    w="22em"
                    size="lg"
                />
                <Button
                    type="submit"
                    w="19.53em"
                    size="lg"
                    variant="gradient"
                    gradient={{ from: "#8093f1" }}
                    mt="1em"
                >
                    Create
                </Button>
            </form>
        </Center>
    );
}
