import React from 'react';
import {Link} from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import logo from './img/logo.png';



const Footer = () => {
  return (
  <div>
    <div className='footer'>
      <span ><Link to="/"><img src={logo} style={{width:20}}></img></Link>&emsp;&copy; 2023&emsp;&emsp;</span><span id="infoTooltip">Info</span>
      <ReactTooltip
        anchorSelect="#infoTooltip"
        html={"comparify uses a variety of data points from multiple time spans to generate a code or 'Music Fingerprint' based on your Spotify listening activity, which you can then use to compare your taste with others and gain unique insights. <div style='padding-top:10px'>Made by <a style='text-decoration:none;color:#bdf6d9' href='https://theobragstad.com'>Theo Bragstad</a></div>"}

        // html={"comparify uses a variety of<br>data points from multiple time<br>spans to generate a code or<br>'Music Fingerprint' based on<br>your Spotify listening activity,<br>which you can then use to<br>compare your taste with others<br>and gain unique insights.<span style='padding-top:5px'> Made by <a style='text-decoration:none;color:#bdf6d9' href='https://theobragstad.com'>Theo Bragstad</a></span>"}
        style={{backgroundColor:'#656565',color:'white',fontSize:14,pointerEvents: 'auto !important',fontWeight:'bold',zIndex:'2',borderRadius:'20px', wordBreak:'break-word', width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>
    </div>
  </div>
  );
}
  
export default Footer;