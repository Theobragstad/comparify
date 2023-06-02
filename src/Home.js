import React from 'react';
import logo from './img/logo.png';
import {Link} from 'react-router-dom';
import Footer from './Footer';



function Home() {
  return (
    <div className="appHeader">
      <Link to="/login">
        <img src={logo} className="appLogo" alt="logo"/>
      </Link>
      <h1 className="Logo-name">comparify</h1>
      <Footer/>          
    </div>  
  )
}

export default Home;