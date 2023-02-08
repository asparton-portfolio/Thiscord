import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TextInput, PasswordInput, Button } from "@mantine/core";

import { ClientSocketContext } from "../../services/ClientSocket";
import { getBuiltChannels, getBuiltPCs } from "../../services/Formatter";

export default function RegisterForm() {
    const clientSocket = useContext(ClientSocketContext);
    const navigate = useNavigate();
    const [usernameAvailable, setUsernameAvailable] = useState(true);
    const [samePassword, setSamePassword] = useState(true);

    // Try to register with the given inputs, and pass the needed persisted data through the app page
    const onFormSubmit = (formEvent) => {
        formEvent.preventDefault();
        const usernameEntered = formEvent.target.usernameInput.value;
        const nicknameEntered = formEvent.target.nicknameInput.value;
        const passwordEntered = formEvent.target.passwordInput.value;
        const confirmPasswordEntered =
            formEvent.target.confirmPasswordInput.value;
        setSamePassword(passwordEntered === confirmPasswordEntered);
        if (!passwordEntered === confirmPasswordEntered) return;

        clientSocket.register(usernameEntered, passwordEntered, (success) => {
            setUsernameAvailable(success);
            if (success) {
                const nickname = nicknameEntered
                    ? nicknameEntered
                    : usernameEntered;
                clientSocket.username = usernameEntered;
                clientSocket.setNickname(nickname);
                clientSocket.listChannels(null, (channels) => {
                    const builtChannels = getBuiltChannels(channels);
                    joinAndOwnChannels(builtChannels);

                    clientSocket.getPCs((PCs) => {
                        const builtPCs = getBuiltPCs(
                            PCs,
                            clientSocket.username,
                        );
                        navigate("/", {
                            state: {
                                channels: builtChannels,
                                PCs: builtPCs,
                            },
                        });
                    });
                });
            }
        });
    };

    const joinAndOwnChannels = (builtChannels) => {
        for (let [channelName, channelValues] of builtChannels) {
            if (channelValues.owner.username === clientSocket.username)
                clientSocket.ownChannel(channelName);
            else if (
                channelValues.users.find(
                    (u) => u.username === clientSocket.username,
                )
            )
                clientSocket.localJoinChannel(channelName);
        }
    };

    return (
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
                <h1>Register</h1>
                {!usernameAvailable && (
                    <i style={{ color: "#e63946" }}>
                        This username is not available. Please choose another
                        one
                    </i>
                )}
            </div>
            <TextInput
                name="usernameInput"
                required
                label="Username"
                description="This username must be unique, and will be used to identify you when wanting to send a private message."
                placeholder="john_"
                w="25vw"
                mb="0.5em"
                size="lg"
                withAsterisk
            />
            <TextInput
                name="nicknameInput"
                label="Nickname"
                description="This nickname does not have to be unique, and will be displayed to others in order for you to have whatever name you want."
                placeholder="John Wick"
                w="25vw"
                mb="0.5em"
                size="lg"
            />
            <PasswordInput
                name="passwordInput"
                required
                label="Password"
                w="25vw"
                mb="0.5em"
                size="lg"
                withAsterisk
            />
            <PasswordInput
                name="confirmPasswordInput"
                required
                label="Confirm password"
                w="25vw"
                size="lg"
                withAsterisk
                error={!samePassword && "The two passwords must be the same"}
            />
            <Button
                type="submit"
                w="19.53em"
                size="lg"
                variant="gradient"
                gradient={{ from: "#8093f1" }}
                mt="1em"
            >
                Confirm
            </Button>
        </form>
    );
}
