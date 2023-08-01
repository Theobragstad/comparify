import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./App.css";

function AudiofeatureModal(props) {
  const audiofeatureModalStyles = {
    overlay: {
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    content: {
      zIndex: 9999,
      // width: "21%",
      height: "fit-content",
      borderRadius: "25px",

      outline: "0",
    },
  };

  const [rankedSongs, setRankedSongs] = useState([]);
  const getAudioFeatureValues = async () => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/audio-features",
        {
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
          params: {
            ids: props.songs.map((song) => song.id).join(","),
          },
        }
      );

      console.log(data);

      const audiofeatureValues = data.audio_features.map((item) => ({
        id: item.id,
        [props.audiofeatureForModal]: item[props.audiofeatureForModal],
      }));

      audiofeatureValues.sort(
        (a, b) => b[props.audiofeatureForModal] - a[props.audiofeatureForModal]
      );
      console.log(audiofeatureValues);

      const rankedSongs = audiofeatureValues.map((item) => {
        const song = props.songs.find((song) => song.id === item.id);
        return {
          ...song,
          audioValue:
            props.audiofeatureForModal === "duration_ms"
              ? msToMinSec(item[props.audiofeatureForModal])
              : item[props.audiofeatureForModal], // New field for audio value
        };
      });

      console.log(rankedSongs);

      setRankedSongs(rankedSongs);
    } catch (error) {
      setRankedSongs([]);
    }
  };

  useEffect(() => {
    getAudioFeatureValues();
  }, [props.audiofeatureForModal]);

  //   useEffect(() => {
  //     window.scrollTo({
  //         top: document.documentElement.scrollHeight,
  //         behavior: "instant",
  //       });
  //   }, [props.isAudiofeatureModalOpen]);

  function msToMinSec(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  useEffect(() => {
    window.scrollTo({
      top: props.location,
      behavior: "instant",
    });
  }, [props.isAudiofeatureModalOpen]);

  const [isPlaying, setIsPlaying] = useState({});

  const togglePlayback = (id) => {
    const thisElement = document.getElementById(id);
    const audioElements = document.querySelectorAll("audio");
    const updatedIsPlaying = { ...isPlaying };

    audioElements.forEach((audioElement, i) => {
      if (audioElement !== thisElement) {
        audioElement.pause();
        updatedIsPlaying[audioElement.id] = false;
      } else {
        if (audioElement.paused) {
          audioElements.forEach((el, j) => {
            if (el !== thisElement) {
              el.pause();
              updatedIsPlaying[el.id] = false;
            }
          });

          updatedIsPlaying[id] = true;
          audioElement.play().catch((error) => {
            console.log(error);
          });
        } else {
          audioElement.pause();
          updatedIsPlaying[id] = false;
        }
      }
    });

    setIsPlaying(updatedIsPlaying);
  };


  const [showLoading, setShowLoading] = useState(true); // State to manage loading display
  const [displayedSongs, setDisplayedSongs] = useState([]); // State to store displayed songs


  const timeoutRef = useRef(null); // Ref to keep track of the current timeout

  useEffect(() => {
    if (rankedSongs.length > 0) {
      setShowLoading(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear the previous timeout if it exists
      }

      const timeout = setTimeout(() => {
        setShowLoading(false);
        setDisplayedSongs([]); // Reset displayed songs before showing the new ones

        // Display each song with a delay between each
        rankedSongs.forEach((song, index) => {
          timeoutRef.current = setTimeout(() => {
            setDisplayedSongs((prevSongs) => [...prevSongs, song]);
          }, (index + 1) * 40); // Adjust the delay (in milliseconds) between each song appearance
        });
      }, 2000); // Show loading div for 2 seconds before showing the first song

      return () => clearTimeout(timeout); // Clear the timeout on component unmount
    }
  }, [rankedSongs]);
  // useEffect(() => {
  //   if (rankedSongs.length > 0) {
  //     // Show the loading div for 2 seconds before showing the first song
  //     setShowLoading(true);
  //     const timeout = setTimeout(() => {
  //       setShowLoading(false);
  //       // Display each song with a delay between each
  //       rankedSongs.forEach((song, index) => {
  //         setTimeout(() => {
  //           setDisplayedSongs((prevSongs) => [...prevSongs, song]);
  //         }, (index + 1) * 40); // Adjust the delay (in milliseconds) between each song appearance
  //       });
  //     }, 1000);

  //     return () => clearTimeout(timeout); // Clear the timeout on component unmount
  //   }
  // }, [rankedSongs]);

  

  return (
    <div>
      <Modal
        isOpen={props.isAudiofeatureModalOpen}
        onRequestClose={props.closeAudiofeatureModal}
        contentLabel="Popup Window"
        style={audiofeatureModalStyles}
        className="audiofeatureModal"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div
            className="primaryCard1"
            style={{
              margin: "auto",
              backgroundColor: "white",
              width: "500px",
              height: "500px",
            }}
          >
            <div className="primaryTitle">
              top songs ranked by{" "}
              {props.audiofeatureForModal === "duration_ms"
                ? <span className="feature">duration</span>
                : <span className="feature">{props.audiofeatureForModal}</span>}
            </div>

            {showLoading ? (
              // <div className="noData">Loading...</div>
              Array.from(
                { length: rankedSongs.length },
                (_, index) => index
              ).map((index) => (
                <div key={index} className="item">
                  <div
                    className={`primaryImage`}
                    onClick={() =>
                      togglePlayback(`audio-element-modal${index}`)
                    }
                  >
                    <div className="pImgLoading"></div>
                  </div>

                  <div
                    className="primaryText"
                    style={{ marginRight: "30px" }}
                  >
                    <span className="primaryName">
                      <span className="l2Loading">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </span>
                    <span className="pALoading"></span>

                    <span className="cOSLoading"></span>
                  </div>
                </div>
              ))
            ) : rankedSongs.length === 0 ? (
              <div className="noData">No data</div>
            ) : (
              displayedSongs.map((song, index) => (
                <div key={index} className="item">
                  <div
                    className={`primaryImage`}
                    onClick={() =>
                      togglePlayback(`audio-element-modal${index}`)
                    }
                  >
                    <audio
                      id={`audio-element-modal${index}`}
                      src={song?.mp3}
                    ></audio>

                    <img
                      src={song?.img}
                      className="primaryImage"
                      alt="Cover art"
                    />

                    {song?.mp3 && (
                      <div
                        className={
                          isPlaying[`audio-element-modal${index}`]
                            ? "paused"
                            : "playing"
                        }
                      ></div>
                    )}
                  </div>

                  <div
                    className="primaryText"
                    style={{ marginRight: "30px" }}
                  >
                    <span className="primaryName">
                      <a className="link2" href={song.url}>
                        {song.name}
                      </a>
                    </span>
                    <span className="primaryArtists">
                      {song.artists?.join(", ")}
                    </span>

                    <span className="cellOutlineSmall">
                      {song.audioValue}
                    </span>
                  </div>
                </div>))
            )}
            {/* {rankedSongs.length === 0
              ? // <div className="noData">No data</div>

                Array.from(
                  { length: rankedSongs.length },
                  (_, index) => index
                ).map((index) => (
                  <div key={index} className="item">
                    <div
                      className={`primaryImage`}
                      onClick={() =>
                        togglePlayback(`audio-element-modal${index}`)
                      }
                    >
                      <div className="pImgLoading"></div>
                    </div>

                    <div
                      className="primaryText"
                      style={{ marginRight: "30px" }}
                    >
                      <span className="primaryName">
                        <span className="l2Loading">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                      </span>
                      <span className="pALoading"></span>

                      <span className="cOSLoading"></span>
                    </div>
                  </div>
                ))
              : rankedSongs.map((song, index) => (
                  <div key={index} className="item">
                    <div
                      className={`primaryImage`}
                      onClick={() =>
                        togglePlayback(`audio-element-modal${index}`)
                      }
                    >
                      <audio
                        id={`audio-element-modal${index}`}
                        src={song?.mp3}
                      ></audio>

                      <img
                        src={song?.img}
                        className="primaryImage"
                        alt="Cover art"
                      />

                      {song?.mp3 && (
                        <div
                          className={
                            isPlaying[`audio-element-modal${index}`]
                              ? "paused"
                              : "playing"
                          }
                        ></div>
                      )}
                    </div>

                    <div
                      className="primaryText"
                      style={{ marginRight: "30px" }}
                    >
                      <span className="primaryName">
                        <a className="link2" href={song.url}>
                          {song.name}
                        </a>
                      </span>
                      <span className="primaryArtists">
                        {song.artists?.join(", ")}
                      </span>

                      <span className="cellOutlineSmall">
                        {song.audioValue}
                      </span>
                    </div>
                  </div>
                ))} */}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AudiofeatureModal;
