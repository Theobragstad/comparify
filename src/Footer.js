import React, { useState} from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import logo from "./img/logo.png";
import x from "./img/x.png";
import HelpModalContent from "./HelpModalContent";
import Modal from "react-modal";

import sun from "./img/sun.png";
import moon from "./img/moon.png";






const Footer = () => {

  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    // Dispatch a custom event to notify other components of the change
    window.dispatchEvent(new Event('darkModeChanged'));
  };










  const [footerModalIsOpen, setFooterModalIsOpen] = useState(false);

  const openFooterModal = async () => {
    setFooterModalIsOpen(true);
  };

  const closeFooterModal = () => {
    setFooterModalIsOpen(false);
  };




 
  const darkModalStyles = {
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
      backgroundColor: "#333333",
      color:'white'
    },
  };


  const customStyles = {
    overlay: {
      zIndex: 9998,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      zIndex: 9998,
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


//   const [darkModeOn, setDarkModeOn] = useState(false);
// if( Cookies.get('darkModeOn') === true) {
//   setDarkModeOn(true);
// }
//   useEffect(() => {
    
//     if(darkModeOn) {
//       Cookies.set('darkModeOn', true)

//     }
//     else {
// Cookies.set('darkModeOn', false)
//     }
//   },[darkModeOn])

// const [darkModeOn, setDarkModeOn] = useState(Cookies.get('darkModeOn') === 'true');

// const darkMode = useDarkMode();

// const toggleDarkMode = () => {
//   const updatedDarkModeOn = !darkMode.darkModeOn;
//   Cookies.set('darkModeOn', updatedDarkModeOn.toString());
//   darkMode.setDarkModeOn(updatedDarkModeOn);
//   window.location.reload()
// };


// useEffect(() => {
//   // Perform actions when darkModeOn changes
//   // This code will run whenever darkModeOn changes
//   console.log('darkModeOn changed:', darkMode.darkModeOn);

//   // Update other variables or trigger rerendering logic here
//   // ...

// }, [darkMode.darkModeOn]);

  return (
    <div >
      <div className="footer">
        <span>
          <Link to="/">
            <img
              src={logo}
              style={{ width: 20, pointerEvents: "cursor" }}
              title="Home"
              alt="Logo"
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
          title="Open help menu"
        >
          Help
        </span>
        {/* <span
          onClick={toggleDarkMode}
          style={{ cursor: "pointer" }}
          className="hoverGray"
          title={darkMode ? "Toggle light mode" : "Toggle dark mode"}
        >
                    &emsp;&emsp; <img src={darkMode ? sun : moon} style={{width:'10px', verticalAlign:'middle'}} alt={darkMode ? "sun" : "moon"} className="spin"/>

        </span> */}
        <Tooltip id="infoTooltip" className="tooltip2" clickable="true">
          <div>
            comparify uses a variety of data points from multiple time spans to
            generate a code based on your Spotify
            listening activity, which you can then use to explore and compare your music.
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
          style={darkMode ? darkModalStyles : customStyles}
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
