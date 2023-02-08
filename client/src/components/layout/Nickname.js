import { useContext, useState } from "react";

import { Group, Center, Modal } from "@mantine/core";
import { IconEditCircle } from "@tabler/icons";

import { ClientSocketContext } from "../../services/ClientSocket";

import "../../resources/styles/layout/nickname.css";
import EditNicknameForm from "./EditNicknameForm";

export default function Nickname() {
    const nickname = useContext(ClientSocketContext).nickname;
    const username = useContext(ClientSocketContext).username;
    const [modalOpened, setModalOpened] = useState(false);

    return (
        <>
            <Group position="apart" pl="0.5em" pr="0.5em">
                <div>
                    <h2>{nickname}</h2>
                    <p
                        style={{
                            color: "gainsboro",
                        }}
                    >{`@${username}`}</p>
                </div>
                <Center
                    className="edit-btn-container"
                    onClick={() => setModalOpened(true)}
                >
                    <IconEditCircle size={26} color="white" />
                </Center>
            </Group>
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                withCloseButton={false}
                centered
                size="xl"
                zIndex={1000}
            >
                <EditNicknameForm closeModal={() => setModalOpened(false)} />
            </Modal>
        </>
    );
}
