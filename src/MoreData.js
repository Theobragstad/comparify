import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "./MoreData.css";
import "./App.css";

import Footer from "./Footer"

import axios from "axios";
// import Cookies from 'js-cookie';

import arrowRight from "./img/sideArrowRight.png";
import arrowDown from "./img/downBtn.png";
import fullLogo from "./img/fullLogo.png";
import refreshIcon from "./img/refresh.png";

import rightArrow from "./img/rightArrow.png"
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
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowedArtists = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/following",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            type: "artist",
            limit: 50,
          },
        }
      );

      if (data.items) {
        setFollowedArtists(
          data.items.map((artist) => ({
            id: artist.id,
            url: artist.external_urls.spotify,
            img: artist.images[0].url,
            name: artist.name,
          }))
        );
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
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [currentObject, setCurrentObject] = useState(null);

  const getCurrentObject = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            additional_types: "episode",
          },
        }
      );
      console.log(data);

      if (data.currently_playing_type === "track") {
        setCurrentObject({
          type: "track",
          // id: data.trackObject.id,
          name: data.item.name,
          artists: data.item.artists.map((artist) => artist.name),
          img: data.item.album.images[0].url,
          mp3: data.item.preview_url,
          url: data.item.external_urls.spotify,
        });
      } else if (data.currently_playing_type === "episode") {
        setCurrentObject({
          type: "episode",
          id: data.item.id,
          audio_preview_url: data.item.audio_preview_url,
          url: data.item.external_urls.spotify,
          img: data.item.images[0].url,
          name: data.item.name,
          podcast: data.item.show.name,
        });
      }

      console.log(currentObject);
    } catch (error) {
      console.log(error);
    }
  };

  const [savedEpisodes, setSavedEpisodes] = useState([]);

  const getSavedEpisodes = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/episodes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 50,
          },
        }
      );
      //   console.log(data.items.map((item)=>item.episode.name))

      const episodes = data.items.map((item) => ({
        addedAt: item.added_at,
        id: item.episode.id,
        url: item.episode.external_urls.spotify,
        img: item.episode.images[0].url,
        name: item.episode.name,
        mp3: item.episode.audio_preview_url,
        show: item.episode.show.name,
      }));

      setSavedEpisodes(episodes);
    } catch (error) {
      console.log(error);
    }
  };

  const [savedSongs, setSavedSongs] = useState([]);

  const getSavedSongs = async () => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/me/tracks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 50,
        },
      });

      setSavedSongs(
        data.items.map((item) => ({
          addedAt: item.added_at,
          id: item.track.id,
          url: item.track.external_urls.spotify,
          img: item.track.album.images[0]?.url,
          name: item.track.name,
          mp3: item.track.preview_url,
          artists: item.track.artists.map((artist) => artist.name),
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [savedAudiobooks, setSavedAudiobooks] = useState([]);

  const getSavedAudiobooks = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/audiobooks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 50,
          },
        }
      );

      setSavedAudiobooks(
        data.items.map((item) => ({
          addedAt: item.added_at,
          id: item.id,
          url: item.external_urls.spotify,
          img: item.album.images[0]?.url,
          name: item.name,
          authors: item.authors.map((author) => author.name),
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [queue, setQueue] = useState([]);

  const getQueue = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/player/queue",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 50,
          },
        }
      );

      const objects = data.queue;

      const queueArray = [];

      objects.forEach(function (object) {
        if (object.hasOwnProperty("album")) {
          queueArray.push({
            type: "song",
            id: object.id,
            url: object.external_urls.spotify,
            img: object.album.images[0]?.url,
            name: object.name,
            mp3: object.preview_url,
            artists: object.artists.map((artist) => artist.name),
          });
        } else if (object.hasOwnProperty("description")) {
          queueArray.push({
            type: "episode",
            id: object.id,
            url: object.external_urls.spotify,
            img: object.images[0].url,
            name: object.name,
            mp3: object.audio_preview_url,
            show: object.show.name,
          });
        }
      });

      setQueue(queueArray);
    } catch (error) {
      console.log(error);
    }
  };

  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  const getRecentlyPlayed = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 50,
          },
        }
      );

      setRecentlyPlayed(
        data.items.map((item) => ({
          playedAt: item.played_at,
          id: item.track.id,
          url: item.track.external_urls.spotify,
          img: item.track.album.images[0]?.url,
          name: item.track.name,
          mp3: item.track.preview_url,
          artists: item.track.artists.map((artist) => artist.name),
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const [yourPlaylists, setYourPlaylists] = useState([]);

  const getYourPlaylists = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            limit: 50,
          },
        }
      );

      setYourPlaylists(
        data.items.map((item) => ({
          id: item.id,
          url: item.external_urls.spotify,
          img: item.images[0]?.url,
          name: item.name,
          owner: item.owner.display_name,
          ownerUrl: item.owner.external_urls.spotify,
        }))
      );

      console.log(yourPlaylists);
    } catch (error) {
      console.log(error);
    }
    
  };
  

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(true);
    }, 1 * 30 * 1000); // 4 minutes in milliseconds

    return () => {
      clearInterval(interval);
    };
  }, []);
  
  useEffect(() => {
    getSavedShows();
    getFollowedArtists();
    getSavedAlbums();
    getCurrentObject();
    getSavedEpisodes();
    getSavedSongs();
    getSavedAudiobooks();
    getQueue();
    getRecentlyPlayed();
    getYourPlaylists();
    if(refresh) {
      setRefresh(false);
    }
  }, [refresh]);




  // useEffect(() => {
  //   getCurrentObject();
  // }, [currentObject]);
  // useEffect(() => {
  //   getQueue();
  // }, [queue]);
  // useEffect(() => {
  //   getSavedSongs();
  // }, [savedSongs]);
  // useEffect(() => {
  //   getSavedAlbums();
  // }, [savedAlbums]);
  // useEffect(() => {
  //   getSavedShows();
  // }, [savedShows]);
  // useEffect(() => {
  //   getFollowedArtists();
  // }, [followedArtists]);
  // useEffect(() => {
  //   getSavedEpisodes();
  // }, [savedEpisodes]);
  // useEffect(() => {
  //   getSavedAudiobooks();
  // }, [savedAudiobooks]);
  // useEffect(() => {
  //   getYourPlaylists();
  // }, [yourPlaylists]);
  // useEffect(() => {
  //   getRecentlyPlayed();
  // }, [recentlyPlayed]);


  


  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => {
    setIsHovered(true);
  };

  const handleMouseOut = () => {
    setIsHovered(false);
  };

  // const [arrowSrc, setArrowSrc] = useState(arrowRight);

  // const handleMouseOver = () => {
  //   setArrowSrc(arrowDown);
  // };

  // const handleMouseOut = () => {
  //   setArrowSrc(arrowRight);
  // };


  const handleRefresh = () => {
    setRefresh(true);
  };
  
  
 
  return (
    <div>

      <div className={"moreDataContainer"}>
      <img
        src={fullLogo}
        onClick={() => navigate("/dashboard")}
        style={{
          width: "150px",
          position: "absolute",
          top: "20px",
          left: "30px",
          pointerEvents: "all",
          cursor: "pointer",
        }}
        title="/dashboard"
      />
        <div
          className="titleDiv"
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        >
          <div
            className="gray"
            style={{ marginRight: "20px", fontSize: "11px" }}
            onClick={() =>
              navigate("/data", {
                state: { data: location.state.data, token: token },
              })
            }
            title="Your data"
          >
             <img src={rightArrow} style={{ width: '15px', verticalAlign: 'middle',transform:'rotate(180deg)'}}/> back
          </div>
          {/* <div style={{ cursor: 'pointer', margin: '0', display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={toggleShowInfo}> */}
          <div
            style={{
              cursor: "pointer",
              margin: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            data-tooltip-id="tooltip1"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            className="tooltipArrowHover"
          >
            More data{" "}
            <img
              id="arrow"
              // src={arrowSrc}
              src={arrowRight}
              // className="tooltipArrow"
              className={`tooltipArrow ${isHovered ? "rotateRight" : "rotateBack"}`}

              style={{
              //   marginLeft: "10px",
                  // width: arrowSrc === arrowDown ? "20px" : "10px",
              }}
            />
          </div>
          <img data-tooltip-id="tooltip2" data-tooltip-content={"Refresh now (data auto-refreshes every 30s)"} onClick={handleRefresh} src={refreshIcon} className="spin"style={{pointerEvents:'all',cursor:'pointer',width:'15px',verticalAlign:'middle',marginLeft:'50px'}}/>
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
                  <div className={`primaryImage`}>
                    <img src={show.img} className="primaryImage" />
                  </div>

                  <div className="primaryText">
                    <span className="primaryName">
                      <a className="link2" href={show.url}>
                        {show.name}
                      </a>
                    </span>
                    <span className="primaryArtists">
                      {show.publisher.length > 30
                        ? show.publisher.substring(0, 30) + "..."
                        : show.publisher}
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
            <div className="primaryTitle">saved albums</div>
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
          <div className="primaryTitle" data-tooltip-id="tooltip2" data-tooltip-content={"Your currently playing song or podcast episode"}>now playing</div>

            {/* <div className="primaryTitle" data-tooltip-id="tooltip2" data-tooltip-content={"Your currently playing song or podcast episode"}>currently playing <img src={refreshIcon} style={{cursor:'pointer',width:'15px',verticalAlign:'middle',marginLeft:'10px'}}/></div> */}
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
            ) : (
              //   ))

              <div className="item">
                <div className={`primaryImage`}>
                  <img src={currentObject.img} className="primaryImage" />
                </div>

                <div className="primaryText">
                  <span className="primaryName">
                    <a className="link2" href={currentObject.url}>
                      {currentObject.name.length > 70
                        ? currentObject.name.substring(0, 70) + "..."
                        : currentObject.name}
                    </a>
                  </span>
                  <span className="primaryArtists">
                    {currentObject.podcast.length > 30
                      ? currentObject.podcast.substring(0, 30) + "..."
                      : currentObject.podcast}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 
        mp3: item.episode.audio_preview_url,
        show: item.episode.show.name */}

          <div className="primaryCard1">
            <div className="primaryTitle">saved episodes</div>
            {savedEpisodes.length === 0 ? (
              <div className="noData">No data</div>
            ) : (
              savedEpisodes.map((episode, index) => (
                <div key={index} className="item">
                  <div className={`primaryImage`}>
                    <img src={episode.img} className="primaryImage" />
                  </div>

                  <div className="primaryText">
                    <span className="primaryName">
                      <a className="link2" href={episode.url}>
                        {episode.name}
                      </a>
                    </span>
                    <span className="primaryArtists">{episode.show}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="primaryCard1">
            <div className="primaryTitle">saved songs</div>
            {savedSongs.length === 0 ? (
              <div className="noData">No data</div>
            ) : (
              savedSongs.map((song, index) => (
                <div key={index} className="item">
                  <div
                    className={`primaryImage`}
                    //   onClick={() => togglePlayback(`audio-element${index}`)}
                  >
                    {/* <audio id={`audio-element${index}`} src={song?.mp3}></audio> */}

                    <img src={song?.img} className="primaryImage" />

                    {/* {song?.mp3 && (
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
                      <a className="link2" href={song.url}>
                        {song.name}
                      </a>
                    </span>
                    <span className="primaryArtists">
                      {song.artists?.join(", ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="primaryCard1">
            <div className="primaryTitle">saved audiobooks</div>
            {savedAudiobooks.length === 0 ? (
              <div className="noData">No data</div>
            ) : (
              savedAudiobooks.map((audiobook, index) => (
                <div key={index} className="item">
                  <div className={`primaryImage`}>
                    <img src={audiobook.img} className="primaryImage" />
                  </div>

                  <div className="primaryText">
                    <span className="primaryName">
                      <a className="link2" href={audiobook.url}>
                        {audiobook.name}
                      </a>
                    </span>
                    <span className="primaryArtists">
                      {audiobook.authors?.join(", ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="primaryCard1">
            <div className="primaryTitle">queue</div>
            {queue.length === 0 ? (
              <div className="noData">No data</div>
            ) : (
              queue.map((item, index) => (
                <div key={index} className="item">
                  <div
                    className={`primaryImage`}
                    //   onClick={() => togglePlayback(`audio-element${index}`)}
                  >
                    {/* <audio id={`audio-element${index}`} src={song?.mp3}></audio> */}

                    <img src={item?.img} className="primaryImage" />

                    {/* {song?.mp3 && (
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
                      <a className="link2" href={item.url}>
                        {item.name}
                      </a>
                    </span>
                    <span className="primaryArtists">
                      {item.type === "song"
                        ? item.artists?.join(", ")
                        : item.show}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="primaryCard1">
            <div className="primaryTitle">recently played songs</div>
            {recentlyPlayed.length === 0 ? (
              <div className="noData">No data</div>
            ) : (
              recentlyPlayed.map((item, index) => (
                <div key={index} className="item">
                  <div
                    className={`primaryImage`}
                    //   onClick={() => togglePlayback(`audio-element${index}`)}
                  >
                    {/* <audio id={`audio-element${index}`} src={song?.mp3}></audio> */}

                    <img src={item?.img} className="primaryImage" />

                    {/* {item?.mp3 && (
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
                      <a className="link2" href={item.url}>
                        {item.name}
                      </a>
                    </span>
                    <span className="primaryArtists">
                      {item.artists?.join(", ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 
          ownerUrl: item.owner.external_urls.spotify, */}

          <div className="primaryCard1">
            <div className="primaryTitle">your playlists</div>
            {yourPlaylists.length === 0 ? (
              <div className="noData">No data</div>
            ) : (
              yourPlaylists.map((playlist, index) => (
                <div key={index} className="item">
                  <div
                    className={`primaryImage`}
                    //   onClick={() => togglePlayback(`audio-element${index}`)}
                  >
                    {/* <audio id={`audio-element${index}`} src={song?.mp3}></audio> */}

                    <img src={playlist?.img} className="primaryImage" />

                    {/* {playlist?.mp3 && (
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
                      <a className="link2" href={playlist.url}>
                        {playlist.name !== " " ? playlist.name : "untitled"}
                      </a>
                    </span>
                    <span className="primaryArtists">
                      <a className="link2" href={playlist.ownerUrl}>
                        {playlist.owner}
                      </a>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />


      <Tooltip id="tooltip1" className="tooltip3" noArrow>
        Your comparify code is meant to only include information that provides a
        pure indication of your listening habits.
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


      <Tooltip id="tooltip2" className="tooltip3" noArrow  clickable={"true"}/>

    </div>
  );
};

export default MoreData;
