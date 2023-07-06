import React, { useState, useEffect } from "react";
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
      //   maxWidth: "30%",
    width: "21%",
      height: "fit-content",
      //   margin: "auto",
      borderRadius: "25px",
      //   outline: "none",
      //   padding: "20px",
// margin: '0 auto',
// padding:'10px',
      //   maxHeight: "90vh",
      //   overflowY: "scroll",
    //   backgroundColor: "white",
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
          audioValue: item[props.audiofeatureForModal], // New field for audio value
        };
      });

      console.log(rankedSongs)

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


  return (
    <div>
      <Modal
        isOpen={props.isAudiofeatureModalOpen}
        onRequestClose={props.closeAudiofeatureModal}
        contentLabel="Popup Window"
        style={audiofeatureModalStyles}
        className="audiofeatureModal"
      >
<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%'}}>

        <div className="primaryCard1" style={{ margin: 'auto', backgroundColor: "white" }}>

          <div className="primaryTitle">top songs ranked by {props.audiofeatureForModal}</div>
          {rankedSongs.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            rankedSongs.map((song, index) => (
              <div key={index} className="item">
                <div
                  className={`primaryImage`}
                  onClick={() => togglePlayback(`audio-element-modal${index}`)}
                >
                  <audio id={`audio-element-modal${index}`} src={song?.mp3}></audio>

                  <img src={song?.img} className="primaryImage" />

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

                <div className="primaryText">
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
            ))
          )}
        </div>
        </div>
      </Modal>
    </div>
  );
}

export default AudiofeatureModal;
