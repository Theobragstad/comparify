import React from 'react';
import logo from './img/logo.png';
import Footer from './Footer';

function Home() {
  const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f";
  // const REDIRECT_URI = "http://localhost:3000/code"; 
  const REDIRECT_URI = "https://comparify.app/code";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = "user-top-read";

  return (
    <div className="appHeader">
      <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>
        <img src={logo} className="appLogo" alt="logo"/>
      </a>
      <h1 className="Logo-name" style={{
        background:
        'linear-gradient(to right, #1e90ff 0%, #1e90ff 40%, #18d860 40%, #18d860 60%, #FFDF00 60%, #FFDF00 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>comparify</h1>
      <div style={{position: 'fixed', bottom: '5px'}}>
        <Footer />
      </div>
    </div>  
  )
}

export default Home;