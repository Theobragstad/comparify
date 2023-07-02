import React, { useState } from "react";
import { useLocation } from "react-router";
import Footer from "./Footer";
import logo from "./img/logo.png";

function Home() {
  document.title = "comparify - Explore and compare your music";

  const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f";
  const REDIRECT_URI = "http://localhost:3000/code";
  // const REDIRECT_URI = "https://comparify.app/code";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = "user-top-read playlist-modify-public ugc-image-upload";

  const [zoomed, setZoomed] = useState(false);

  const handleClick = () => {
    setZoomed(true);
    setTimeout(() => {
      window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}&show_dialog=true`;
    }, 1000);
  };

  const location = useLocation();

  return (
    <div className="appHeader">
      {location.state && location.state.apiError && (
        <div className="errorMessage2">
          API error. Make sure you're logged in and and/or try again later.
        </div>
      )}
      <button className={zoomed ? "buttonZoom zoomed defaultBtn" : "defaultBtn"} onClick={handleClick} title="Log in">
        <img src={logo} className="appLogo" alt="logo" />
      </button>
      <h1 className="logoName">comparify</h1>
      <div className="homeFooter">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
