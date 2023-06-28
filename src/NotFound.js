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
        marginTop: "15vh",
      }}
    >
      <img src={earth} style={{ width: "120px" }} />
      <div style={{ marginLeft: "20px", textAlign: "left" }}>
        <h2>404</h2>
        <h5 style={{ color: "gray" }}>The requested page was not found.</h5>
      </div>
    </div>
  );
};

export default NotFound;
