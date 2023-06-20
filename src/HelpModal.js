import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import spotify from './img/spotify.png';
import openai from './img/openai.png';


const HelpModal = () => {
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
      width: '75%',
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
      <span ><Link to="/"><img src={logo} style={{width:20, pointerEvents:'none'}}></img></Link>&emsp;&copy; 2023&emsp;&emsp;</span><span id="infoTooltip" className='hoverGray'>About</span>&emsp;&emsp;<span onClick={openFooterModal} style={{cursor:'pointer'}} className='hoverGray'>Help</span>
      <ReactTooltip
        anchorSelect="#infoTooltip"
        html={`comparify uses a variety of data points from multiple time spans to generate a code or "Music Fingerprint" based on your Spotify listening activity, which you can then use to compare with others and gain insights. <div style='padding-top:10px'>Made by <a style='text-decoration:none;color:#1e90ff' title="theobragstad.com" href='https://theobragstad.com'>Theo Bragstad</a></div>`}
        style={{pointerEvents: 'auto !important',fontWeight:'bold',zIndex:'2',borderRadius:'20px', wordBreak:'break-word', width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>

      <Modal
        isOpen={footerModalIsOpen}
        onRequestClose={closeFooterModal}
        contentLabel="Popup Window"
        style={customStyles}
      >
        <h1 className='helpTitle'>Help</h1>
        <h3 className='helpSection'>How to use comparify</h3>
        <div className='helpModalText' style={{fontWeight:'bold'}}>
        <ol>
  <li>Click on the logo to log in.</li>
  <li>You can then download your unique code to share with friends and family.</li>
  <li>You can also view your data by itself, across three time ranges (without comparing).</li>
  <li>Then, you have two options:</li>
  <ul>
    <li>Upload another code to compare with your own data. (You can also upload an older code of your own to see how things have changed.)</li>
    <li>Upload any two codes to compare.</li>
  </ul>
</ol>
        </div>
        <h5 className='helpSection'>Troubleshooting</h5>
        <div className='helpModalText'>
          <ul>
            <li>comparify is primarily intended for use on a computer rather than a mobile device. The app is still functional on mobile, but you will have a better experience on a computer.</li>
            <li>If a page or button won't load, try clearing your cookies. To get them to appear for deletion in your browser's website settings menu (in Chrome, the button to the left of the URL in the search bar), you may have to go to the <a style={{textDecoration:'none',  color:'#1e90ff'}} href="https://comparify.app/code">code</a> page of comparify. Then, go to the home page and try again.</li>
            <ul>
              <li>If this doesn't work, you can try a different browser or device, or try again later.</li>
              <li>The Spotify login session expires after one hour, so this could be the issue and you'll need to log in again and/or clear your cookies.</li>
            </ul>
            <li>The app times out after the Spotify login token expires, so you'll need to log in again.</li>
            <li>Due to Spotify's cookies, if you want to have another person log in to their own Spotify account on the same computer, you'll need to clear your cookies so that your session is cleared and the other person can enter their login information.</li>
            <li>Regarding the ChatGPT feature, the OpenAI API is quite rate-limited, so you may encounter generation errors. The solution is generally to wait a minute or two before retrying. If the error persists, try again at a later time. The app may be overloaded by other API calls from different users.</li>
            <li>The same can be said for the Spotify API, which may run into limits depending on traffic. The solution is the same as above.</li>
            <li>If you encounter a random error message (rare), some combination of reloading the page, clearing your cookies, and/or logging back in and trying again usually does the trick.</li>
            <li>Rarely, you may see a blank or strangely formatted entry in your one or more of your data results. This could be due to missing data in Spotify's database, or due to a piece of content you streamed to that the API cannot get a complete or valid response for (for example, if a song was removed from Spotify). A common way this can happen is if you listen to a leaked song that gets taken down; it will still appear in your top songs as a unique ID, but the API may fail to render some data for it.</li>
            <li>If you encounter issues with uploading a code, make sure the format is correct. The compare feature only works for codes directly generated by the app, which have a very specific format. If you alter a code in any way, you will encounter unexpected behavior.</li>
            <li>A note on some of the data points in the app: when a code is generated, the app uses Spotify's current popularity rating for various items to calculate values like the most popular song in your top songs for a given period. Once the code has been generated, there is no guarantee that the item's popularity will stay the same.
              For example, if upon generation of the code your most popular song has a popularity score of 96, then it will remain this way even though its popularity may decrease, or be surpassed by another song. Therefore, such data points may become inaccurate for older codes because popularity changes over time.
            </li>
          </ul>
        </div>
        <h5 className='helpSection'>How it works</h5>
        <div className='helpModalText'>
          <ul>
            <li>comparify uses the Spotify API to gather and analyze a large amount of Spotify user data about your music preferences from different time periods.</li>
            <li>Then, it generates a code in the form of a text file that serves as a "Musical Fingerprint" or snapshot of your taste at that moment in time.</li>
            <li>comparify is meant to provide unique and interesting insights into your Spotify activity and music habits in general.</li>
            <li>After logging in, you can either view your own data alone, or upload a comparify code from a friend or family member to compare your music.</li>
            <li>The data is compiled based on your 'Top Content' as determined by Spotify. For example, the 'most popular song' statistic displays the song with the highest popularity value that also appeared in your top 50 most-played songs for each given period.</li>
            <li>For select data points, such as the audio features, you can hover over them to see a tooltip providing more info by explaining what they mean.</li>
            <ul>
              <li>The audio features section gives you in-depth information about what characteristics you like in a song. For example, you might have a low average duration but a high duration standard deviation, which indicates that you mostly prefer shorter songs but are willing to explore and enjoy longer and shorter songs as well.</li>
              <li>For your convenience, the two highest and two lowest averages are highlighted in green and red respectively. These are features you tend to have a clear preference for or aversion to.</li>
              <li>The highest and lowest song columns let you see the outliers in your data; that is, songs that fall on either end of the spectrum, making them particularly unique elements that could also be indicative of your individual preferences.</li>
            </ul>
            
            <li>Note that for some data points, such as top genres, there are a number of different ways to calculate this, such as by top song frequency, top artist frequency, and so on. In these cases, the most objectively fair approach is taken by the algorithm in an effort to provide the most accurate information, but really there is no correct way to generate some types of data&#8212;only different ways.</li>
            <li>Also note that for stats like "most popular song", your results may change over time, even if your listening habits do not. This is because this stat measures your most popular song <i>currently</i>, meaning Spotify updates popularity values regularly.</li>
            <li>The compare page gives a similarity score for you and the other person for each time range. This is by no means a completely thorough picture of your similarity, but it does provide a rough sense of how much, and what types, of music you have in common.</li>
            <li>You can share your similarity score by saving it as an image.</li>
            <li>You can also upload any two comparify codes to see their comparison. You can see your friend's data compared with someone else, or even upload two of your own codes from different times to see if/how your habits have changed.</li>
            <li><span style={{color:'#1e90ff'}}>Blue</span> content indicates it is either your data or the first inputted user's code. <span style={{color:'#FFDF00'}}>Yellow</span> indicates data for the second user's code. <span style={{color:'#18d860'}}>Green</span> indicates shared items, or differences for statistics.</li>
          </ul>
        </div>
        <h5 className='helpSection'>Privacy, Data, and other Policy Information</h5>
        <div className='helpModalText'>
          <ul>
            <li>comparify uses the&ensp;<a style={{textDecoration:'none', color:'#1e90ff'}} href='https://developer.spotify.com/documentation/web-api'><span style={{fontSize:'12px', color:'#1ed760', fontWeight:'bold'}}><img src={spotify} style={{verticalAlign:'text-bottom', width:'80px', pointerEvents:'none'}}></img>&ensp;API&ensp;</span></a> to gather data and handle user login.</li>
            <li>No user data is used by this website for any other purposes than shown, and no sensitive personal data such as email addresses or passwords are shared.</li>
            <li>The only user data that is stored are temporary cookies which are needed to run the app.</li>
            <li><b>You can use your browser settings to clear these cookies at any time. They are not saved on a server.</b></li>
            <li>By choosing to log in to Spotify via comparify and using the app, you consent to analysis of the outlined music streaming data highlighted in the Spotify login permissions statement.</li>
            <li>comparify is a client-side app, meaning no data is sent to the cloud.</li>
            <li>You can revoke comparify's access to your Spotify account at any time through their <a style={{textDecoration:'none',color:'#1e90ff'}} href='https://www.spotify.com/uk/account/apps/'>website</a>.</li>
            <br></br>
            <li>comparify also uses the&ensp;<a style={{textDecoration:'none', color:'black', fontWeight:'bold', fontSize:'12px'}} href='https://openai.com/blog/openai-api'><img src={openai} style={{verticalAlign:'text-bottom', width:'80px', pointerEvents:'none'}}></img>&ensp;API&ensp;</a> to use ChatGPT.</li>
            <li>comparify sends a prompt to ChatGPT containing a brief summary of your music preferences. Due to size limits, the prompt is not intended to provide a complete picture of the data, but rather a brief overview.</li>
            <li>No personal data is used in the prompt. None of your Spotify account information is sent, and the prompt is anonymous beyond your music taste.</li>
            <li>Use of the OpenAI API is voluntary. If you do not wish to use it, simply do not press the button (indicated by the ChatGPT logo) and no data will be sent.</li>
            <br></br>
            <li><b>Note that comparify is in no way affiliated with Spotify.</b></li>
          </ul>
        </div>
        <div className='helpModalText' style={{marginTop:'30px'}}>
          For any further questions, email <a style={{textDecoration:'none', color:'#1e90ff'}} href='mailto:theobragstad2@gmail.com'>Theo Bragstad</a>.
        </div>
        <button className='closeBtn' onClick={closeFooterModal}>Close</button>
      </Modal>
    </div>
  </div>
  );
}
  
export default HelpModal;