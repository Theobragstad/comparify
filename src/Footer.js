import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import logo from "./img/logo.png";
import HelpModalContent from "./HelpModalContent";
import Modal from "react-modal";

const Footer = () => {
  const [footerModalIsOpen, setFooterModalIsOpen] = useState(false);

  const openFooterModal = async () => {
    setFooterModalIsOpen(true);
  };

  const closeFooterModal = () => {
    setFooterModalIsOpen(false);
  };

  const customStyles = {
    overlay: {
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      zIndex: 9999,
      width: "75%",
      height: "fit-content",
      margin: "auto",
      borderRadius: "10px",
      outline: "none",
      padding: "20px",
      maxHeight: "600px",
      overflowY: "auto",
    },
  };

  return (
    <div>
      <div className="footer">
        <span>
          <Link to="/">
            <img src={logo} style={{ width: 20, pointerEvents: "none" }}></img>
          </Link>
          &emsp;&copy; 2023&emsp;&emsp;
        </span>
        <span data-tooltip-id="infoTooltip" className="hoverGray">
          About
        </span>
        &emsp;&emsp;
        <span
          onClick={openFooterModal}
          style={{ cursor: "pointer" }}
          className="hoverGray"
        >
          Help
        </span>
        <ReactTooltip
          id="infoTooltip"
          style={{
            pointerEvents: "auto !important",
            fontWeight: "bold",
            zIndex: "2px",
            borderRadius: "20px",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={true}
        >
          <div>
            comparify uses a variety of data points from multiple time spans to
            generate a code or "Music Fingerprint" based on your Spotify
            listening activity, which you can then use to compare with others
            and gain insights.
            <div style={{ paddingTop: "10px" }}>
              Made by
              <a
                style={{ textDecoration: "none", color: "#1e90ff" }}
                title="theobragstad.com"
                href="https://theobragstad.com"
              >
                &nbsp;&nbsp;Theo Bragstad
              </a>
            </div>
          </div>
        </ReactTooltip>
        <Modal
          isOpen={footerModalIsOpen}
          onRequestClose={closeFooterModal}
          contentLabel="Popup Window"
          style={customStyles}
        >
          <HelpModalContent />
          <button className="closeBtn" onClick={closeFooterModal}>
            Close
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default Footer;
