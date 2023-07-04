import React, { useState } from "react";
import { useLocation } from "react-router";
import Footer from "./Footer";
import logo from "./img/logo.png";
import logoAlt from "./img/logoAlt.png";
import rightArrowBlue from "./img/rightArrowBlue.png"
import leftArrowYellow from "./img/leftArrowYellow.png"
import greenArrow from "./img/greenArrow.png"
import logoGif from "./img/logoGif.gif"
import logoOut from "./img/logoOut.gif"


function Home() {
  document.title = "comparify - Explore and compare your music";

  const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f";
  // const REDIRECT_URI = "http://localhost:3000/code";
  const REDIRECT_URI = "https://comparify.app/code";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = "user-top-read playlist-modify-public ugc-image-upload";

  const [zoomed, setZoomed] = useState(false);
  const location = useLocation();

  const handleClick = () => {
    setZoomed(true);
    document.getElementById("logoGif").src = logoOut;
    setTimeout(() => {
      
      // if(location.state?.switchUser) {
      // window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}&show_dialog=true`;
      // }
      // else {
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

      //}

    }, 1000);
  };





  
  return (
    <div className="appHeader">
      {location.state && location.state.apiError && (
        <div className="errorMessage2">
          API error. Make sure you're logged in and and/or try again later.
        </div>
      )}
      <button
        className={false ? "buttonZoom zoomed defaultBtn" : "defaultBtn"}
        // className={zoomed ? "buttonZoom zoomed defaultBtn" : "defaultBtn"}

        onClick={handleClick}
        title="Log in"
      >
        {/* <img src={logoAlt} className="appLogo" alt="logo" /> */}
  {/* <img src={rightArrowBlue} alt="Your Image"/> */}
      <div className="logoDiv">
      {/* <img src={rightArrowBlue} className="rightArrowBlue" alt="logo" />
      <img src={leftArrowYellow} className="leftArrowYellow" alt="logo" />
      <img src={greenArrow} className="greenArrow" alt="logo" /> */}
   
<img src={logoGif} id="logoGif" style={{width:'200px'}}/>
</div>

</button>


      <h1 className="logoName">comparify</h1>
      <div className="homeFooter">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
