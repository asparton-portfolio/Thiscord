import { PropTypes } from "prop-types";
import { useContext } from "react";

import { TextInput, Button } from "@mantine/core";

import { ClientSocketContext } from "../../services/ClientSocket";

export default function EditNicknameForm({ closeModal }) {
    const clientSocket = useContext(ClientSocketContext);

    const onFormSubmit = (formEvent) => {
        formEvent.preventDefault();
        const nicknameEntered = formEvent.target.nicknameInput.value;
        clientSocket.setNickname(nicknameEntered);
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
            <h1>Edit nickname</h1>
            <TextInput
                name="nicknameInput"
                placeholder={clientSocket.nickname}
                mb="0.5em"
                size="lg"
                style={{ margin: "1em" }}
                w="20vw"
            />
            <Button
                type="submit"
                size="lg"
                w="20vw"
                variant="gradient"
                gradient={{ from: "#8093f1" }}
            >
                Change nickname
            </Button>
        </form>
    );
}

EditNicknameForm.propTypes = {
    closeModal: PropTypes.func.isRequired,
};
