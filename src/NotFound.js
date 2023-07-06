import React from "react";
import earth from "./img/earth.png";
import "./App.css";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "15vh auto",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
        width: "fit-content",
        borderRadius: "20px",
        paddingRight:'10px'
      }}
    >
      {/* <img src={earth} style={{ width: "120px" }} alt="Not found"/> */}
      <span style={{fontSize:'100px', fontWeight:'bold', marginLeft:'20px'}} className="gradientSimple">?</span>
      <div style={{ marginLeft: "20px", textAlign: "left",marginRight: "20px"}}>
        <h2>{"404"}</h2>
        <h5 style={{ color: "gray" }}>The requested page was not found.</h5>
      </div>
    </div>
  );
};

export default NotFound;
