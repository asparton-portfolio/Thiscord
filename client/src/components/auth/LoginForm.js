import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TextInput, PasswordInput, Button } from "@mantine/core";

import { ClientSocketContext } from "../../services/ClientSocket";
import { getBuiltChannels, getBuiltPCs } from "../../services/Formatter";

export default function LoginForm() {
    const clientSocket = useContext(ClientSocketContext);
    const navigate = useNavigate();
    const [loginInvalid, setLoginInvalid] = useState(false);

    // Try to login with the given inputs, and pass the needed persisted data through the app page
    const onFormSubmit = (formEvent) => {
        formEvent.preventDefault();
        const enteredUsername = formEvent.target.usernameInput.value;
        const enteredPassword = formEvent.target.passwordInput.value;

        clientSocket.login(enteredUsername, enteredPassword, (nickname) => {
            setLoginInvalid(nickname === null);
            if (nickname) {
                clientSocket.username = enteredUsername;
                clientSocket.nickname = nickname;
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
                <h1>Log in</h1>
                {loginInvalid && (
                    <i style={{ color: "#e63946" }}>
                        Username or password invalid
                    </i>
                )}
            </div>
            <TextInput
                name="usernameInput"
                required
                placeholder="Username"
                w="25vw"
                size="lg"
                mb="0.5em"
            />
            <PasswordInput
                name="passwordInput"
                required
                placeholder="Password"
                w="25vw"
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
                Confirm
            </Button>
        </form>
    );
}
