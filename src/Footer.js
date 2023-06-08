import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import logo from './img/logo.png';

import Modal from 'react-modal';
// import { fontFamily } from 'html2canvas/dist/types/css/property-descriptors/font-family';


const Footer = () => {
  const [footerModalIsOpen, setFooterModalIsOpen] = useState(false);

  const openFooterModal = async () => {
    setFooterModalIsOpen(true);
  };

  const closeFooterModal = () => {
    setFooterModalIsOpen(false);
  };


  const customStyles = {
    overlay: {
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      
      
    },
    content: {
      zIndex: 9999,
      width: '600px',
      height: 'fit-content',
      margin: 'auto',
      borderRadius: '10px',
      outline: 'none',
      padding: '20px',

      maxHeight: '600px',
      overflowY: 'auto',
    
    }
  };
  return (
  <div>
    <div className='footer'>
      <span ><Link to="/"><img src={logo} style={{width:20}}></img></Link>&emsp;&copy; 2023&emsp;&emsp;</span><span id="infoTooltip">Info</span>&emsp;&emsp;<span onClick={openFooterModal} style={{cursor:'pointer'}}>Help</span>
      <ReactTooltip
        anchorSelect="#infoTooltip"
        html={`comparify uses a variety of data points from multiple time spans to generate a code or "Music Fingerprint" based on your Spotify listening activity, which you can then use to compare your taste with others and gain unique insights. <div style='padding-top:10px'>Made by <a style='text-decoration:none;color:#bdf6d9' href='https://theobragstad.com'>Theo Bragstad</a></div>`}

        // html={"comparify uses a variety of<br>data points from multiple time<br>spans to generate a code or<br>'Music Fingerprint' based on<br>your Spotify listening activity,<br>which you can then use to<br>compare your taste with others<br>and gain unique insights.<span style='padding-top:5px'> Made by <a style='text-decoration:none;color:#bdf6d9' href='https://theobragstad.com'>Theo Bragstad</a></span>"}
        style={{backgroundColor:'#656565',color:'white',fontSize:14,pointerEvents: 'auto !important',fontWeight:'bold',zIndex:'2',borderRadius:'20px', wordBreak:'break-word', width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>
      <Modal
        isOpen={footerModalIsOpen}
        onRequestClose={closeFooterModal}
        contentLabel="Popup Window"
        style={customStyles} 
      >
        <h4>Help</h4>
        <h5>Troubleshooting</h5>
        <div className='helpModalText'>
          <ul>
            <li>If a page or button will not load, try clearing your cookies. To get them to appear for deletion in your browser's website settings menu (in Chrome, the button to the left of the URL in the search bar), you may have to go to the 'code' page of comparify. Then, go to the home page and try again.</li>
            <ul>
              <li>If this doesn't work, you can try a different browser or device, or try again later.</li>
              <li>Note that the Spotify login session expires after one hour, so this could be the issue and you'll need to log in again and/or clear your cookies.</li>
            </ul>
            <li>If you encounter a random error message (rare), some combination of reloading the page, clearing your cookies, and/or logging back in and trying again usually does the trick.</li>
            <li>Rarely, you may see a blank or strangely formatted entry in your one or more of your data results. This could be due to missing data in Spotify's database, or due to a song you listened to that the API cannot get a complete or valid response for.</li>
          </ul>
        
        </div>
        <h5>How comparify works</h5>
        <div className='helpModalText'>
          <ul>
            <li>comparify gathers and analyzes a large amount of data about your music preferences from different time periods.</li>
            <li>Then, it generates a code in the form of a text file that serves as a "Musical Fingerprint" or snapshot of your taste at that moment in time.</li>
            <li>comparify is meant to provide unique and interesting insights into your Spotify activity and music habits in general.</li>
            <li>After logging in, you can either view your own data alone, or upload a comparify code from a friend or family member to compare your music.</li>
            <li>For select data points, such as the audio features, you can hover over them to see a tooltip providing more info explaining what they mean.</li>
            <ul>
              <li>Note that for some data points, such as top genres, there are a number of different ways to calculate this, such as by top song frequency, top artist frequency, and so on. In these cases, the most objectively fair approach is taken by the algorithm in an effort to provide the most accurate information, but really there is no correct way to generate some types of data&#8212;only different ways.</li>
              <li>Also note that for stats like "most popular song", your results may change over time, even if your listening habits do not. This is because this stat measures the most popular song <i>currently</i>, meaning Spotify updates popularity values regularly.</li>
            </ul>
            <li>The compare page gives a similarity score for you and the other person for each time range. This is by no means a completely thorough conclusion of your similarity, but it does provide a rough sense of how much, and what types, of music you have in common.</li>
            <li>You can share your similarity score by saving it as an image.</li>
            <li>You can also upload any two comparify codes to see their comparison. You can see your friend's data compared with someone else, or even upload two of your own codes from different times to see if/how your habits have changed.</li>
          </ul>
        </div>
        <h5>Privacy Information</h5>
        <div className='helpModalText'>
          <ul>
            <li>comparify uses the <a style={{textDecoration:'none'}} href='https://developer.spotify.com/documentation/web-api'>Spotify API</a> to gather data and handle user login.</li>
            <li>No user data is used by this website for any other purposes than shown, and no sensitive personal data such as email addresses or passwords are shared.</li>
            <li>The only user data that is stored are temporary cookies which are needed to run the app.</li>
            <li>By choosing to log in to Spotify via comparify and using the app, you consent to analysis of your music streaming data as outlined in the login statement.</li>
            <li>comparify is a client-side app, meaning no data is sent to the cloud.</li>
            <li>You can revoke comparify's access to your Spotify account at any time through their website, <a style={{textDecoration:'none'}} href='https://www.spotify.com/uk/account/apps/'>here</a>.</li>
            <br></br>
            <li>comparify also uses the <a style={{textDecoration:'none'}} href='https://openai.com/blog/openai-api'>OpenAI API</a> to use ChatGPT.</li>
            <li>comparify sends a prompt to ChatGPT containing a brief summary of your music preferences.</li>
            <li>No personal data is used in the API prompt. Your Spotify display name is not sent, and the prompt is anonymous beyond your music taste.</li>
            <li>Use of the OpenAI API is voluntary. If you do not wish to use it, simply do not press the button (indicated by the ChatGPT logo) and no data will be sent.</li>
            <br></br>
            <li>For any further questions, email <a style={{textDecoration:'none'}} href='mailto:theobragstad2@gmail.com'>Theo Bragstad</a>.</li>
          </ul>
        </div>
        <button className='closeBtn' onClick={closeFooterModal}>Close</button>
      </Modal>
    </div>
  </div>
  );
}
  
export default Footer;