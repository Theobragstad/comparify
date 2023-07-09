import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import {Tooltip } from "react-tooltip"
import "./MoreData.css";
import "./App.css";

import axios from "axios";
// import Cookies from 'js-cookie';

import arrowRight from "./img/sideArrowRight.png"
import arrowDown from "./img/downBtn.png"

const MoreData = () => {
    document.title = "comparify - More data";

  const location = useLocation();
  const navigate = useNavigate();

  const token = location.state.token;

  const [savedShows, setSavedShows] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [savedAlbums, setSavedAlbums] = useState([]);

  const getSavedShows = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/me/shows", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 50,
        },
      });


      setSavedShows(
        data.items.map((item) => ({
        addedAt: item.added_at,
          id: item.show.id,
          url: item.show.external_urls.spotify,
          img: item.show.images[0].url,
          name: item.show.name,
          publisher: item.show.publisher,
        })))

    } catch (error) {
      console.log(error);
    }
  };



  const getFollowedArtists = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/me/following", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          type: 'artist',
          limit: 50,
        },
      });

      if(data.items) {
      setFollowedArtists(
        data.items.map((artist) => ({
          id: artist.id,
          url: artist.external_urls.spotify,
          img: artist.images[0].url,
          name: artist.name,
        })))
    }

    } catch (error) {
      console.log(error);
    }
  };





  const getSavedAlbums = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/me/albums", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 50,
        },
      });


      setSavedAlbums(
        data.items.map((item) => ({
            addedAt: item.added_at,
releaseDate: item.release_date,
          id: item.album.id,
          url: item.album.external_urls.spotify,
          img: item.album.images[0].url,
          name: item.album.name,
          artists: item.album.artists.map((artist) => artist.name),
        })))

    } catch (error) {
      console.log(error);
    }
  };





const [currentObject, setCurrentObject] = useState(null)


  const getCurrentObject = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // params: {
        //   limit: 50,
        // },
      });
      console.log(data)



      if(data.currently_playing_type === "track") {
setCurrentObject({
    type: "track",
    // id: data.trackObject.id,
    name: data.item.name,
    artists: data.item.artists.map((artist) => artist.name),
    img: data.item.album.images[0].url,
    mp3: data.item.preview_url,
    url: data.item.external_urls.spotify,
})
      }
      else if(data.currently_playing_type === "episode"){
         setCurrentObject(
       {
        type: "episode",
        id: data.item.id,
        audio_preview_url: data.item.audio_preview_url,
        url: data.item.external_urls.spotify,
        img: data.item.images[0].url,
        name: data.item.name,
        // publisher: data.item.publisher,
      })
      }
    

     console.log(currentObject)

    } catch (error) {
      console.log(error);
    }
  };





//   const [showInfo, setShowInfo] = useState(!Cookies.get("shownInfo"));

//   const toggleShowInfo = () => {
//     setShowInfo((prevShowInfo) => !prevShowInfo);
//   };

  useEffect(() => {
    getSavedShows();
    getFollowedArtists();
    getSavedAlbums();
    getCurrentObject();
  }, []);

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//         if(!Cookies.get("shownInfo")) {
//       setShowInfo(false);}
//     Cookies.set("shownInfo", "true");
//     }, 5000);

//     return () => clearTimeout(timeout);
//   }, []);


const [arrowSrc, setArrowSrc] = useState(arrowRight);

const handleMouseOver = () => {
  setArrowSrc(arrowDown);
};

const handleMouseOut = () => {
  setArrowSrc(arrowRight);
};
  return (
    <div>
      <div className={"moreDataContainer"}>
      <div className="titleDiv" style={{ display: "flex", alignItems: "center",marginTop:'20px',marginBottom:'10px'}}>
      <div
        className="gray"
        style={{ marginRight: "20px" ,fontSize:'11px'}}
        onClick={() => navigate('/data', { state: { data: location.state.data, token: token } })}
      >
        &#8592; back
      </div>
      {/* <div style={{ cursor: 'pointer', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={toggleShowInfo}> */}
      <div style={{ cursor: 'pointer', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}} data-tooltip-id="tooltip1"  onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut} >

        More data <img id="arrow" src={arrowSrc} style={{marginLeft:'10px', width: arrowSrc === arrowDown ? '20px':'10px' }}/>
      </div>
    </div>



        {/* {showInfo && 
        <div className="subtitle">
          Your comparify code is meant to only include information that provides
          a pure indication of your listening habits.
          <br />
          <br />
          These are some stats that we decided not to include, because they are
          not necessarily representative of what you actually listen to on a
          regular basis.
          <br />
          <br />
          However, they are still an interesting and valuable part of your music
          profile.
        </div>} */}




        <div className="card-row">
        <div className="primaryCard1">
          <div className="primaryTitle">saved shows</div>
          {savedShows.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            savedShows.map((show, index) => (
                <div key={index} className="item">
                <div
                  className={`primaryImage`}
                >

                  <img src={show.img} className="primaryImage" />

                  
                </div>

                <div className="primaryText">
                  <span className="primaryName">
                    <a className="link2" href={show.url}>
                      {show.name}
                    </a>
                  </span>
                  <span className="primaryArtists">
                    {show.publisher.length > 30? show.publisher.substring(0,30) + "...":show.publisher}
                  </span>
                </div>
              </div>
              ))
          )}
        </div>



        <div className="primaryCard2">
          <div className="primaryTitle">followed artists</div>
          {followedArtists.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            followedArtists.map((artist, index) => (
              <div key={index} className="item">
                <img src={artist.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">
                  <a className="link2" href={artist.url}>
                      {artist.name}
                    </a>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>







        <div className="primaryCard1">
          <div
            className="primaryTitle"
           
          >
            saved albums
          </div>
          {savedAlbums.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            savedAlbums.map((album, index) => (
              <div key={index} className="item">
                <img src={album?.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">

                  <a className="link2" href={album.url}>
                      {album.name}
                    </a>
                  </span>
                  <span className="primaryArtists">
                    {album.artists?.join(", ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>





 <div className="primaryCard1">
          <div
            className="primaryTitle"
           
          >
            currently playing
          </div>
          {!currentObject ? (
            <div className="noData">No data</div>
          ) : currentObject.type === "track" ? (
            // topSongs.map((song, index) => (
                <div className="item">

                  <div
                    className={`primaryImage`}
                    // onClick={() => togglePlayback(`audio-element${index}`)}
                  >
                    {/* <audio id={`audio-element${index}`} src={song?.mp3}></audio> */}
  
                    <img src={currentObject.img} className="primaryImage" />
  
                    {/* {currentObject.mp3 && (
                      <div
                        className={
                          isPlaying[`audio-element${index}`]
                            ? "paused"
                            : "playing"
                        }
                      ></div>
                    )} */}
                  </div>
  
                  <div className="primaryText">
                    <span className="primaryName">
                      <a className="link2" href={currentObject.url}>
                        {currentObject.name}
                      </a>
                    </span>
                    <span className="primaryArtists">
                      {currentObject.artists?.join(", ")}
                    </span>
                  </div>
                </div>
            //   ))
        

          ): (

            <div >
                <div
                  className={`primaryImage`}
                >

                  <img src={currentObject.img} className="primaryImage" />

                  
                </div>

                <div className="primaryText">
                  <span className="primaryName">
                    <a className="link2" href={currentObject.url}>
                      {currentObject.name}
                    </a>
                  </span>
                  <span className="primaryArtists">
                    {currentObject.publisher.length > 30? currentObject.publisher.substring(0,30) + "...":currentObject.publisher}
                  </span>
                </div>
              </div>
        
          )}
        </div>

        </div>

        
      </div>

      <Tooltip id="tooltip1" className="tooltip3">
      Your comparify code is meant to only include information that provides
          a pure indication of your listening habits.
          <br />
          <br />
          These are some stats that we decided not to include, because they are
          not necessarily representative of what you actually listen to on a
          regular basis.
          <br />
          <br />
          However, they are still an interesting and valuable part of your music
          profile.
        </Tooltip>
    </div>
  );
};

export default MoreData;
