import React, { useState } from "react";
import { Link } from "react-router-dom";
import Animation from "./Animation"
// import spotify from "./img/spotify.png";
// import logo from "./img/logo.png";
import downBtn from "./img/downBtn.png";
import sideArrowRight from "./img/sideArrowRight.png";
// import { DarkModeContext } from './App';
import "./App.css"

import { useDarkMode } from "./DarkMode";

const HelpModalContent = () => {
  const darkMode = useDarkMode();

  // const { darkMode, setDarkMode } = useContext(DarkModeContext);

  const [isHowToUseExpanded, setIsHowToUseExpanded] = useState(false);
  const [isTroubleshootingExpanded, setIsTroubleshootingExpanded] =
    useState(false);
  const [isHowItWorksExpanded, setIsHowItWorksExpanded] = useState(false);
  const [isPrivacyExpanded, setIsPrivacyExpanded] = useState(false);

  const [isBugReportsExpanded, setIsBugReportsExpanded] = useState(false);
  const toggleBugReports = () => {
    setIsBugReportsExpanded(!isBugReportsExpanded);
    setIsPrivacyExpanded(false);
    setIsTroubleshootingExpanded(false);
    setIsHowItWorksExpanded(false);
    setIsHowToUseExpanded(false);
  };

  const toggleHowToUse = () => {
    setIsHowToUseExpanded(!isHowToUseExpanded);
    setIsTroubleshootingExpanded(false);
    setIsHowItWorksExpanded(false);
    setIsPrivacyExpanded(false);
    setIsBugReportsExpanded(false);
  };

  const toggleTroubleshooting = () => {
    setIsTroubleshootingExpanded(!isTroubleshootingExpanded);
    setIsHowToUseExpanded(false);
    setIsHowItWorksExpanded(false);
    setIsPrivacyExpanded(false);
    setIsBugReportsExpanded(false);
  };

  const toggleHowItWorks = () => {
    setIsHowItWorksExpanded(!isHowItWorksExpanded);
    setIsTroubleshootingExpanded(false);
    setIsHowToUseExpanded(false);
    setIsPrivacyExpanded(false);
    setIsBugReportsExpanded(false);
  };

  const togglePrivacy = () => {
    setIsPrivacyExpanded(!isPrivacyExpanded);
    setIsTroubleshootingExpanded(false);
    setIsHowItWorksExpanded(false);
    setIsHowToUseExpanded(false);
    setIsBugReportsExpanded(false);
  };

  return (
    <div>
      <div
        className={
          darkMode.darkModeOn ? "helpModalContent darkGray" : "helpModalContent"
        }
      >
        <div className="gradientSimple" style={{fontSize:'30px',fontWeight:'bold'}}>Help</div>
        <div style={{position:'relative',width:'10px',height:'10px',top:'-55px',left:'50px',zIndex:'0'}}>
        <Animation/></div>
        <div style={{ fontWeight: "bold", fontSize: "13px", color: "gray" }}>
          comparify is in beta. Only select users can log in. Fill out the{" "}
          <Link
            to="/waitlist"
            style={{
              textDecoration: "none",
              fontWeight: "bold",
              color: "#1e90ff",
            }}
            title="Request beta access"
          >
            form
          </Link>{" "}
          to join the waitlist.
        </div>
        {/* <img src={logo} style={{width:'50px'}} className="pulse"/> */}
        {isHowToUseExpanded ? (
          <h3
            className="helpSection"
            onClick={toggleHowToUse}
            title="Collapse section"
          >
            How to use{" "}
            <span>
              <img
                src={downBtn}
                style={{ height: "10px" }}
                alt="Collapse section button"
              ></img>
            </span>
          </h3>
        ) : (
          <h3
            className="helpSection"
            onClick={toggleHowToUse}
            title="Expand section"
          >
            How to use{" "}
            <span>
              <img
                src={sideArrowRight}
                style={{ width: "10px" }}
                alt="Expand section button"
                onClick={toggleHowToUse}
              ></img>
            </span>
          </h3>
        )}
        {isHowToUseExpanded && (
          <div className="helpModalText">
            <ol>
              <li>Click on the button to log in.</li>
              <li>If you want, download your unique code to share it.</li>
              <li>
                You can view your listening data by itself (without comparing).
              </li>
              <li>You also have two comparison options:</li>
              <ul>
                <li>
                  Upload another code to compare with your own data. (You can
                  also upload an older code of your own to see how things have
                  changed.)
                </li>
                <li>Upload any two codes to compare.</li>
              </ul>
            </ol>
          </div>
        )}

        {isTroubleshootingExpanded ? (
          <h5
            className="helpSection"
            onClick={toggleTroubleshooting}
            title="Collapse section"
          >
            Troubleshooting{" "}
            <span>
              <img
                src={downBtn}
                style={{ height: "10px" }}
                alt="Collapse section button"
              ></img>
            </span>
          </h5>
        ) : (
          <h5
            className="helpSection"
            onClick={toggleTroubleshooting}
            title="Expand section"
          >
            Troubleshooting{" "}
            <span>
              <img
                src={sideArrowRight}
                style={{ width: "10px" }}
                alt="Expand section button"
                onClick={toggleTroubleshooting}
              ></img>
            </span>
          </h5>
        )}
        {isTroubleshootingExpanded && (
          <div className="helpModalText">
            <ul>
            <li>Long loading times</li>
            <ul>
              <li>The first time you use the app, it may take
               longer than normal to load data. This is because data is not
               cached yet. Subsequent retrievals (both of your own data and of
               data you are comparing with) are usually much faster after the
               initial access.</li>
            </ul>
            {/* <ul>
             
             <li><li>
             </ul> */}
              <li>
                comparify is primarily intended for use on a computer. You can
                still use it on mobile, but you will have a noticeably faster and more
                seamless experience on the desktop version.
              </li>
              <li>
                Some mobile browsers, including Chrome, require double taps to
                activate some buttons. If a button is not pressing on the first
                tap, try double tapping it.
              </li>
              <li>
                The general fix to many issues is to clear your cookies. To get
                them to appear for deletion in your browser's website settings
                menu (in Chrome, the button to the left of the URL in the search
                bar), you may have to go to the{" "}
                <a
                  style={{ textDecoration: "none", color: "#1e90ff" }}
                  href="https://comparify.app/dashboard"
                >
                  dashboard
                </a>
                . Then, go to the home page and try again.
              </li>
              <ul>
                <li>
                  If this doesn't work, try a different browser or device, or
                  try again later.
                </li>
                <li>
                  Note that the Spotify login session expires after one hour.
                </li>
              </ul>
              <li>
                If you try to log in and are redirected back home, this means
                that your previous session has expired and you must log in
                again.
              </li>
              <li>
                To have another user log in to their account on the same
                computer, click the switch user button on the dashboard page.
              </li>
              <li>
                The OpenAI API is quite rate-limited, so you may encounter
                generation errors with ChatGPT. The solution is generally to
                wait a minute or two before retrying. If the error persists, try
                again later. The app may be overloaded by other API calls.
              </li>
              <li>
                Spotify rate limits are less strict, but the solution is the
                same as above.
              </li>
              <li>
                Rarely, you may see a blank or strangely formatted entry in your
                one or more of your data results. This could be due to missing
                data in Spotify's database, or due to a piece of content you
                streamed to that the API cannot get a complete or valid response
                for (for example, if a song was removed from Spotify). A common
                way this can happen is if you listen to a leaked song that gets
                taken down. It will still appear in your top songs as a unique
                ID, but the API may fail to render some or all of the data for
                it.
              </li>
              <li>
                If you encounter issues with uploading a code, make sure the
                format is correct. The compare feature only works for codes
                directly generated by the app, which have a very specific
                format. If you alter a code in any way, you will encounter
                unexpected behavior.
              </li>
              <li>A note on some of the data points in the app</li>
              <ul>
              <li>
                When a code is
                generated, the app uses Spotify's current popularity rating for
                various items to calculate values like the most popular song in
                your top songs for a given period. Once the code has been
                generated, there is no guarantee that the item's popularity will
                stay the same. For example, if upon generation of the code your
                most popular song has a popularity score of 96, then it will
                remain this way even though its popularity may decrease, or be
                surpassed by another song. Therefore, such data points may
                become inaccurate for older codes because popularity changes
                over time (ie, if your most popular song displays a low
                popularity score, this does not mean that it was this low when
                the code was generated). Still, they give you a snapshot of the
                state of your music habits at that moment in time.
              </li></ul>
            </ul>
          </div>
        )}

        {isHowItWorksExpanded ? (
          <h5
            className="helpSection"
            onClick={toggleHowItWorks}
            title="Collapse section"
          >
            How it works + more info{" "}
            <span>
              <img
                src={downBtn}
                style={{ height: "10px" }}
                alt="Collapse section button"
              ></img>
            </span>
          </h5>
        ) : (
          <h5
            className="helpSection"
            onClick={toggleHowItWorks}
            title="Expand section"
          >
            How it works + more info{" "}
            <span>
              <img
                src={sideArrowRight}
                style={{ width: "10px" }}
                alt="Expand section button"
                onClick={toggleHowItWorks}
              ></img>
            </span>
          </h5>
        )}
        {isHowItWorksExpanded && (
          <div className="helpModalText">
            <ul>
              <li>
                comparify uses the{" "}
                <a
                  style={{ textDecoration: "none", color: "#1e90ff" }}
                  href="https://developer.spotify.com/documentation/web-api"
                >
                  Spotify Web API
                </a>{" "}
                to gather and analyze a large amount of Spotify user data about
                your music preferences from different time periods.
              </li>
              <li>
                Then, it generates a code in the form of a text file that serves
                as a "Music Fingerprint" or snapshot of your taste at that
                moment in time.
              </li>
              <li>
                comparify is meant to provide unique and interesting insights
                into your Spotify activity and music habits in general.
              </li>
              <li>
                The data is gathered based on your 'Top Content' as determined
                by Spotify. For example, the 'most popular song' statistic
                displays the song with the highest popularity value that also
                appeared in your top 50 most-played songs for the given time
                period.
              </li>
              <li>
                You can hover over select data labels/stats to learn more about
                them.
              </li>
              <ul>
                <li>
                  The audio features section gives you in-depth information
                  about what specific characteristics you tend to like in a
                  song. For example, you might have a low average duration but a
                  high duration standard deviation, which indicates that you
                  mostly prefer shorter songs but are willing to explore and
                  enjoy longer and shorter songs as well.
                </li>
                <li>
                  The two highest and two lowest averages/standard deviations
                  are highlighted in green and red respectively. These are
                  features you tend to have a clear preference for or aversion
                  to (or willingness/unwillingness to explore across a
                  particular feature).
                </li>
                <li>
                  The highest and lowest song columns let you see the outliers
                  in your data; that is, songs that fall on either end of the
                  spectrum, making them particularly unique elements that could
                  also be indicative of your individual preferences. These
                  values also indicate the range of your tastes.
                </li>
              </ul>
              <li>
                Note that there are multiple ways to calculate some data points,
                such as your top genres, which can be determined by top song
                frequency, top artist frequency, and so on. In these cases, the
                most fair approach is taken by the algorithm in an effort to
                provide the most accurate information, but really there is no
                "correct" way to generate some types of data&#8212;only
                different ways.
              </li>
              <li>
                Also note that for stats like "most popular song", your results
                may change over time, even if your listening habits do not. This
                is because this stat measures your most popular song{" "}
                <i>currently</i>, meaning Spotify updates popularity values
                regularly.
              </li>
              <li>
                Spotify considers singles to be a type of album, so if you see a
                song appearing in an album field on your dashboard then this is
                because it is categorized as one by the database.
              </li>
              <li>
                The "top genres" card is calculated using the most frequently appearing genres that Spotify associates with your top artists.
                Unfortunately the API does not provide access to any associated genres individual songs or albums, which might be a better representation of your top genres.
              </li>
              <li>
                The compare page gives a similarity score for you and the other
                person for each time range. This is by no means a completely
                thorough picture of your similarity, but it does provide a rough
                sense of how much, and what types, of music you have in common.
              </li>
              <li>
                You can share your similarity score by saving it as an image.
              </li>
              <li>
                You can also upload any two comparify codes to see their
                comparison. You can see your friend's data compared with someone
                else, or even upload two of your own codes from different times
                to see if/how your habits have changed.
              </li>
              <li>
                <span style={{ color: "#1e90ff" }}>Blue</span> content indicates
                it is either your data or the first inputted user's code.{" "}
                <span style={{ color: "#FFDF00" }}>Yellow</span> indicates data
                for the second user's code.{" "}
                <span style={{ color: "#18d860" }}>Green</span> indicates shared
                items, or differences for statistics.
              </li>
              <li>
                You can click a song's cover art to hear a 30-second audio
                preview.
              </li>
              <li>
                You can also click on select song names, artists, or albums to open them directly
                in Spotify.
              </li>
              <li>
                Recommendations:
                <ul>
                  <li>
                    You can generate 4 types of playlists with comparify: mixes,
                    exploratory mixes, blends, and non-blends.
                  </li>
                  <li>
                    These are each generated using the relevant data from the
                    page you're on. The algorithm does its best to make relevant
                    suggestions, but they may not always be perfectly
                    representative for the type of playlist they're intended
                    for.
                  </li>
                  <ul>
                    <li>
                      Also, when there is not enough data, the playlist may be
                      empty or limited (for example, if your similarity percent
                      is 100, the non-blend playlist will be empty).
                    </li>
                  </ul>
                  <li>
                    You can click to add one to your Spotify library as a public
                    playlist, and you can also reopen the modal to get a fresh
                    set of recommendations.
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        )}

        {isPrivacyExpanded ? (
          <h5
            className="helpSection"
            onClick={togglePrivacy}
            title="Collapse section"
          >
            Privacy + data + policy info{" "}
            <span>
              <img
                src={downBtn}
                style={{ height: "10px" }}
                alt="Collapse section button"
                onClick={togglePrivacy}
              ></img>
            </span>
          </h5>
        ) : (
          <h5
            className="helpSection"
            onClick={togglePrivacy}
            title="Expand section"
          >
            Privacy + data + policy info{" "}
            <span>
              <img
                src={sideArrowRight}
                style={{ width: "10px" }}
                alt="Expand section button"
                onClick={togglePrivacy}
              ></img>
            </span>
          </h5>
        )}
        {isPrivacyExpanded && (
          <div className="helpModalText">
            <ul>
              <li>
                comparify uses the{" "}
                <a
                  style={{ textDecoration: "none", color: "#1e90ff" }}
                  href="https://developer.spotify.com/documentation/web-api"
                >
                  Spotify Web API
                </a>{" "}
                to gather data.
              </li>
              <li>
                No user data is used by this app for any other purposes than the
                features shown, and no sensitive personal data is visible to the
                app.
              </li>
              <li>
                The only user data that is stored are temporary cookies which
                are needed to run the app.
              </li>
              <li>
                <b>
                  You can use your browser settings to clear these cookies at
                  any time.
                </b>
              </li>

              <li>
                You can revoke comparify's access to your Spotify account at any
                time through their{" "}
                <a
                  style={{ textDecoration: "none", color: "#1e90ff" }}
                  href="https://www.spotify.com/uk/account/apps/"
                >
                  website
                </a>
                .
              </li>
              <br></br>
              <li>
                comparify also uses the{" "}
                <a
                  style={{
                    textDecoration: "none",
                    // color: "black",
                    // fontWeight: "400",
                    // fontSize: "12px",
                    color: "#1e90ff",
                  }}
                  href="https://openai.com/blog/openai-api"
                >
                  {/* <span className="openaiText">
                    <img
                      src={openai}
                      style={{
                        verticalAlign: "text-bottom",
                        width: "55px",
                        pointerEvents: "none",
                      }}
                      className="openaiLogo"
                      alt="OpenAI logo"
                    ></img>
                  </span> */}
                  OpenAI API
                </a>{" "}
                for ChatGPT.
              </li>
              <li>
                comparify sends a prompt to ChatGPT containing a brief summary
                of your music preferences. The prompt is not intended to provide
                a complete picture of your data, but rather a general overview.
              </li>
              <li>
                No personal data is used in the prompt. None of your Spotify
                account information is sent, and the prompt is anonymous (beyond
                your music taste).
              </li>
              <li>
                Use of the OpenAI API is voluntary. If you don't want to use it,
                just don't press the button (indicated by the ChatGPT logo).
              </li>
              <br></br>
              <li>
                Credit goes to the{" "}
                <a
                  href="https://developer.spotify.com/documentation/web-api"
                  className="link"
                >
                  Spotify Web API
                </a>{" "}
                for the audio feature descriptions on the data and compare
                pages.
              </li>
              <br></br>
              <li>
                <b>Note that comparify is not affiliated with Spotify.</b>
              </li>
              <br></br>
              <h3>Cookies</h3>
              <li>
                comparify generates and saves cookies (small pieces of text) to
                improve your experience. By using the website you agree to our
                use of them.{" "}
              </li>
              <li>
                The cookies we store are limited to ones that are essential to
                the app. They are: your dark/light mode setting, and whether or
                not you have dismissed the cookie notice. No personal or private
                data is stored.
              </li>
              <li>
                Spotify also uses cookies to handle the login session. See the{" "}
                <a
                  className="link"
                  href="https://www.spotify.com/us/legal/cookies-policy/"
                >
                  Spotify cookie policy
                </a>{" "}
                for more info.
              </li>
              <li>
                You can clear any or all of these at any time through your
                browser settings.
              </li>
              <li>The ChatGPT plugin via OpenAI does not store any cookies.</li>
            </ul>
          </div>
        )}

        {isBugReportsExpanded ? (
          <h5
            className="helpSection"
            onClick={toggleBugReports}
            title="Collapse section"
          >
            Bugs + suggestions{" "}
            <span>
              <img
                src={downBtn}
                style={{ height: "10px" }}
                alt="Collapse section button"
                onClick={toggleBugReports}
              ></img>
            </span>
          </h5>
        ) : (
          <h5
            className="helpSection"
            onClick={toggleBugReports}
            title="Expand section"
          >
            Bugs + suggestions{" "}
            <span>
              <img
                src={sideArrowRight}
                style={{ width: "10px" }}
                alt="Expand section button"
                onClick={toggleBugReports}
              ></img>
            </span>
          </h5>
        )}
        {isBugReportsExpanded && (
          <div className="helpModalText">
            <ul>
              <li>
                Since comparify is still in beta, you may run into bugs. We're
                always working on improving the app, so you can send these to
                the email below.
              </li>
              <li>We also welcome general suggestions for improvements.</li>
            </ul>
          </div>
        )}
      </div>
      <div className="helpModalFooter">
        <div style={{ fontSize: "12px", fontWeight: "bold" }}>
          <a
            style={{ textDecoration: "none", color: "#1e90ff" }}
            href="mailto:contact@comparify.app"
            title="Email us"
          >
            contact@comparify.app
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpModalContent;
