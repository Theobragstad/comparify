import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useNavigate, Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import Animation from "./Animation";
import Footer from "./Footer";
import x from "./img/x.png";
import fullLogo from "./img/fullLogo.png";

import Cookies from "js-cookie";

import rightArrow from "./img/rightArrow.png";

function Home() {
  document.title = "comparify - Explore, analyze, and compare your music"
  const [isPausing, setIsPausing] = useState(false); // Add this state
  const cookieNoticeRef = useRef(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedDarkMode);

    const handleDarkModeChange = () => {
      setDarkMode(localStorage.getItem("darkMode") === "true");
    };

    window.addEventListener("darkModeChanged", handleDarkModeChange);

    return () => {
      window.removeEventListener("darkModeChanged", handleDarkModeChange);
    };
  }, []);

  const navigate = useNavigate();

  // document.title = "comparify | Explore and compare your music";
  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

  //
  // const REDIRECT_URI = "https://comparify.app/dashboard";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES =
    "user-top-read playlist-modify-public ugc-image-upload user-library-read user-follow-read user-read-currently-playing user-read-playback-position user-read-playback-state user-read-recently-played playlist-read-private";

  const location = useLocation();

  const handleClick = () => {
    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
  };

  const handleClickBETA = () => {
    navigate("/waitlist");
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
      navigate("/");
    }
  };

  const [agreeCookieNotice, setAgreeCookieNotice] = useState(false);
  useEffect(() => {
    if (agreeCookieNotice) {
      Cookies.set("agreeCookieNotice", true);
    }
  }, [agreeCookieNotice]);

  // const handleCookieNoticeClose = () => {
  //   setAgreeCookieNotice(true);
  // };
  const handleCookieNoticeClose = () => {
    setAgreeCookieNotice(true);
    setIsPausing(true);
  
    // Reset isPausing to false after 3 seconds
    setTimeout(() => {
      setIsPausing(false);
    }, 1000); // 3000 milliseconds = 3 seconds
  };
  

  const [squares, setSquares] = useState([]);
  const [gridFilled, setGridFilled] = useState(false);
  const squareSize = 10; // Change the size of squares as desired
  const maxSquares = 100; // Change the maximum number of squares as desired

  useEffect(() => {
    if (isPausing) {
      return; // If paused, do not generate squares
    }
    const colors = ["#18d860", "#1e90ff", "#ffdf00"];
    const rows = Math.floor(window.innerHeight / squareSize);
    const columns = Math.floor(window.innerWidth / squareSize);
    const totalCells = rows * columns;

    const generateRandomColor = () =>
      colors[Math.floor(Math.random() * colors.length)];

    const generateRandomCellPosition = () => ({
      top: `${Math.floor(Math.random() * rows) * squareSize}px`,
      left: `${Math.floor(Math.random() * columns) * squareSize}px`,
    });

    const fillGrid = () => {
      const newSquares = Array.from(
        { length: Math.min(maxSquares, totalCells) },
        (_, index) => ({
          id: index,
          color: generateRandomColor(),
          position: generateRandomCellPosition(),
        })
      );
      setSquares(newSquares);
      setGridFilled(true);
    };

    let currentIndex = 0;
    const addSquaresInterval = setInterval(() => {
        setSquares((prevSquares) => [
          ...prevSquares,
          {
            id: currentIndex,
            color: generateRandomColor(),
            position: generateRandomCellPosition(),
          },
        ]);
        currentIndex++;

        if (currentIndex >= Math.min(maxSquares, totalCells)) {
          clearInterval(addSquaresInterval);
          setGridFilled(true);
        }
      
    }, 100);

    return () => {
      clearInterval(addSquaresInterval);
    };
  }, [isPausing]);

  const preventContextMenu = (event) => {
    event.preventDefault(); // Prevents the context menu from appearing
  };

  console.log(location.state);
  return (
    <div className={agreeCookieNotice ? "appHeader" : "appHeader filter"}>
      {squares.map((square) => (
        <div
          key={square.id}
          className="square"
          style={{
            position: "absolute",
            top: square.position.top,
            left: square.position.left,
            width: `${squareSize}px`,
            height: `${squareSize}px`,
            borderRadius: "2px",
            backgroundColor: square.color,
            opacity: "0.7",
          }}
        />
      ))}

      {!Cookies.get("agreeCookieNotice") && (
        <div
          className={
            !Cookies.get("agreeCookieNotice") && !agreeCookieNotice
              ? "cookieNotice"
              : "cookieNotice hide"
          }
        >
          <div className="cookieNoticeText">
            comparify uses cookies. See the help page for more info.
          </div>
          <button
            title="Dismiss"
            className="cookieNoticeClose"
            onClick={handleCookieNoticeClose}
          >
            <img
              alt=""
              src={x}
              style={{ width: "10px" }}
              onContextMenu={(event) => event.preventDefault()}
            ></img>
          </button>
        </div>
      )}
      {location.state && location.state.apiError && (
        <div className="errorMessage2">
          Spotify timeout or error. Try logging in again.
        </div>
      )}

      {location.state && location.state.directAccessError && (
        <div className="errorMessage2">
          Internal processing error. Please try again.
        </div>
      )}

      <Link to="/">
        <img
          alt=""
          src={fullLogo}
          style={{}}
          className="fulllogoDiv"
          title="Home"
          onContextMenu={(event) => event.preventDefault()}
        />
      </Link>

      {/* <Link to="/:)"> */}
        <div
          className="betaIcon"
          // onClick={handleClickBETA}
          style={{ marginLeft: "15px", top: "25px",cursor:'default' }}
        >
          beta
        </div>
      {/* </Link> */}

      <div
        style={{
          position: "absolute",
          bottom: "100px",
          margin: "0 auto",
          right: "0",
          left: "0",
        }}
      >
        <span
          className="primaryBtn"
          style={{ marginRight: "20px" }}
          onClick={handleClickBETA}
          title="Join waitlist"
        >
          join waitlist{" "}
          <img
            alt=""
            src={rightArrow}
            style={{ width: "15px", verticalAlign: "middle" }}
            onContextMenu={(event) => event.preventDefault()}
          />
        </span>{" "}
        <span
          className="primaryBtn"
          onClick={handleClick}
          title="Authorized user login"
        >
          authorized users{" "}
          <img
            alt=""
            src={rightArrow}
            style={{ width: "15px", verticalAlign: "middle" }}
            onContextMenu={(event) => event.preventDefault()}
          />
        </span>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
