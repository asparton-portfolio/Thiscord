import { PropTypes } from "prop-types";

import { IconCirclePlus } from "@tabler/icons";

import "../../resources/styles/layout/channelNav.css";

export default function ChannelButton({ title, icon, onButtonClick }) {
    return (
        <>
            <div className="channel-nav-btn" onClick={() => onButtonClick()}>
                <div>
                    {icon}
                    <h3>{title}</h3>
                </div>
                <IconCirclePlus size={22} />
            </div>
        </>
    );
}

ChannelButton.propTypes = {
    title: PropTypes.string.isRequired,
    onButtonClick: PropTypes.func.isRequired,
};
