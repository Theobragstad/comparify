import React from 'react'
import logo from './logo.png';
import {Link} from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'

import { useState } from "react";




function Home() {
  // const [open, setOpen] = useState(false);
    return (
      
        <div className="App-header">
          <Link to="/login">
            <img src={logo} className="App-logo" alt="logo"/>
          </Link>
          <h1 className="Logo-name">comparify</h1>
          <div style={{position:'absolute',paddingTop:700, fontWeight:'bold', fontSize:10}}>

          <span id="aboutTip">about</span>
          
          <ReactTooltip
            anchorSelect="#aboutTip"
            html={"comparify uses a variety of<br>data points from multiple time<br>spans to generate a code or<br>'Music Fingerprint' based on<br>your Spotify listening activity,<br>which you can then use to<br>compare and contrast your<br>taste with others and gain<br>unique insights into<br>your music.<br><br>made by <a style='text-decoration:none' href='https://theobragstad.com'>Theo Bragstad</a>"}
            style={{backgroundColor:'#f2f2f2',color:'black',fontSize:14,pointerEvents: 'auto !important'}}
            clickable={'true'}
            >
            </ReactTooltip>
            

              

            
          </div>
        </div>

        
        
    )
}

export default Home