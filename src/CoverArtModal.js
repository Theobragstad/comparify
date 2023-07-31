import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./App.css";

function CoverArtModal(props) {


    


  const coverArtModalStyles = {
    overlay: {
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
     
      
    },
    content: {
      zIndex: 9999,
      //   maxWidth: "30%",
    width: "21%",
      height: "fit-content",
      //   margin: "auto",
      borderRadius: "25px",
      //   outline: "none",
      //   padding: "20px",
// margin: '0 auto',
// padding:'10px',
      //   maxHeight: "90vh",
      //   overflowY: "scroll",
    //   backgroundColor: "white",
      outline: "0",
    },
  };


  return (
    <div>
      <Modal
        isOpen={props.isCoverArtModalOpen}
        onRequestClose={props.closeCoverArtModal}
        contentLabel="Popup Window"
        style={coverArtModalStyles}
        className="coverArtModal"
      >
<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>

        {/* <div className="primaryCard1" style={{ margin: 'auto', backgroundColor: "white" }}> */}
<img src={props.urlForCoverArtModal} style={{borderRadius:'10px'}}></img>
        
        {/* </div> */}
        </div>
      </Modal>
    </div>
  );
}

export default CoverArtModal;
