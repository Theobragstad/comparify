import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import Animation from "./Animation";
import Footer from "./Footer";
import logo from "./img/logo.png";
import x from "./img/x.png"

// import { DarkModeContext } from './App';
import Cookies from 'js-cookie';
import { useDarkMode } from "./DarkMode";



function Home() {
  const darkMode = useDarkMode();

  // const { darkMode, setDarkMode } = useContext(DarkModeContext);

  const navigate = useNavigate();

  document.title = "comparify - Explore and compare your music";

  const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f";
  // const REDIRECT_URI = "http://localhost:3000/code";
  const REDIRECT_URI = "https://comparify.app/code";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = "user-top-read playlist-modify-public ugc-image-upload user-library-read user-follow-read user-read-currently-playing";

  const location = useLocation();

  const handleClick = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
  };

  const handleClickBETA = () => {
    navigate("/beta");
  };



  const [expirationTime, setExpirationTime] = useState("");
  const [token, setToken] = useState("");


  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) {
      return true;
    }
    return new Date().getTime() > parseInt(expirationTime);
  };


  // useEffect(() => {
   
  // if (isTokenExpired()) {
  //   logout();
  // }
  // }, [handleClick]);

  const logout = (error) => {
    if (error === "apiError") {
      // clearCookies();
      setToken("");
      setExpirationTime("");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("expirationTime");
      navigate("/", { state: { [error]: true } });
    } else {
      // clearCookies();
      setToken("");
      setExpirationTime("");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("expirationTime");
      // navigate("/", { state: { switchUser: true } });
      navigate("/")
    }
  };


 

  const [dim1, setDim1] = useState(false);
  const [dim2, setDim2] = useState(false);
  const [dim3, setDim3] = useState(false);


  // useEffect(() => {
  //   let timeout;
  //   let interval;
  //   let count = 0;
  
  //   const startCycling = () => {
  //     interval = setInterval(() => {
  //       if (count % 3 === 0) {
  //         setDim1(false);
  //         setDim2(true);
  //         setDim3(true);
  //       } else if (count % 3 === 1) {
  //         setDim1(true);
  //         setDim2(false);
  //         setDim3(true);
  //       } else if (count % 3 === 2) {
  //         setDim1(true);
  //         setDim2(true);
  //         setDim3(false);
  //       }
  //       count++;
  //     }, 2000);
  //   };
  
  //   timeout = setTimeout(startCycling, 3150);
  
  //   return () => {
  //     clearTimeout(timeout);
  //     clearInterval(interval);
  //   };
  // }, []);
const [agreeCookieNotice, setAgreeCookieNotice] = useState(false);
  useEffect(() => {
    if(agreeCookieNotice) {
      Cookies.set('agreeCookieNotice', true)

    }
  },[agreeCookieNotice])


  



const handleCookieNoticeClose = () => {
  setAgreeCookieNotice(true);
 
};



  return (
    <div className={darkMode.darkModeOn ? "appHeader dark" : "appHeader"} >
    {/* <div > */}


{!Cookies.get('agreeCookieNotice') &&
      <div className={!Cookies.get('agreeCookieNotice') && !agreeCookieNotice ? "cookieNotice" : "cookieNotice hide"}>By using this app, you agree to our use of cookies.<span style={{fontSize:'13px'}}><br/>For more info, see the help page.<br/></span><button className="cookieNoticeClose"onClick={handleCookieNoticeClose}>Dismiss</button></div>
      }
      {location.state && location.state.apiError && (
        <div className="errorMessage2">
          API error. Make sure you're logged in and and/or try again later.
        </div>
      )}
      <div
        className={"defaultBtn"}
        onClick={()=>navigate('/')}
        title="Log in"
      >
        <img
          src={logo}
          className="appLogo"
          alt="logo"
          style={{
            position: "absolute",
            top: "20px",
            left: "30px",
            width: "60px",
            pointerEvents:'all'
          }}
        />
        <div className="logoDiv"></div>
        <h1 className="logoName">comparify</h1>

      </div>


      
      <div
        style={{
          position: "absolute",
          left: "5%",
          top: "20%",
          fontWeight: "bold",
          textAlign: "left",
          color: "darkgray",
          fontSize: "calc(15px + 2vmin)",
          fontFamily: 'gothamMedium',
        }}
        
      >
        <div style={{ position: "relative", top: "0px" }} className={dim1 ? "fade1 dim" : "fade1"}>
          <span className="match1">Explore</span>{" "}
          <span
            style={{ fontSize: "18px", color: "#1e90ff" }}
            className="fade2"
          >
            your music
          </span>
        </div>

        <div
          style={{ position: "relative", marginTop: "30px" }}
          className={dim2 ? "fade3 dim" : "fade3"}
        >
          <span className="match2">Discover</span>{" "}
          <span
            style={{ fontSize: "18px", color: "#18d860" }}
            className="fade4"
          >
            {" "}
            shared tastes
          </span>
        </div>

        <div
          style={{ position: "relative", marginTop: "30px" }}
          className={dim3 ? "fade5 dim" : "fade5"}
        >
          <span className="match3">Learn</span>{" "}
          <span
            style={{ fontSize: "18px", color: "#ffdf00" }}
            className="fade6"
          >
            <span style={{ color: "darkgray" }} className="match3">
              about
            </span>{" "}
            new music
          </span>
        </div>
      </div>




      
      <div
        className="betaIcon"
        // onClick={handleClickBETA}
        style={{ marginLeft:'20px' }}
      >
        beta
      </div>


      <Animation/>

      <div style={{ position: "absolute", bottom: "15%",margin:'0 auto',right:'0',left:'0' }}>
        <span
          className="gray"
          style={{ marginRight: "20px" }}
          onClick={handleClickBETA}
        >
          get access &#8594;
        </span>{" "}
        <span className="gray" onClick={handleClick}>
          authorized users &#8594;
        </span>
      </div>

      <div className="homeFooter">
        <Footer />
      </div>

     
    </div>
  );
}

export default Home;
