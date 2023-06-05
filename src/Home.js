import React, {useEffect, useState, useRef} from 'react';
import logo from './img/logo.png';
import {Link, useNavigate} from 'react-router-dom';
import Footer from './Footer';




function Home() {
  const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f";
  const REDIRECT_URI = "http://localhost:3000/code";

  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = "user-top-read";

  // const [token, setToken] = useState("");

  //const [expirationTime, setExpirationTime] = useState("");///
  

  // useEffect(() => {
  //     const hash = window.location.hash;
  //     let token = window.localStorage.getItem("token");
  //     let expirationTime = window.localStorage.getItem("expirationTime");


      

  //     // if (!token && hash) {
  //       if ((!token || !expirationTime) && hash) {
  //         token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
  //         let expiresIn = hash.substring(1).split("&").find(elem => elem.startsWith("expires_in")).split("=")[1];//
  //         expirationTime = new Date().getTime() + parseInt(expiresIn) * 1000; // 

  //         window.location.hash = "";
  //         window.localStorage.setItem("token", token); 
          
  //         window.localStorage.setItem("expirationTime", expirationTime); //
  //     }

  //     setToken(token);  
  //     setExpirationTime(expirationTime); //    

  //     // if (isTokenExpired()) {
  //     //   logout();
  //     // }
      
  // }, []);


  // const navigate = useNavigate();

  // const isTokenExpired = () => {
  //   const expirationTime = localStorage.getItem("expirationTime");
  //   if (!expirationTime) {
  //     return true;
  //   }
  //   return new Date().getTime() > parseInt(expirationTime);
  // };

  // const logout = () => {

  //   setToken("");
  //   setExpirationTime("");
  //   window.localStorage.removeItem("token");
  //   window.localStorage.removeItem("expirationTime");
  //   navigate('/');
    
  // };

  // const logout = () => {
  //     setToken("");
  //     window.localStorage.removeItem("token");
      
  // };
  return (
    <div className="appHeader">
      {/* <Link to="/login"> */}
      <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>
        <img src={logo} className="appLogo" alt="logo"/>
      </a>
      {/* </Link> */}
      <h1 className="Logo-name" style={{
        background:
          'linear-gradient(to right, #1e90ff 0%, #1e90ff 40%, #18d860 40%, #18d860 60%, #FFDF00 60%, #FFDF00 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>comparify</h1>
      
      {/* <div style={{position:'absolute',marginBottom:'5px'}}><Footer/> </div> */}
      <div style={{ position: 'fixed', bottom: '5px'}}>
  <Footer />
</div>

    </div>  
  )
}

export default Home;