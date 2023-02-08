import { PropTypes } from "prop-types";

import "../../resources/styles/channels/message.css";

export default function Message({ message }) {
    return (
        <article
            className="message"
            style={{
                backgroundColor: message.color,
            }}
        >
            <div className="message-header">
                <h3>{message.sender.nickname}</h3>
                <p>{message.date.toLocaleString()}</p>
            </div>
            <p>{message.content}</p>
        </article>
    );
}

Message.propTypes = {
    message: PropTypes.shape({
        sender: PropTypes.shape({
            username: PropTypes.string.isRequired,
            nickname: PropTypes.string.isRequired,
        }),
        content: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
        color: PropTypes.string,
    }).isRequired,
};
