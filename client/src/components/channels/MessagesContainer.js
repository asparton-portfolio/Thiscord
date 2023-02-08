import { PropTypes } from "prop-types";

import { ScrollArea } from "@mantine/core";
import Message from "./Message";

import "../../resources/styles/channels/messagesContainer.css";

export default function MessagesContainer({ messages }) {
    return (
        <section className="messages-container">
            <ScrollArea
                style={{
                    width: "100%",
                    height: "65vh",
                }}
            >
                <ul>
                    {messages.map((message) => (
                        <li key={message.sender + message.date.toString()}>
                            <Message message={message} />
                        </li>
                    ))}
                </ul>
            </ScrollArea>
        </section>
    );
}

MessagesContainer.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            sender: PropTypes.shape({
                username: PropTypes.string.isRequired,
                nickname: PropTypes.string.isRequired,
            }),
            content: PropTypes.string.isRequired,
            date: PropTypes.instanceOf(Date),
        }),
    ).isRequired,
};
