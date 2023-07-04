import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";

import grayX from "./img/grayX.png";
import x from "./img/x.png";
import { useGameModalState } from "./GameModalState";
import replay from "./img/replay.png";
import correctCheck from "./img/check.png";
import muted from "./img/muted.png";
import download from "./img/download.png";

import incorrectX from "./img/redX.png";

import playBtn from "./img/play.png";
import finishSound from "./finished.mp3"
import correct from "./correct.mp3"
import incorrect from "./incorrect.mp3"

import "./Game.css";
import Footer from "./Footer";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";







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
  const [remainingTime, setRemainingTime] = useState(4); 

  const [restart, setRestart] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);

  const [feedbackTimer, setFeedbackTimer] = useState(null);

  const [randomSelections, setRandomSelections] = useState([]);
  const [sourceArrays, setSourceArrays] = useState([]);

  const [time, setTime] = useState(null)
  



  const playAgain = () => {
    setRestart(true);
    setSelectionCorrect(false);
    setStartClicked(false);
    setStartCountdown(false);
    setStartGame(false);
    setEndGame(false);
    setScore(0);
    setCounter(3);
    setCurrentSongIndex(0);
    setRemainingTime(4);



setShowFeedback(false)
setFeedbackTimer(null)
setRandomSelections([])
setSourceArrays([])
  };


  const saveScore = () => {
    setTime(new Date());
    const div = document.getElementById("scoreDiv");
    div.removeAttribute("hidden");
  
    const visibleScoreDiv = document.getElementById("visibleScore");
    visibleScoreDiv.setAttribute("hidden", true);
  
    if (div) {
      html2canvas(div, {}).then((canvas) => {
        const imageHeight = canvas.height;
        const croppedHeight = imageHeight - 355; // Adjust the value to specify how much to cut off from the bottom
  
        // Create a new canvas with the same width as the original canvas but with the cropped height
        const newCanvas = document.createElement("canvas");
        newCanvas.width = canvas.width;
        newCanvas.height = croppedHeight;
  
        // Get the rendering context of the new canvas
        const context = newCanvas.getContext("2d");
  
        // Draw the cropped portion of the original canvas onto the new canvas
        context.drawImage(
          canvas,
          0,
          0,
          canvas.width,
          croppedHeight,
          0,
          0,
          canvas.width,
          croppedHeight
        );
  
        // Convert the new canvas to a data URL
        const image = newCanvas.toDataURL("image/png");
        console.log(image, "image");
  
        var fileName =
          "comparify game score for " +
          props.name1.replace(/\./g, "") +
          " (with " +
          props.name1.replace(/\./g, "") +
          ").png";
        downloadPNG(image, fileName);
      });
    }
  
    div.setAttribute("hidden", true);
    visibleScoreDiv.removeAttribute("hidden");
  };
  

  function downloadPNG(url, filename) {
    var anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = filename;
    anchorElement.click();
  }

 
 

  const handleStartGame = () => {
    setStartClicked(true);
   





  };





// useEffect(()=> {
 
  
//   if(counter === 0 && currentSongIndex === 0) {
//     document.getElementById("audio1").play();
//   }else {
//     document.getElementById("audio1").pause();
//   }

// }, [counter, currentSongIndex])

 
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

    console.log(randomSelections)
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
    // console.log(audioElement);

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
    setShowFeedback(true);

   
    
    if (feedbackTimer) {
      clearTimeout(feedbackTimer);
    }


   


    const currentSource = sourceArrays[currentSongIndex];


    let selectionCorrect = false;

    
  if (currentSource === "user1Songs" && selection === 1) {
    setScore((prevScore) => prevScore + 1);
    selectionCorrect = true;
  } else if (currentSource === "sharedSongs" && selection === 3) {
    setScore((prevScore) => prevScore + 1);
    selectionCorrect = true;
  } else if (currentSource === "user2Songs" && selection === 2) {
    setScore((prevScore) => prevScore + 1);
    selectionCorrect = true;
  }


  setSelectionCorrect(selectionCorrect)
    if (currentSongIndex + 1 >= randomSelections.length) {
      setEndGame(true);

    } else {
      setCurrentSongIndex((prevIndex) => prevIndex + 1);
      setRemainingTime(4); // Reset remaining time


    }

   

    const newFeedbackTimer = setTimeout(() => {
      setShowFeedback(false);
      setFeedbackTimer(null);
    }, 3000);
    setFeedbackTimer(newFeedbackTimer);
    
  }



  



  useEffect(() => {
    // Clear the feedback timer when the component unmounts or the current song changes
    return () => {
      if (feedbackTimer) {
        clearTimeout(feedbackTimer);
      }
    };
  }, [feedbackTimer]);
  

  // useEffect(() => {
  //   if(endGame) {
  //   document.getElementById("finishSound").play();
  //   }

  // }, [endGame]);

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
      {/* <audio
                 id="finishSound"
                  src={finishSound}
                ></audio> */}


                {/* <audio
                 id="correct"
                  src={correct}
                ></audio>
                <audio
                 id="incorrect"
                  src={incorrect}
                ></audio> */}
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
            <>
            {/* <div className="finished gradient">game over</div> */}
            <div className="scoreDiv" id="visibleScore">

              <span className="gradient" style={{ fontSize: "40px" }}>
                {score}
              </span>{" "}
              <span style={{ color: "gray", fontSize: "16px" }}>
                / {randomSelections?.length}
              </span>
              <div style={{ color: "DimGray", fontSize: "20px" ,paddingTop:'10px'}}>{((score/randomSelections?.length)*100).toFixed(1)}%</div>
              <div className="replayBtnContainer">
                <button className="replayBtn gradient" onClick={playAgain}>
                  <img src={replay} style={{ width: "20px" }} />
                </button>
              </div>
              <div className="saveScoreBtnContainer">
                <button className="saveScoreBtn" onClick={saveScore}>
                  <img src={download} style={{ width: "15px" }} />
                </button>
              </div>
            </div>









            <div id="scoreDiv" hidden style={{width:'200px', height:'500px'}}>

            <span className="scoreDivTitle"> comparify game score<br/><br/><span style={{color:'#1e90ff'}}>{props.name1}</span><br/><span style={{fontSize:'10px', color:'gray'}}>{"("}with{" "}<span style={{color:'#ffdf00'}}>{props.name2}</span>{")"}</span></span>

            <div className="scoreDiv1" >
             

              <span className="" style={{ fontSize: "40px" }}>
                {score}
              </span>{" "}
              <span style={{ color: "gray", fontSize: "16px" }}>
                / {randomSelections?.length}
              </span>
              <div style={{ color: "DimGray", fontSize: "20px" ,paddingTop:'10px'}}>{((score/randomSelections?.length)*100).toFixed(1)}%</div>
             
             
            </div>

            <div className="timeDiv">{(new Date()).toLocaleString()}</div>
            </div>
            </>
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
              {showFeedback && 
              <div>
                
              <div className={selectionCorrect ? "feedback correct" : (currentSongIndex !== 0) ? "feedback incorrect" : ""}>
              {selectionCorrect ? (<img src={correctCheck}/>) : (currentSongIndex !== 0) ? (<img src={incorrectX}/>) : ("") 
                
              }
                  </div>

                
              </div>}

              {randomSelections[currentSongIndex]?.mp3 === null && (
              <div className="audioUnavailable"><img src={muted} style={{width:'20px'}}/>{" "}Audio unavailable</div>)}


              {randomSelections[currentSongIndex]?.mp3 !== null && randomSelections.length > 0 &&
                <audio
                  ref={audioRef}
                  src={randomSelections[currentSongIndex]?.mp3}
                  autoPlay="autoPlay" playsInline="playsInline" 
                ></audio>
              }
              

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
                  <h3>see how well you know your music tastes!</h3>

                  <div className="gameRules">
                    you'll be presented one song at a time (turn your volume
                    up!)
                    <br />
                    <br />
                    you have seven seconds to decide if the song is exclusively
                    one of <span className="user1">{props.name1}</span>'s top
                    songs, one that's <span className="shared">shared</span>, or
                    if it is exclusively{" "}
                    <span className="user2">{props.name2}</span>'s.
                    <br />
                    <br />
                    select the button corresponding to your choice before the
                    time runs out.
                  </div>
                </div>
                <button
                  // onClick={() => setStartClicked(true)}
                  onClick={() => handleStartGame()}
                  className="startGameBtn"
                  title="Start game"
                >
                  <img src={playBtn} id="playBtn"style={{ width: "20px" }} />
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
