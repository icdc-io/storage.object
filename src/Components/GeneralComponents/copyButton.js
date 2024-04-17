import React, { useState } from "react";
import PropTypes from "prop-types";
import { Icon, Popup } from "semantic-ui-react";

const CopyButton = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

  let timer;

  const handleOpen = () => {
    setIsOpen(true);
    timer = setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
    clearTimeout(timer);
  };

  const copyFuncion = (value) => {
    navigator.clipboard.writeText(value).catch((err) => {
      console.log("Something went wrong", err);
    });
  };

  return (
    <Popup
      trigger={
        <button className="copy-button" onClick={() => copyFuncion(content)}>
          <Icon name="copy outline" />
        </button>
      }
      content="Copied to clipboard"
      inverted
      style={{ fontWeight: "bold" }}
      position="top center"
      on="click"
      open={isOpen}
      onOpen={handleOpen}
      onClose={handleClose}
    />
  );
};

CopyButton.propTypes = {
  content: PropTypes.any,
};

export default CopyButton;
