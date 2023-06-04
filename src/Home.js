import React, {useEffect, useState, useRef} from 'react';
import logo from './img/logo.png';
import {Link} from 'react-router-dom';
import Footer from './Footer';




function Home() {
  const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f";
  const REDIRECT_URI = "http://localhost:3000/code";

  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = "user-top-read";

  const [token, setToken] = useState("");

  useEffect(() => {
      const hash = window.location.hash;
      let token = window.localStorage.getItem("token");

      if (!token && hash) {
          token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
          window.location.hash = "";
          window.localStorage.setItem("token", token);
      }

      setToken(token);
  }, []);

  const logout = () => {
      setToken("");
      window.localStorage.removeItem("token");
  };
  return (
    <div className="appHeader">
      {/* <Link to="/login"> */}
      <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>
        <img src={logo} className="appLogo" alt="logo"/>
      </a>
      {/* </Link> */}
      <h1 className="Logo-name">comparify</h1>
      <Footer/>          
    </div>  
  )
}

export default Home;