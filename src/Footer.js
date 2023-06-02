import React from 'react';
import {Link} from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import logo from './img/logo.png';



const Footer = () => {
  return (
  <div>
    <div className='footer'>
      <span><Link to="/"><img src={logo} style={{width:20}}></img></Link>&emsp;&copy; 2023&emsp;&emsp;</span><span id="infoTooltip">Info</span>
      <ReactTooltip
        anchorSelect="#infoTooltip"
        html={"comparify uses a variety of<br>data points from multiple time<br>spans to generate a code or<br>'Music Fingerprint' based on<br>your Spotify listening activity,<br>which you can then use to<br>compare and contrast your<br>taste with others and gain<br>unique insights.<br><br>Made by <a style='text-decoration:none' href='https://theobragstad.com'>Theo Bragstad</a>"}
        style={{backgroundColor:'#f2f2f2',color:'black',fontSize:14,pointerEvents: 'auto !important',fontWeight:'normal',zIndex:'2'}}
        clickable={'true'}>
      </ReactTooltip>
    </div>
  </div>
  );
}
  
export default Footer;