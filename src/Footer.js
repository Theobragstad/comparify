import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import logo from "./img/logo.png";
import x from "./img/x.png";
import HelpModalContent from "./HelpModalContent";
import Modal from "react-modal";
import logoAlt from "./img/logoAlt.png";


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
      width: "30%",
      height: "fit-content",
      margin: "auto",
      borderRadius: "10px",
      outline: "none",
      padding: "20px",
      maxHeight: "600px",
      overflowY: "auto",
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  };

  const mediaQueryStyles = `
  @media (max-width: 500px) {
    .helpModal {
      width: 75% !important;
    }
  }
  
 
  
  @media (max-width:1500px) {
    .helpModal {
      max-height:80% !important;
    }
  }
  `;

  return (
    <div>
      <div className="footer">
        <span>
          <Link to="/">
            <img
              src={logoAlt}
              style={{ width: 20, pointerEvents: "cursor" }}
              title="Home"
              alt="comparify logo"
            ></img>
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
        <Tooltip id="infoTooltip" className="tooltip2" clickable="true">
          <div>
            comparify uses a variety of data points from multiple time spans to
            generate a code or "Music Fingerprint" based on your Spotify
            listening activity, which you can then use to compare with others
            and gain insights.
            <div style={{ paddingTop: "10px" }}>
              Made by
              <a
                className="link"
                title="theobragstad.com"
                href="https://theobragstad.com"
              >
                &nbsp;&nbsp;Theo Bragstad
              </a>
            </div>
          </div>
        </Tooltip>
        <Modal
          isOpen={footerModalIsOpen}
          onRequestClose={closeFooterModal}
          contentLabel="Popup Window"
          style={customStyles}
          className="helpModal"
        >
          <span>
            <button className="xBtn" onClick={closeFooterModal}>
              <img
                src={x}
                style={{ width: "15px" }}
                alt="x"
                title="Close"
              ></img>
            </button>
          </span>
          <style>{mediaQueryStyles}</style>

          <HelpModalContent />
        </Modal>
      </div>
    </div>
  );
};

export default Footer;
