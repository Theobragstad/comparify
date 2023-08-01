import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import Animation from "./Animation";
import Footer from "./Footer";
// import logo from "./img/logo.png";
import x from "./img/x.png"
import fullLogo from "./img/fullLogo.png"

// import bg from "./img/bg.png"

import Cookies from 'js-cookie';

import rightArrow from "./img/rightArrow.png"



function Home() {
  
  

  

  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(storedDarkMode);

    const handleDarkModeChange = () => {
      setDarkMode(localStorage.getItem('darkMode') === 'true');
    };

    window.addEventListener('darkModeChanged', handleDarkModeChange);

    return () => {
      window.removeEventListener('darkModeChanged', handleDarkModeChange);
    };
  }, []);






  const navigate = useNavigate();

  // document.title = "comparify | Explore and compare your music";
  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000/dashboard";

  
  //
  // const REDIRECT_URI = "https://comparify.app/dashboard";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = "user-top-read playlist-modify-public ugc-image-upload user-library-read user-follow-read user-read-currently-playing user-read-playback-position user-read-playback-state user-read-recently-played playlist-read-private";

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


 

  // const [dim1, setDim1] = useState(false);
  // const [dim2, setDim2] = useState(false);
  // const [dim3, setDim3] = useState(false);


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







const [squares, setSquares] = useState([]);

useEffect(() => {
  const colors = ["#18d860", "#1e90ff", "#ffdf00"];

  const generateRandomPosition = () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
  });

  const generateRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  const addRandomSquare = () => {
    const newSquare = {
      id: squares.length + 1,
      color: generateRandomColor(),
      position: generateRandomPosition(),
    };
    setSquares((prevSquares) => [...prevSquares, newSquare]);
  };

  const squareInterval = setInterval(addRandomSquare, 500);

  return () => {
    clearInterval(squareInterval);
  };
}, []);

useEffect(() => {
  const squareTimer = setTimeout(() => {
    if (squares.length > 0) {
      setSquares((prevSquares) => prevSquares.slice(1));
    }
  }, 3000);

  return () => {
    clearTimeout(squareTimer);
  };
}, [squares]);


  return (
    // <div className={darkMode ? "appHeader dark" : "appHeader"} style={{overflow:'hidden', backgroundImage: `url("${bg}") `}}  >
    <div className={darkMode ? "appHeader dark" : "appHeader"} style={{overflow:'hidden'}}  >

    <Animation/>

    {squares.map((square) => (
        <div
          key={square.id}
          className="square"
          style={{
            position: "absolute",
            top: square.position.top,
            left: square.position.left,
            width: "10px",
            height: "10px",
            borderRadius:'2px',
            backgroundColor: square.color,
            // zIndex:'0',
          }}
        />
      ))}



{!Cookies.get('agreeCookieNotice') &&
<div className={!Cookies.get('agreeCookieNotice') && !agreeCookieNotice ? "cookieNotice" : "cookieNotice hide"}>
  <div className="cookieNoticeText">
    comparify uses cookies. See the help page for more info.
  </div>
  <button title="Dismiss" className="cookieNoticeClose" onClick={handleCookieNoticeClose}><img alt="" src={x} style={{width:'10px'}}></img></button>
</div>
      }
      {(location.state && location.state.apiError) && (
        <div className="errorMessage2">
          Spotify timeout or error. Try logging in again.
        </div>
      )}

{location.state && location.state.directAccessError && (
        <div className="errorMessage2">
          Internal error. Please try again.
        </div>
      )}
      {/* <div
        className={"defaultBtn"}
        onClick={()=>navigate('/')}
        title="Log in"
      >
        <img alt=""
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

      </div> */}

<img alt=""
        src={fullLogo}
        onClick={() => navigate("/")}
        style={{
          width: "175px" ,
          position: "absolute",
          top: "10px",
          left: "10px",
          pointerEvents: "all",
          cursor: "pointer",
          backgroundColor:'white',
          padding:'4px',
          boxShadow:' 0 2px 10px rgba(0, 0, 0, 0.3)',
          borderRadius:'20px'

        }}
        title="Home"
      />




      
      <div
        className="betaIcon"
        // onClick={handleClickBETA}
        style={{ marginLeft:'15px',top:'25px' }}
      >
        beta
      </div>



      <div style={{ position: "absolute", bottom: "100px", margin: "0 auto", right: "0", left: "0" }}>
  <span className="primaryBtn" style={{ marginRight: "20px"}} onClick={handleClickBETA} title="Get access">
    get access <img alt="" src={rightArrow} style={{ width: '15px', verticalAlign: 'middle' }} />
  </span>{" "}
  <span className="primaryBtn" onClick={handleClick} title="Log in" >
    authorized users <img alt="" src={rightArrow} style={{ width: '15px', verticalAlign: 'middle' }} />
  </span>
</div>

      
{/* <Footer/> */}
     
    </div>
  );
}

export default Home;
