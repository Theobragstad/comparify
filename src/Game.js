import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

import grayX from "./img/grayX.png";
import x from "./img/x.png";
import { useGameModalState } from "./GameModalState";
import replay from "./img/replay.png";
import playBtn from "./img/play.png";

import "./Game.css";
import Footer from "./Footer";

const Game = (props) => {
  const gameModalState = useGameModalState();

  const navigate = useNavigate();
  const [selectionCorrect, setSelectionCorrect] = useState(false);

  const [startClicked, setStartClicked] = useState(false);
  const [startCountdown, setStartCountdown] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [endGame, setEndGame] = useState(false);
  const [score, setScore] = useState(0);

  const [counter, setCounter] = useState(3);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(7); // Track remaining time

  const [restart, setRestart] = useState(false);






  const [isAudioReady, setIsAudioReady] = useState(false);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  // const handleStartGame = () => {
  //   setStartClicked(true);
  //   setIsAudioReady(true);
  // };

  const handleStartGame = () => {
    setStartClicked(true);
    setIsAudioReady(true);
  
    // Play audio on touchstart event
    const playOnTouchStart = () => {
      if (audioRef.current) {
        audioRef.current.play();
      }
      // Remove the event listener to prevent multiple playbacks
      document.removeEventListener("touchstart", playOnTouchStart);
    };
  
    // Add event listener for touchstart and click events
    document.addEventListener("touchstart", playOnTouchStart);
    document.addEventListener("click", playOnTouchStart);
  };
  



  const playAgain = () => {
    setRestart(true);
    setStartClicked(false);
    setStartCountdown(false);
    setStartGame(false);
    setEndGame(false);
    setScore(0);
    setCounter(3);
    setCurrentSongIndex(0);
    setRemainingTime(7);
  };

  useEffect(() => {
    if (startClicked) {
      setRestart(false);

      setTimeout(() => {
        setStartCountdown(true);
      }, 1000);
    }
  }, [startClicked]);

  useEffect(() => {
    if (startCountdown) {
      const countdownInterval = setInterval(() => {
        setCounter((prevCounter) => {
          const updatedCounter = prevCounter - 1;
          if (updatedCounter === 0) {
            clearInterval(countdownInterval);
            setStartGame(true);
          }
          return updatedCounter;
        });
      }, 1000);

      setTimeout(() => {
        setStartCountdown(false);
      }, 3000);
    }
  }, [startCountdown]);

  useEffect(() => {
    let countdownInterval;

    if (startGame) {
      countdownInterval = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [startGame]);

  const location = useLocation();
  // const sharedSongs = location.state.sharedSongs || [];
  // const user1Songs = location.state.user1TopSongs || [];
  // const user2Songs = location.state.user2TopSongs || [];

  const sharedSongs = props.sharedSongs || [];
  const user1Songs = props.user1TopSongs || [];
  const user2Songs = props.user2TopSongs || [];

  const [randomSelections, setRandomSelections] = useState([]);
  const [sourceArrays, setSourceArrays] = useState([]);

  useEffect(() => {
    const chooseRandomSongs = (array, numSongs) =>
      array.sort(() => Math.random() - 0.5).slice(0, numSongs);

    const randomSharedSongs = chooseRandomSongs(sharedSongs, 20);
    const randomUser1Songs = chooseRandomSongs(user1Songs, 20);
    const randomUser2Songs = chooseRandomSongs(user2Songs, 20);

    const combinedSongs = [
      ...randomSharedSongs,
      ...randomUser1Songs,
      ...randomUser2Songs,
    ];

    const chooseRandomWithSource = (array, numSongs) => {
      const randomSelections = [];
      const sourceArrays = [];

      const validSongs = array.filter((song) => song !== null);

      const combinedLength = Math.min(numSongs, validSongs.length);

      for (let i = 0; i < combinedLength; i++) {
        const randomIndex = Math.floor(Math.random() * validSongs.length);
        const randomSong = validSongs[randomIndex];

        randomSelections.push(randomSong);

        if (randomSharedSongs.includes(randomSong)) {
          sourceArrays.push("sharedSongs");
        } else if (randomUser1Songs.includes(randomSong)) {
          sourceArrays.push("user1Songs");
        } else if (randomUser2Songs.includes(randomSong)) {
          sourceArrays.push("user2Songs");
        }

        validSongs.splice(randomIndex, 1);
      }

      return { randomSelections, sourceArrays };
    };

    const { randomSelections, sourceArrays } = chooseRandomWithSource(
      combinedSongs,
      20
    );

    setRandomSelections(randomSelections);
    setSourceArrays(sourceArrays);
  }, [restart]);

  const audioRef = useRef(null);

  // useEffect(() => {
  //   const audioElement = audioRef.current;

  //   console.log(audioElement);
  //   if (audioElement && randomSelections.length > 0 && startGame) {
  //     const handleCanPlay = () => {
  //       audioElement.play();
  //     };

  //     audioElement.addEventListener("canplay", handleCanPlay);

  //     return () => {
  //       audioElement.removeEventListener("canplay", handleCanPlay);
  //     };
  //   }
  // }, [randomSelections, currentSongIndex, startGame, restart]);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleCanPlay = () => {
      if (startClicked) {
        audioElement.play();
      }
    };

    if (audioElement && randomSelections.length > 0 && startGame) {
      audioElement.addEventListener("canplay", handleCanPlay);

      return () => {
        audioElement.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, [randomSelections, currentSongIndex, startGame, restart, startClicked]);

  function makeSelection(selection) {
    const currentSource = sourceArrays[currentSongIndex];
    if (currentSource === "user1Songs" && selection === 1) {
      setScore((prevScore) => prevScore + 1);
      setSelectionCorrect(true);
    } else if (currentSource === "sharedSongs" && selection === 3) {
      setScore((prevScore) => prevScore + 1);
      setSelectionCorrect(true);
    } else if (currentSource === "user2Songs" && selection === 2) {
      setScore((prevScore) => prevScore + 1);
      setSelectionCorrect(true);
    } else {
      setSelectionCorrect(false);
    }

    if (currentSongIndex + 1 >= randomSelections.length) {
      setEndGame(true);
    } else {
      setCurrentSongIndex((prevIndex) => prevIndex + 1);
      setRemainingTime(7); // Reset remaining time
    }
  }

  useEffect(() => {
    if (remainingTime === 0) {
      makeSelection(-1); // No selection made, move to the next song
    }
  }, [remainingTime]);

  const handleMouseOver = () => {
    const imageElement = document.getElementById("exitBtn");
    imageElement.src = x; // Set the source of the image to the black version
  };

  const handleMouseOut = () => {
    const imageElement = document.getElementById("exitBtn");
    imageElement.src = grayX; // Set the source of the image back to the gray version
  };


  
  return (
    <div>
      <div className="gamePage">
        <div className="gameDiv">
          {/* <div className="exitBtnDiv"> */}
          <button
            className="exitBtn"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={props.closeGameModal}
          >
            <img src={grayX} style={{ width: "10px" }} id="exitBtn"></img>
          </button>
          {/* </div> */}
          {endGame ? (
            <div className="scoreDiv">
              <h3>Score:</h3>
              <span className="gradient" style={{ fontSize: "25px" }}>
                {score}
              </span>{" "}
              <span style={{ color: "gray", fontSize: "12px" }}>
                / {randomSelections?.length}
              </span>
              <div>
                <button className="replayBtn gradient" onClick={playAgain}>
                  <img src={replay} style={{ width: "20px" }} />
                </button>
              </div>
            </div>
          ) : startGame && !endGame ? (
            <div>
              <div className="songsRemainingContainer">
                <span className="songsRemaining">
                  <span className="gradient" style={{ fontSize: "25px" }}>
                    {currentSongIndex + 1}
                  </span>{" "}
                  <span style={{ color: "gray" }}>
                    / {randomSelections?.length}
                  </span>
                </span>
              </div>
              {randomSelections.length > 0 && isAudioReady && (
                <audio
                  ref={audioRef}
                  src={randomSelections[currentSongIndex]?.mp3}
                  autoPlay="autoplay" playsInLine="playsinline" 
                ></audio>
              )}

              <div className="songImageDiv">
                <img
                  className="songImage"
                  src={randomSelections[currentSongIndex]?.img}
                />
              </div>
              <div className="songName">
                {randomSelections[currentSongIndex]?.name}
              </div>
              <div className="songArtists">
                {randomSelections[currentSongIndex]?.artists?.join(", ")}
              </div>

              {/* line here */}
              <div className="countdownLineContainer">
                <div
                  className={
                    remainingTime === 0
                      ? "countdownLine refill"
                      : "countdownLine"
                  }
                  style={{ width: `${((remainingTime - 1) / 6) * 100}%` }}
                ></div>
              </div>

              <div className="buttonContainer">
                <div className="buttonUser1" onClick={() => makeSelection(1)}>
                  {props.name1}
                </div>
                <div className="buttonShared" onClick={() => makeSelection(3)}>
                  shared
                </div>
                <div className="buttonUser2" onClick={() => makeSelection(2)}>
                  {props.name2}
                </div>
              </div>
            </div>
          ) : startCountdown && !endGame ? (
            <div className="counter gradient">{counter}</div>
          ) : (
            !endGame &&
            !startGame && (
              <div
                className={`gameInstructionsDiv ${
                  startClicked ? "clicked" : ""
                }`}
              >
                <div className="gameRulesDiv">
                  <h3>See how well you know your music tastes!</h3>

                  <div className="gameRules">
                    You'll be presented one song at a time. (Turn your volume
                    up!)
                    <br />
                    <br />
                    You have seven seconds to decide if the song is exclusively
                    one of <span className="user1">{props.name1}</span>'s top
                    songs, one that's <span className="shared">shared</span>, or
                    if it is exclusively{" "}
                    <span className="user2">{props.name2}</span>'s.
                    <br />
                    <br />
                    Choose the button corresponding to your choice before the
                    time runs out.
                  </div>
                </div>
                <button
                  // onClick={() => setStartClicked(true)}
                  onClick={() => handleStartGame()}
                  className="startGameBtn"
                  title="Start game"
                >
                  <img src={playBtn} style={{ width: "20px" }} />
                </button>
              </div>
            )
          )}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Game;
