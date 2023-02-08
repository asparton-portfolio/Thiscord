import { PropTypes } from "prop-types";
import { useContext } from "react";

import PCHeader from "./PCHeader";
import MessagesContainer from "./MessagesContainer";
import MessageBar from "./MessageBar";

import { PCsContext } from "../../pages/Thiscord";

import "../../resources/styles/channels/channelView.css";

export default function PCView({ currentPCName }) {
    const currentPC = useContext(PCsContext).PCs.get(currentPCName);

    return (
        <main className="channel-view">
            <PCHeader username={currentPCName} nickname={currentPC.nickname} />
            <MessagesContainer messages={currentPC.messages} />
            <MessageBar
                channelName={currentPCName}
                setOpened={null}
                nickname={currentPC.nickname}
            />
        </main>
    );
}

PCView.propTypes = {
    currentPCName: PropTypes.string.isRequired,
};
