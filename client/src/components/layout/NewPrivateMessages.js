import { PropTypes } from "prop-types";
import { useContext } from "react";

import { ClientSocketContext } from "../../services/ClientSocket";
import { ChannelsContext } from "../../pages/Thiscord";
import { PCsContext } from "../../pages/Thiscord";

import "../../resources/styles/layout/newPrivateMessages.css";
import { getAllNewPCs } from "../../services/Users";

export default function NewPrivateMessages({ closeModal }) {
    const username = useContext(ClientSocketContext).username;
    const channels = useContext(ChannelsContext);
    const { PCs, setPCs, setCurrentPCName } = useContext(PCsContext);

    // Start a new private conversation and switch the view
    const onNewPCClick = (user) => {
        PCs.set(user.username, {
            nickname: user.nickname,
            messages: [],
        });
        setPCs(new Map(PCs));
        setCurrentPCName(user.username);
        closeModal();
    };

    const allNewPCs = getAllNewPCs(channels, PCs, username);

    return (
        <div style={{ margin: "2em" }}>
            <h1>New private conversation</h1>
            {allNewPCs.length > 0 ? (
                <ul style={{ marginTop: "2em" }}>
                    {allNewPCs.map((user) => (
                        <li
                            key={user.username}
                            className="user-new-mp"
                            onClick={() => onNewPCClick(user)}
                        >
                            <h2>{user.nickname}</h2>
                            <p
                                style={{
                                    color: "gray",
                                }}
                            >{`@${user.username}`}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <h3 style={{ marginTop: "1em" }}>
                    There is no user to talk to 😿
                </h3>
            )}
        </div>
    );
}

NewPrivateMessages.propTypes = {
    closeModal: PropTypes.func.isRequired,
};
