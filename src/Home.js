import React, { useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

import Footer from "./Footer";
import logo from "./img/logo.png";
import logoAlt from "./img/logoAlt.png";
import rightArrowBlue from "./img/rightArrowBlue.png"
import leftArrowYellow from "./img/leftArrowYellow.png"
import greenArrow from "./img/greenArrow.png"
import logoGif from "./img/logoGif.gif"
import logoOut from "./img/logoOut.gif"

import Spline from '@splinetool/react-spline';



function Home() {

  const navigate = useNavigate();
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
    // setZoomed(true); //yeee
    // document.getElementById("logoGif").src = logoOut;
    // setTimeout(() => {
      
     
    //     window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;


    // }, 1000);

    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;
  };




  const handleClickBETA = () => {
   navigate("/beta")
  };


  
  return (
    <div className="appHeader">
      {location.state && location.state.apiError && (
        <div className="errorMessage2">
          API error. Make sure you're logged in and and/or try again later.
        </div>
      )}
      <button
        className={zoomed ? "buttonZoom zoomed defaultBtn" : "defaultBtn"}

        onClick={handleClick}  //BETA
        // onClick={handleClickBETA}
        title="Log in"
      >
        <img src={logo} className="appLogo" alt="logo" style={{position:'absolute', top:'20px', left:'30px', width:'60px'}}/>
      <div className="logoDiv">



        


      {/* <img src={rightArrowBlue} className="rightArrowBlue" alt="logo" />
      <img src={leftArrowYellow} className="leftArrowYellow" alt="logo" />
      <img src={greenArrow} className="greenArrow" alt="logo" /> */}
   
{/* <img src={logoGif} id="logoGif" style={{width:'200px'}}/> */}
</div>

</button>


{/* <div style={{position:"absolute",left:'150px', top:'200px', fontWeight:'bold', textAlign:'left', color:'#f8f8ff', fontSize:'30px'}}> */}
<div style={{position:"absolute",left:'5%', top:'20%', fontWeight:'bold', textAlign:'left', color:'darkgray', fontSize:'calc(15px + 2vmin)'}}>

<div  style={{position:"relative",top:'0px'}} className="fade1">
<span className="match1">Explore</span> <span style={{fontSize:'18px', color:'#1e90ff'}} className="fade2">your music</span>
{/* Learn 
Discover  */}


{/* your music
about other people's music
shared tastes and new music */}
</div>

<div style={{position:"relative",marginTop:'30px'}} className="fade3">
<span className="match2">Discover</span> <span  style={{fontSize:'18px', color:'#18d860'}} className="fade4"> shared tastes and new music</span>
{/* Learn 
Discover  */}


{/* your music
about other people's music
shared tastes and new music */}
</div>

<div style={{position:"relative",marginTop:'30px'}} className="fade5">
<span className="match3">Learn</span> <span  style={{fontSize:'18px', color:'#ffdf00'}} className="fade6"><span style={{color:'darkgray'}} className="match3">about</span> other people's music</span>
{/* Learn 
Discover  */}


{/* your music
about other people's music
shared tastes and new music */}
</div>
</div>
<Spline scene="https://prod.spline.design/9GnnxPg3NnntVq3C/scene.splinecode" className="animation"/>




      <h1 className="logoName">comparify</h1>
      <div className="betaIcon" onClick={handleClickBETA} style={{cursor:'pointer'}}>beta</div>


    <div style={{position:'absolute', bottom:'15%'}}>
      <span className="gray" style={{marginRight:'20px'}} onClick={handleClickBETA}>get access &#8594;</span>     <span className="gray" onClick={handleClick} >authorized users &#8594;</span>    
    </div>


      <div className="homeFooter">


        <Footer />
      </div>
    </div>
  );
}

export default Home;
