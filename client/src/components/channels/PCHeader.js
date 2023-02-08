import { PropTypes } from "prop-types";

export default function PCHeader({ username, nickname }) {
    return (
        <section
            style={{
                padding: "2em",
                paddingTop: "1em",
                borderBottom: "2px gainsboro solid",
            }}
        >
            <h1>{nickname}</h1>
            <p
                style={{
                    color: "gray",
                }}
            >{`@${username}`}</p>
        </section>
    );
}

PCHeader.propTypes = {
    username: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
};
