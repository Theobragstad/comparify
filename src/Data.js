import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router";
import { PieChart, Pie, Cell, Legend } from "recharts";

import logo from "./img/logo.png";
import popoutIcon from "./img/popoutIcon.png";
import x from "./img/x.png";
import missingImage from "./img/missingImage.png";
import "./App.css";
import back from "./img/back.png";
import gptBtn from "./img/gptBtn.png";
import html2canvas from "html2canvas";
import Footer from "./Footer";
import ScrollButton from "./ScrollButton"
import AudiofeatureModal from "./AudiofeatureModal";
import { Tooltip } from "react-tooltip";
import download from "./img/download.png";
import Modal from "react-modal";
import DataPageRecommendations from "./DataPageRecommendations";
import range from "./img/range.png";
import rightArrow from "./img/rightArrow.png";
import arrowRight from "./img/sideArrowRight.png";
import arrowDown from "./img/downBtn.png";
import spotifysmall from "./img/spotifysmall.png";
import greenArrow from "./img/greenArrow.png";
import fullLogo from "./img/fullLogo.png";
const { Configuration, OpenAIApi } = require("openai");

function Data() {

  const location = useLocation();
  const navigate = useNavigate();


  const [apiResponse, setApiResponse] = useState("");

  const [gptLoading, setGptLoading] = useState(false);
const [isOpen, setIsOpen] = useState(false);
 const [selectedButton, setSelectedButton] = useState(1);
  const [selectedTimeRange, setSelectedTimeRange] = useState("short_term");
  const timeRanges = ["short_term", "medium_term", "long_term"];

  const [selectedTimeRangeClean, setSelectedTimeRangeClean] =
    useState("last month");
  const timeRangesClean = ["last month", "last 6 months", "all time"];

  const [isTimeRangeLoading, setIsTimeRangeLoading] = useState(true);
const [topSongs, setTopSongs] = useState([]);
  const [highestAudioFeatureSongs, setHighestAudioFeatureSongs] = useState([]);
  const [lowestAudioFeatureSongs, setLowestAudioFeatureSongs] = useState([]);
  const [mostLeastPopSongs, setMostLeastPopSongs] = useState([]);
  const [oldestNewestSongs, setOldestNewestSongs] = useState([]);
  const [topAlbums, setTopAlbums] = useState([]);
  const [mostLeastPopAlbums, setMostLeastPopAlbums] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [mostLeastPopArtists, setMostLeastPopArtists] = useState([]);

  const [highestAudioFeatureValues, setHighestAudioFeatureValues] = useState(
    []
  );
  const [lowestAudioFeatureValues, setLowestAudioFeatureValues] = useState([]);
const [saveGptClicked, setSaveGptClicked] = useState(false);
const [expirationTime, setExpirationTime] = useState("");

const [recModalIsOpen, setRecModalIsOpen] = useState(false);
const [isPlaying, setIsPlaying] = useState({});
const [audiofeatureForModal, setAudiofeatureForModal] = useState(null);
  const [isAudiofeatureModalOpen, setIsAudiofeatureModalOpen] = useState(null);

  const [scrollPosition, setScrollPosition] = useState(null);
const [showDropdownMenu, setShowDropdownMenu] = useState(false);

const [songReleaseDecadeDistrHover, setSongReleaseDecadeDistrHover] = useState(false);
  

const handleTapPie = () => {
  setSongReleaseDecadeDistrHover(!songReleaseDecadeDistrHover); // Toggle the value of isHovered
};


useEffect(() => {
  resetAllAudio();
  setIsTimeRangeLoading(true);

  if (isTokenExpired()) {
    logout();
  }

  // setTimeout(() => {
  getTopSongs(arrays.songIds);
  getHighestAudioFeatureSongs(arrays.highestAudioFeatureSongIds);
  getAudioFeatureValues(
    arrays.highestAudioFeatureSongIds,
    setHighestAudioFeatureValues
  );

  getLowestAudioFeatureSongs(arrays.lowestAudioFeatureSongIds);
  getAudioFeatureValues(
    arrays.lowestAudioFeatureSongIds,
    setLowestAudioFeatureValues
  );

  getMostLeastPopSongs(arrays.mostLeastPopSongIds);
  getOldestNewestSongs(arrays.oldestNewestSongIds);
  getTopAlbums(arrays.albumIds);
  getMostLeastPopAlbums(arrays.mostLeastPopAlbumIds);
  getTopArtists(arrays.artistIds);
  getMostLeastPopArtists(arrays.mostLeastPopArtistIds);
  setIsTimeRangeLoading(false);
  // }, 1000);
}, [selectedTimeRange]);



useEffect(() => {
  const audioElements = document.querySelectorAll("audio");
  const updatedIsPlaying = Array.from(isPlaying);

  const handleAudioEnded = (index) => {
    updatedIsPlaying[index] = false;
    setIsPlaying(updatedIsPlaying);
  };

  audioElements.forEach((audioElement, i) => {
    audioElement.addEventListener("ended", () => handleAudioEnded(i));
  });

  return () => {
    audioElements.forEach((audioElement, i) => {
      audioElement.removeEventListener("ended", () => handleAudioEnded(i));
    });
  };
}, [isPlaying]);


useEffect(() => {
  setScrollPosition(document.documentElement.scrollTop);
  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);


if (!location?.state) {
  navigate("/")
  return;
 }


  const token = location.state?.token;

  const allData = location.state?.data?.split(",");



 




   





  document.title = "comparify | Your data";



  

  const handleMouseOver = () => {
    document.getElementById("arrow").setAttribute("src", arrowDown);
    document.getElementById("arrow").style.width = "20px";
  };

  const handleMouseOut = () => {
    document.getElementById("arrow").setAttribute("src", arrowRight);
    document.getElementById("arrow").style.width = "10px";
  };

  Modal.setAppElement("#root");

  const configuration = new Configuration({
    organization: "org-K3YIyvzJixL8ZKFVjQJCKBMP",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  delete configuration.baseOptions.headers["User-Agent"];

  const openai = new OpenAIApi(configuration);
 

  const handleGptSumbit = async () => {
    setGptLoading(true);
    setApiResponse("");
    let gptPrompt = gatherGptPromptData();

    if (!gptPrompt) {
      gptPrompt =
        "Display the following statement (without quotes around it): Prompt error. Try again.";
    }
    console.log(gptPrompt);

    try {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: gptPrompt,
        temperature: 1.2,
        max_tokens: 250,
      });
      console.log("response", result.data.choices[0].text);
      setApiResponse(result.data.choices[0].text);
    } catch (error) {
      console.log(error);
      setApiResponse(
        "ChatGPT error. This is likely a rate limit. Try again in a minute or so."
      );
      setGptLoading(false);
    }
    setGptLoading(false);
  };
  function handleConvertToImage() {
    setSaveGptClicked(true);

    setTimeout(() => {
      const div = document.getElementById("imgDiv");
      if (div) {
        html2canvas(div, {}).then((canvas) => {
          const image = canvas.toDataURL("image/png");

          var fileName =
            `comparify x ChatGPT for ` + nameIdImgurlGenerationdate[0] + ".png";
          downloadPNG(image, fileName);
        });
      }
    }, 0);
  }

  function downloadPNG(url, filename) {
    var anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = filename;

    anchorElement.click();
    setSaveGptClicked(false);
  }

  

  const openModal = async () => {
    setIsOpen(true);
    await handleGptSumbit();
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const customStyles = {
    overlay: {
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      zIndex: 9999,
      width: "30%",
      height: "80%",
      margin: "auto",
      borderRadius: "10px",
      outline: "none",
      padding: "0px 0px 10px 0px",
      border: "none",

      // maxHeight: "75%",
      overflowY: "scroll",
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  };

  const mediaQueryStyles = `@media (max-width: 1000px) {
    .recommendationModal {
      width: 90% !important;
    }
  }`;

  const customRecModalStyles = {
    overlay: {
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      zIndex: 9999,
      maxWidth: "30%",
      width: "30%",
      height: "fit-content",
      margin: "auto",
      borderRadius: "10px",
      outline: "none",
      padding: "20px",

      maxHeight: "90vh",
      overflowY: "scroll",
      backgroundColor: "rgba(255, 255, 255, 1)",
    },
  };

 








  
 


  const selectButton = (index) => {
    setIsTimeRangeLoading(true);
    setSelectedButton(index);
    setSelectedTimeRange(timeRanges[index - 1]);

    setSelectedTimeRangeClean(timeRangesClean[index - 1]);

    setApiResponse("");


   

  };



  
  
  const nameIdImgurlGenerationdate = allData?.slice(1, 5);

  const dataStartIndex = allData?.indexOf(selectedTimeRange) + 1;
  const dataEndIndex =
    selectedTimeRange === "long_term"
      ? allData?.length - 1
      : allData?.indexOf(timeRanges[timeRanges.indexOf(selectedTimeRange) + 1]) -
        1;

  const data = allData?.slice(dataStartIndex, dataEndIndex + 1);

  const labels = [
    "songIds[<=50]",
    "mostLeastPopSongIds[<=2]",
    "decadesAndPcts[]", //
    "oldestNewestSongIds[<=2]",
    "avgSongPop[1]",
    "songPopStdDev[1]",
    "avgSongAgeYrMo[2]",
    "songAgeStdDevYrMo[2]",
    "pctSongsExpl[1]",
    "audioFeatureMeans[11]",
    "audioFeatureStdDevs[11]",
    "highestAudioFeatureSongIds[<=11]",
    "lowestAudioFeatureSongIds[<=11]",
    "albumIds[<=10]",
    "mostLeastPopAlbumIds[<=2]",
    "avgAlbumPop[1]",
    "albumPopsStdDev[1]",
    "topLabelsByAlbums[<=5]",
    "artistIds[<=50]",
    "mostLeastPopArtistIds[<=2]",
    "avgArtistPop[1]",
    "artistPopStdDev[1]",
    "avgArtistFolls[1]",
    "artistFollsStdDev[1]",
    "topGenresByArtist[<=20]",
  ];

  const arrays = {
    songIds: [],
    mostLeastPopSongIds: [],
    decadesAndPcts: [], //
    oldestNewestSongIds: [],
    avgSongPop: [],
    songPopStdDev: [],
    avgSongAgeYrMo: [],
    songAgeStdDevYrMo: [],
    pctSongsExpl: [],
    audioFeatureMeans: [],
    audioFeatureStdDevs: [],
    highestAudioFeatureSongIds: [],
    lowestAudioFeatureSongIds: [],
    albumIds: [],
    mostLeastPopAlbumIds: [],
    avgAlbumPop: [],
    albumPopsStdDev: [],
    topLabelsByAlbums: [],
    artistIds: [],
    mostLeastPopArtistIds: [],
    avgArtistPop: [],
    artistPopStdDev: [],
    avgArtistFolls: [],
    artistFollsStdDev: [],
    topGenresByArtist: [],
  };

  for (let i = 0; i < labels.length - 1; i++) {
    const startIndex = data.indexOf(labels[i]) + 1;
    const endIndex = data.indexOf(labels[i + 1]);

    const key = labels[i].substring(0, labels[i].indexOf("["));
    arrays[key] = data.slice(startIndex, endIndex);
  }

  arrays.topGenresByArtist = data.slice(
    data.indexOf("topGenresByArtist[<=20]") + 1
  );
  /////
  const pieData = [];

  for (let i = 0; i < arrays.decadesAndPcts.length; i += 2) {
    const decade = arrays.decadesAndPcts[i];
    const percentage = arrays.decadesAndPcts[i + 1];
    pieData.push({ name: `${decade}s`, value: parseFloat(percentage) });
  }

  const colors = [
    "#1e90ff",
    "#18d860",
    "#ffdf00",
    "#FF1493",
    "#9370DB",
    "#FF4500",
    "#008080",
    "#FF8C00",
    "#9932CC",
    "#20B2AA",
    "#FF69B4",
    "#6A5ACD",
    "#32CD32",
    "#FF6347",
    "#7B68EE",
  ];

  //14

  ////

  const getTopSongs = async (songIds) => {
    try {
      if (songIds && songIds.length > 0 && songIds[0] !== "No data") {
        const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: songIds.join(","),
          },
        });

        const topSongsData = data.tracks.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          img: track.album.images[0]?.url || missingImage,
          mp3: track.preview_url,
          url: track.external_urls.spotify,
        }));

        setTopSongs(topSongsData);
      } else {
        setTopSongs([]);
      }
      // console.log(topSongs);
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getHighestAudioFeatureSongs = async (songIds) => {
    try {
      if (songIds && songIds.length > 0 && songIds[0] !== "No data") {
        const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: songIds.join(","),
          },
        });

        const highestAudioFeatureSongsData = data.tracks.map((track) => ({
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          img: track.album.images[0]?.url || missingImage,
          mp3: track.preview_url,
          url: track.external_urls.spotify,
        }));

        setHighestAudioFeatureSongs(highestAudioFeatureSongsData);
      } else {
        setHighestAudioFeatureSongs(Array(11).fill("-"));
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getLowestAudioFeatureSongs = async (songIds) => {
    try {
      if (songIds && songIds.length > 0 && songIds[0] !== "No data") {
        const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: songIds.join(","),
          },
        });

        const lowestAudioFeatureSongsData = data.tracks.map((track) => ({
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          img: track.album.images[0]?.url || missingImage,
          mp3: track.preview_url,
          url: track.external_urls.spotify,
        }));

        setLowestAudioFeatureSongs(lowestAudioFeatureSongsData);
      } else {
        setLowestAudioFeatureSongs(Array(11).fill("-"));
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getMostLeastPopSongs = async (songIds) => {
    try {
      if (songIds && songIds.length > 0 && songIds[0] !== "No data") {
        const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: songIds.join(","),
          },
        });

        const mostLeastPopSongsData = data.tracks.map((track) => ({
          name: track.name,
          pop: track.popularity,
          artists: track.artists.map((artist) => artist.name),
          img: track.album.images[0]?.url || missingImage,
          mp3: track.preview_url,
          url: track.external_urls.spotify,
        }));

        setMostLeastPopSongs(mostLeastPopSongsData);
      } else {
        setMostLeastPopSongs([]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getOldestNewestSongs = async (songIds) => {
    try {
      if (songIds && songIds.length > 0 && songIds[0] !== "No data") {
        const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: songIds.join(","),
          },
        });

        const oldestNewestSongsData = data.tracks.map((track) => ({
          name: track.name,
          date: track.album.release_date,
          artists: track.artists.map((artist) => artist.name),
          img: track.album.images[0]?.url || missingImage,
          mp3: track.preview_url,
          url: track.external_urls.spotify,
        }));

        setOldestNewestSongs(oldestNewestSongsData);
      } else {
        setOldestNewestSongs([]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getTopAlbums = async (albumIds) => {
    try {
      if (albumIds && albumIds.length > 0 && albumIds[0] !== "No data") {
        const maxAlbumsPerRequest = 20;
        const albumChunks = [];

        for (let i = 0; i < albumIds.length; i += maxAlbumsPerRequest) {
          albumChunks.push(albumIds.slice(i, i + maxAlbumsPerRequest));
        }

        const topAlbumData = [];

        for (const albumChunk of albumChunks) {
          const { data } = await axios.get(
            "https://api.spotify.com/v1/albums",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                ids: albumChunk.join(","),
              },
            }
          );

          const chunkAlbumsData = data.albums.map((album) => ({
            name: album.name,
            artists: album.artists.map((artist) => artist.name),
            img: album.images[0]?.url || missingImage,
            url: album.external_urls.spotify
          }));

          topAlbumData.push(...chunkAlbumsData);
        }

        setTopAlbums(topAlbumData);
      } else {
        setTopAlbums([]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getMostLeastPopAlbums = async (albumIds) => {
    try {
      if (albumIds && albumIds.length > 0 && albumIds[0] !== "No data") {
        const { data } = await axios.get("https://api.spotify.com/v1/albums", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: albumIds.join(","),
          },
        });

        const mostLeastPopAlbumsData = data.albums.map((album) => ({
          name: album.name,
          pop: album.popularity,
          artists: album.artists.map((artist) => artist.name),
          img: album.images[0]?.url || missingImage,
          url: album.external_urls.spotify
        }));

        setMostLeastPopAlbums(mostLeastPopAlbumsData);
      } else {
        setMostLeastPopAlbums([]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getTopArtists = async (artistIds) => {
    try {
      if (artistIds && artistIds.length > 0 && artistIds[0] !== "No data") {
        const { data } = await axios.get("https://api.spotify.com/v1/artists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: artistIds.join(","),
          },
        });

        const topArtistsData = data.artists.map((artist) => ({
          name: artist.name,
          img: artist.images[0]?.url || missingImage,
          url: artist.external_urls.spotify
        }));

        setTopArtists(topArtistsData);
      } else {
        setTopArtists([]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getMostLeastPopArtists = async (artistIds) => {
    try {
      if (artistIds && artistIds.length > 0 && artistIds[0] !== "No data") {
        const { data } = await axios.get("https://api.spotify.com/v1/artists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: artistIds.join(","),
          },
        });

        const mostLeastPopArtistsData = data.artists.map((artist) => ({
          name: artist.name,
          pop: artist.popularity,
          img: artist.images[0]?.url || missingImage,
          url: artist.external_urls.spotify
        }));

        setMostLeastPopArtists(mostLeastPopArtistsData);
      } else {
        setMostLeastPopArtists([]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  

  function formatGptPrompt(
    topSong,
    topSongArtist,
    topArtist,
    topAlbum,
    topAlbumArtist,
    topGenre,
    topLabel,
    oldestSong,
    oldestSongArtist,
    oldestSongYear,
    newestSong,
    newestSongArtist,
    newestSongYear,
    avgSongPop,
    songPopStdDev,
    avgSongAgeYrMo,
    songAgeStdDevYrMo,
    avgArtistPop,
    artistPopStdDev,
    pctSongsExpl,
    highAudioFeatureAvgs,
    highAudioFeatureStdDevs,
    lowAudioFeatureAvgs,
    lowAudioFeatureStdDevs
  ) {
    const yearWithHighestPercent = arrays.decadesAndPcts.reduce(
      (maxYear, currentValue, currentIndex) =>
        currentIndex % 2 === 1 &&
        parseFloat(currentValue) >
          parseFloat(arrays.decadesAndPcts[currentIndex - 2])
          ? arrays.decadesAndPcts[currentIndex - 1]
          : maxYear
    );

    return (
      "You'll be given some information about a person's music preferences. Your task is to generate a short, fun, and creative poem representing their music taste, in the second person POV. Try to incorporate most of the provided data into the poem. IMPORTANT: indicate each new line with a forward slash! ALSO VERY IMPORTANT: LIMIT YOUR POEM TO 70 WORDS MAXIMUM. DO NOT PRODUCE MORE THAN 70 WORDS IN YOUR RESPONSE. The data is: Their top song is " +
      topSong.toString() +
      " by " +
      topSongArtist.toString() +
      ". Their top artist is " +
      topArtist.toString() +
      ". Their top album is " +
      topAlbum.toString() +
      " by " +
      topAlbumArtist.toString() +
      ". Their top genre is " +
      topGenre.toString() +
      ". They've listened to music from both " +
      oldestSongYear.toString() +
      " and " +
      newestSongYear.toString() +
      ". The average popularity (0-100) of their songs is " +
      avgSongPop.toString() +
      ". The standard deviation of the popularities of their top songs is " +
      songPopStdDev.toString() +
      ". The average age of their top songs is " +
      avgSongAgeYrMo.toString() +
      ". The standard deviation of the ages of their top songs is " +
      songAgeStdDevYrMo.toString() +
      ". The average popularity of their top artists is " +
      avgArtistPop.toString() +
      ". The standard deviation of the popularity of their top artists is " +
      artistPopStdDev.toString() +
      ". The percent of their top songs that are explicit is " +
      pctSongsExpl.toString() +
      ". They like songs that have high values for " +
      highAudioFeatureAvgs[0].toString() +
      " and " +
      highAudioFeatureAvgs[1].toString() +
      ", and low values for " +
      lowAudioFeatureAvgs[0].toString() +
      " and " +
      lowAudioFeatureAvgs[1].toString() +
      ". They've listened to music from " +
      (arrays.decadesAndPcts.length / 2).toString() +
      " different decades, but they liked songs from the " +
      yearWithHighestPercent.toString() +
      "'s the most."
    );
  }

  function gatherGptPromptData() {
    const audioFeaturesToAvgsMap = features.reduce((map, current, index) => {
      if (![2, 6, 8].includes(index))
        map[current] = parseFloat(arrays.audioFeatureMeans[index]);
      return map;
    }, {});

    const audioFeaturesToAvgsMapSorted = new Map(
      Object.entries(audioFeaturesToAvgsMap).sort(
        ([, value1], [, value2]) => value1 - value2
      )
    );

    const keysOfAudioFeaturesToAvgsMapSorted = Array.from(
      audioFeaturesToAvgsMapSorted.keys()
    );
    const twoAudioFeaturesLowestAvgs = keysOfAudioFeaturesToAvgsMapSorted.slice(
      0,
      2
    );
    const twoAudioFeaturesHighestAvgs =
      keysOfAudioFeaturesToAvgsMapSorted.slice(-2);

    const audioFeaturesToStdDevsMap = features.reduce((map, current, index) => {
      if (![2, 6, 8].includes(index))
        map[current] = parseFloat(arrays.audioFeatureStdDevs[index]);
      return map;
    }, {});

    const audioFeaturesToStdDevsMapSorted = new Map(
      Object.entries(audioFeaturesToStdDevsMap).sort(
        ([, value1], [, value2]) => value1 - value2
      )
    );

    const keysOfAudioFeaturesToStdDevsMapSorted = Array.from(
      audioFeaturesToStdDevsMapSorted.keys()
    );
    const twoAudioFeaturesLowestStdDevs =
      keysOfAudioFeaturesToStdDevsMapSorted.slice(0, 2);
    const twoAudioFeaturesHighestStdDevs =
      keysOfAudioFeaturesToStdDevsMapSorted.slice(-2);

    let prompt = "Prompt error. Try again.";

    if (
      topSongs &&
      topSongs.length > 0 &&
      topArtists &&
      topArtists.length > 0 &&
      topAlbums &&
      topAlbums.length > 0
    ) {
      prompt = formatGptPrompt(
        topSongs[0]?.name,
        topSongs[0]?.artists[0],
        topArtists[0]?.name,
        topAlbums[0]?.name,
        topAlbums[0]?.artists[0],
        arrays.topGenresByArtist[0],
        arrays.topLabelsByAlbums[0],
        oldestNewestSongs[0]?.name,
        oldestNewestSongs[0]?.artists[0],
        oldestNewestSongs[0]?.date.substr(0, 4),
        oldestNewestSongs[1]?.name,
        oldestNewestSongs[1]?.artists[0],
        oldestNewestSongs[1]?.date.substr(0, 4),
        arrays.avgSongPop,
        arrays.songPopStdDev,
        arrays.avgSongAgeYrMo[0] +
          " year(s) and " +
          arrays.avgSongAgeYrMo[1] +
          " month(s)",
        arrays.songAgeStdDevYrMo[0] +
          " year(s) and " +
          arrays.songAgeStdDevYrMo[1] +
          " month(s)",
        arrays.avgArtistPop,
        arrays.artistPopStdDev,
        arrays.pctSongsExpl,
        twoAudioFeaturesHighestAvgs,
        twoAudioFeaturesHighestStdDevs,
        twoAudioFeaturesLowestAvgs,
        twoAudioFeaturesLowestStdDevs
      );
    }

    return prompt;
  }

  

  


  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) {
      return true;
    }
    return new Date().getTime() > parseInt(expirationTime);
  };

  function clearCookies() {
    var cookies = document.cookie.split(";");
    // console.log(cookies);

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  }

  const logout = (error) => {
    if (error === "apiError") {
      clearCookies();
      token = "";
      setExpirationTime("");
      window.localStorage.removeItem("token");
      // window.localStorage.removeItem("expirationTime"); //
      navigate("/", { state: { [error]: true } });
    } else {
      clearCookies();
      token = "";
      setExpirationTime("");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("expirationTime");
      navigate("/");
    }
  };

  
  const features = [
    "acousticness",
    "danceability",
    "duration",
    "energy",
    "instrumentalness",
    "liveness",
    "loudness",
    "speechiness",
    "tempo",
    "valence",
  ];

  const date = new Date(nameIdImgurlGenerationdate[3]);

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const generationDateTime = date.toLocaleString(undefined, {
    timeZone: localTimeZone,
  });

  const getAudioFeatureValues = async (songIds, arrayToSet) => {
    try {
      const featureNames = [
        "acousticness",
        "danceability",
        "duration_ms",
        "energy",
        "instrumentalness",
        "liveness",
        "loudness",
        "speechiness",
        "tempo",
        "valence",
      ];

      const allEmpty = songIds.every((id) => id === "");

      if (allEmpty) {
        arrayToSet(Array(songIds.length).fill("-"));
        return;
      }

      if (songIds && songIds.length > 0 && songIds[0] === "No data") {
        arrayToSet(Array(songIds.length).fill("-"));
        return;
      }

      const filteredIds = songIds.filter((id) => id !== "");

      const { data } = await axios.get(
        "https://api.spotify.com/v1/audio-features",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: filteredIds.join(","),
          },
        }
      );

      const audioFeatures = data.audio_features.map((item) => ({
        id: item.id,
        acousticness: item.acousticness,
        danceability: item.danceability,
        duration_ms: item.duration_ms,
        energy: item.energy,
        instrumentalness: item.instrumentalness,
        liveness: item.liveness,
        loudness: item.loudness,
        speechiness: item.speechiness,
        tempo: item.tempo,
        valence: item.valence,
      }));

      const result = [];
      for (let i = 0; i < songIds.length; i++) {
        if (songIds[i] === "") {
          result[i] = "";
        } else {
          const feature = featureNames[i];
          const audioFeature = audioFeatures.find(
            (item) => item.id === songIds[i]
          );
          if (feature === "duration_ms") {
            result[i] = audioFeature ? msToMinSec(audioFeature[feature]) : "";
          } else {
            result[i] = audioFeature ? audioFeature[feature] : "";
          }
        }
      }

      arrayToSet(result);
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  function msToMinSec(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  
  const openRecModal = async () => {
    setRecModalIsOpen(true);
  };
  const closeRecModal = () => {
    setRecModalIsOpen(false);
  };

  const audioFeaturesToAvgsMap = features.reduce((map, current, index) => {
    if (![2, 6, 8].includes(index))
      map[current] = parseFloat(arrays.audioFeatureMeans[index]);
    return map;
  }, {});

  const audioFeaturesToAvgsMapSorted = new Map(
    Object.entries(audioFeaturesToAvgsMap).sort(
      ([, value1], [, value2]) => value1 - value2
    )
  );

  const keysOfAudioFeaturesToAvgsMapSorted = Array.from(
    audioFeaturesToAvgsMapSorted.keys()
  );
  const twoAudioFeaturesLowestAvgs = keysOfAudioFeaturesToAvgsMapSorted.slice(
    0,
    2
  );
  const twoAudioFeaturesHighestAvgs =
    keysOfAudioFeaturesToAvgsMapSorted.slice(-2);

  const audioFeaturesToStdDevsMap = features.reduce((map, current, index) => {
    if (![2, 6, 8].includes(index))
      map[current] = parseFloat(arrays.audioFeatureStdDevs[index]);
    return map;
  }, {});

  const audioFeaturesToStdDevsMapSorted = new Map(
    Object.entries(audioFeaturesToStdDevsMap).sort(
      ([, value1], [, value2]) => value1 - value2
    )
  );

  const keysOfAudioFeaturesToStdDevsMapSorted = Array.from(
    audioFeaturesToStdDevsMapSorted.keys()
  );
  const twoAudioFeaturesLowestStdDevs =
    keysOfAudioFeaturesToStdDevsMapSorted.slice(0, 2);
  const twoAudioFeaturesHighestStdDevs =
    keysOfAudioFeaturesToStdDevsMapSorted.slice(-2);

  const featureExplanations = [
    "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic.",
    "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable.",
    "",
    "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.",
    `Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.`,
    "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live.",
    "The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db.",
    "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks.",
    "The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration.",
    "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).",
  ];

  // const [isPlaying, setIsPlaying] = useState([]);
  

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

  const resetAllAudio = () => {
    const audioElements = document.querySelectorAll("audio");
    const updatedIsPlaying = Array.from(isPlaying);

    audioElements.forEach((audioElement, i) => {
      audioElement.pause();
      audioElement.currentTime = 0;
      updatedIsPlaying[i] = false;
    });

    setIsPlaying(updatedIsPlaying);
  };

  

  

  function openAudiofeatureModal(feature) {
    setScrollPosition(document.documentElement.scrollTop);

    setIsAudiofeatureModalOpen(true);
    setAudiofeatureForModal(feature);
  }


  function handleScroll() {
    setScrollPosition(document.documentElement.scrollTop);
  }
 

  function closeAudiofeatureModal(feature) {
    setIsAudiofeatureModalOpen(false);
    setAudiofeatureForModal(null);
  }

  

  function getTimeDifference(time1, time2) {
    if (time1 && time2) {
      const [minutes1, seconds1] = time1?.split(":").map(Number);
      const [minutes2, seconds2] = time2?.split(":").map(Number);
      const difference = Math.abs(
        minutes1 * 60 + seconds1 - (minutes2 * 60 + seconds2)
      );
      return `${String(Math.floor(difference / 60))}:${String(
        difference % 60
      ).padStart(2, "0")}`;
    }
    return null;
  }

  

  //

  const openDropdownMenu = () => {
    // document.getElementById("dropdownMenuArrow").style.transform =
    //   "rotate(90deg)";    
       

    setShowDropdownMenu(true);
  };

  const closeDropdownMenu = () => {
    // document.getElementById("dropdownMenuArrow").style.transform =
    //   "rotate(0deg)";
    

    setShowDropdownMenu(false);
  };

  const toggleDropdownMenu = () => {
    if (showDropdownMenu) {
      document.getElementById("dropdownMenuArrow").style.transform =
        "rotate(0deg)";

      setShowDropdownMenu(false);
    } else {
      document.getElementById("dropdownMenuArrow").style.transform =
        "rotate(90deg)";
      setShowDropdownMenu(true);
    }
  };

    
  return (
    <div className="dataPage">
      {/* <ScrollButton/> */}
      {/* <button
        title="Back"
        className="defaultBtn"
        onClick={() => navigate("/dashboard")}
      >
        <img
          src={logo}
          className="appLogo"
          alt="logo"
          style={{
            position: "absolute",
            top: "20px",
            left: "30px",
            width: "60px",
            pointerEvents: "all",
          }}
        ></img>

        <h1 className="logoName">comparify</h1>
      </button> */}
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
        title="Dashboard"
      />

      <span className="pageHeader">Your data</span>

      <div
        className="dataPageDropdownMenuTrigger"
        onMouseOver={openDropdownMenu}
        onMouseOut={closeDropdownMenu}
        onClick={toggleDropdownMenu}
      >
        <img
          src={nameIdImgurlGenerationdate[2]}
          style={{
            width: "30px",
            borderRadius: "50%",
            paddingLeft: "10px",
            paddingRight: "10px",
            verticalAlign: "middle",
          }}
          alt="Image 1"
        />
        {/* </a> */}
        <div
          style={{
            fontWeight: "bold",
            display: "inline",
          }}
        >
          {nameIdImgurlGenerationdate[0]}
          <img
            id="dropdownMenuArrow"
            src={rightArrow}
            style={{
              width: "15px",
              verticalAlign: "middle",
              marginLeft: "10px",
              // transform: "rotate(0deg)",
            }}
            className={`${showDropdownMenu ? "menuArrowRotateDown" : "menuArrowRotateUp"}`}

          />
        </div>
      </div>

      {showDropdownMenu && (
        <div
          className="dropdownMenuContainer"
          onMouseOver={openDropdownMenu}
          onMouseOut={closeDropdownMenu}
        >
          <div className="dropdownMenu">
            <a
              href={
                "https://open.spotify.com/user/" + nameIdImgurlGenerationdate[1]
              }
              style={{ textDecoration: "none", color: "#18d860" }}
              className="darkenHover"
              title="Open your Spotify profile"
            >
              <img
                src={spotifysmall}
                style={{
                  width: "20px",
                  marginRight: "10px",
                  verticalAlign: "middle",
                }}
              ></img>
              Profile
              <img
                src={greenArrow}
                style={{
                  width: "10px",
                  marginLeft: "10px",
                  verticalAlign: "middle",
                }}
              ></img>
            </a>

            <div
              onClick={openModal}
              style={{ marginTop: "20px", cursor: "pointer", fontSize: "20px" }}
              title={`Try comparify \u2A2F ChatGPT`}
            >
              <span>
                <img
                  src={logo}
                  style={{ width: "30px", verticalAlign: "middle" }}
                  className="zoom"
                />
              </span>{" "}
              &#10799;{" "}
              <span style={{ color: "#75ac9d" }}>
                <img
                  className="spin"
                  src={gptBtn}
                  style={{
                    width: "20px",
                    cursor: "pointer",
                    verticalAlign: "middle",
                  }}
                />{" "}
              </span>
            </div>

            <div
              className="recommendationsBtn"
              onClick={openRecModal}
              style={{ fontSize: "13px", marginTop: "20px" }}
              title="Get music recommendations"
            >
              Get recommendations
            </div>

            <div
              className="recommendationsBtn border"
              onClick={() =>
                navigate("/moredata", {
                  state: { data: location.state.data, token: token },
                })
              }
              style={{ fontSize: "13px", marginTop: "20px" }}
              title="See more data"
            >
              More data{" "}
              <img
                src={rightArrow}
                style={{ width: "10px", verticalAlign: "middle" }}
              />
            </div>

            <div className="generationDateTime" style={{ marginTop: "30px" }}>
              Data generated {generationDateTime}
            </div>
          </div>
        </div>
      )}







      <div className="navBtnContainer">
        <div className="leftNavBtnContainer">
          <Link to="/dashboard" title="Dashboard">
            <button className="leftNavBtn">
              <img src={back} style={{ width: "13px" }}></img>
            </button>
          </Link>
        </div>
        <div className="navBtnOverlay">
          {/* <img src={time} style={{width:'20px',marginRight:'20px'}}/> */}




          {/* {isTimeRangeLoading ? (

            <div className="loadingDots" style={{ marginBottom: "12px" }}>
              <div className="loadingDots--dot"></div>
              <div className="loadingDots--dot"></div>
              <div className="loadingDots--dot"></div>
            </div>
          ) : ( */}
            <>
            
              <button
                className={`navBtn ${selectedButton === 1 ? "selected" : ""}`}
                onClick={() => selectButton(1)
               
                
                }
                id="time1"
              >
                last month
              </button>
              <button
                className={`navBtn ${selectedButton === 2 ? "selected" : ""}`}
                onClick={() => selectButton(2)}
                id="time2"
              >
                last 6 months
              </button>
              <button
                className={`navBtn ${selectedButton === 3 ? "selected" : ""}`}
                onClick={() => selectButton(3)}
                id="time3"
              >
                all time
              </button>
            </>
          {/* )} */}
        </div>
      </div>



 {isTimeRangeLoading && (
<div style={{position:'relative', top:'100px',left:'50%', 
  transform: 'translateX(-50%)'}}>
            <div className="loadingDots" style={{ marginBottom: "12px" }}>
              <div className="loadingDots--dot"></div>
              <div className="loadingDots--dot"></div>
              <div className="loadingDots--dot"></div>
            </div></div>
          )}


      <div className="card-row" style={{ marginTop: "120px" }}>
        <div className="primaryCard1">
          <div className="primaryTitle">top songs</div>
          {topSongs.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            topSongs.map((song, index) => (
              <div key={index} className="item">
                <div
                  className={`primaryImage`}
                  onClick={() => togglePlayback(`audio-element${index}`)}
                >
                  <audio id={`audio-element${index}`} src={song?.mp3}></audio>

                  <img src={song?.img} className="primaryImage" />

                  {song?.mp3 && (
                    <div
                      className={
                        isPlaying[`audio-element${index}`]
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
                </div>
              </div>
            ))
          )}
        </div>

        <div className="primaryCard2">
          <div className="primaryTitle">top artists</div>
          {topArtists.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            topArtists.map((artist, index) => (
              <div key={index} className="item">
                <img src={artist.img} className="primaryImage" />
                <div className="primaryText">
                <a className="link2" href={artist.url}>
                  <span className="primaryName">
                    {artist.name ? artist.name : artist}
                  </span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="primaryCard1">
          <div
            className="primaryTitle"
            data-tooltip-id="dataPageTooltip1"
            data-tooltip-content="based on frequency of occurences in top songs."
          >
            top albums
          </div>
          {topAlbums.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            topAlbums.map((album, index) => (
              <div key={index} className="item">
                <img src={album?.img} className="primaryImage" />
                <div className="primaryText">
                <a className="link2" href={album.url}>
                  <span className="primaryName">
                    {album.name ? album.name : album}
                  </span></a>
                  <span className="primaryArtists">
                    {album.artists?.join(", ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="primaryCard2">
          <div
            className="primaryTitle"
            data-tooltip-id="dataPageTooltip1"
            data-tooltip-content="based on frequency of occurences in top artists."
          >
            top genres
          </div>
          {arrays.topLabelsByAlbums &&
          arrays.topGenresByArtist[0] === "No data" ? (
            <div className="noData">No data</div>
          ) : (
            arrays.topGenresByArtist.map((genre, index) => (
              <div key={index} className="item">
                <div className="primaryText">
                  <span className="primaryName">{genre}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="primaryCard3">
          <div
            className="primaryTitle"
            data-tooltip-id="dataPageTooltip1"
            data-tooltip-content="based on frequency of occurences in top songs."
          >
            top labels
          </div>
          {arrays.topLabelsByAlbums &&
          arrays.topLabelsByAlbums[0] === "No data" ? (
            <div className="noData">No data</div>
          ) : (
            arrays.topLabelsByAlbums.map((label, index) => (
              <div key={index} className="item">
                <div className="primaryText">
                  <span className="primaryName">{label}</span>
                </div>
              </div>
            ))
          )}
        </div>
        {/* <PieChart width={400} height={400}>
    <Pie
      data={pieData}
      cx={200}
      cy={200}
      outerRadius={80}
      fill="#8884d8"
      dataKey="value"
      label
    >
      {pieData.map((entry, index) => (
        <Cell key={index} fill={colors[index % colors.length]} />
      ))}
    </Pie>
    <Legend />
  </PieChart> */}

       
        {/* </div> */}

        {/* <div className="card-row"> */}
        <div className="primaryCard4">
          <div className="primaryTitle">most popular song</div>
          {mostLeastPopSongs.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            mostLeastPopSongs &&
            mostLeastPopSongs[0] && (
              <div className="item">
                <div
                  className={`primaryImage`}
                  onClick={() => togglePlayback("additional-audio-1")}
                >
                  <audio
                    id="additional-audio-1"
                    src={mostLeastPopSongs[0]?.mp3}
                  ></audio>

                  <img
                    src={mostLeastPopSongs[0]?.img}
                    className="primaryImage"
                  />

                  {mostLeastPopSongs[0]?.mp3 && (
                    <div
                      className={
                        isPlaying["additional-audio-1"] ? "paused" : "playing"
                      }
                    ></div>
                  )}
                </div>

                <div className="primaryText">
                <a className="link2" href={mostLeastPopSongs[0].url}>
                     
                   
                  <span className="primaryName">
                    {mostLeastPopSongs[0]?.name}
                  </span> </a>
                  <span className="primaryArtists">
                    {mostLeastPopSongs[0]?.artists?.join(", ")}
                  </span>
                  <span
                    style={{ paddingLeft: "20px" }}
                    data-tooltip-id="dataPageTooltip1"
                    data-tooltip-content="0-100. assigned by Spotify and updated based on current data."
                  >
                    {mostLeastPopSongs[0]?.pop}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">least popular song</div>
          {mostLeastPopSongs.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            mostLeastPopSongs &&
            mostLeastPopSongs[1] && (
              <div className="item">
                <div
                  className={`primaryImage`}
                  onClick={() => togglePlayback("additional-audio-2")}
                >
                  <audio
                    id="additional-audio-2"
                    src={mostLeastPopSongs[1]?.mp3}
                  ></audio>

                  <img
                    src={mostLeastPopSongs[1]?.img}
                    className="primaryImage"
                  />

                  {mostLeastPopSongs[1]?.mp3 && (
                    <div
                      className={
                        isPlaying["additional-audio-2"] ? "paused" : "playing"
                      }
                    ></div>
                  )}
                </div>

                {/* <img src={mostLeastPopSongs[1]?.img} className="primaryImage" /> */}
                <div className="primaryText">
                <a className="link2" href={mostLeastPopSongs[1].url}>
                  <span className="primaryName">
                    {mostLeastPopSongs[1]?.name}
                  </span></a>
                  <span className="primaryArtists">
                    {mostLeastPopSongs[1]?.artists?.join(", ")}
                  </span>
                  <span
                    style={{ paddingLeft: "20px" }}
                    data-tooltip-id="dataPageTooltip1"
                    data-tooltip-content="0-100. assigned by Spotify and updated based on current data."
                  >
                    {mostLeastPopSongs[1]?.pop}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">oldest song</div>
          {oldestNewestSongs.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            oldestNewestSongs &&
            oldestNewestSongs[0] && (
              <div className="item">
                <div
                  className={`primaryImage`}
                  onClick={() => togglePlayback("additional-audio-3")}
                >
                  <audio
                    id="additional-audio-3"
                    src={oldestNewestSongs[0]?.mp3}
                  ></audio>

                  <img
                    src={oldestNewestSongs[0]?.img}
                    className="primaryImage"
                  />

                  {oldestNewestSongs[0]?.mp3 && (
                    <div
                      className={
                        isPlaying["additional-audio-3"] ? "paused" : "playing"
                      }
                    ></div>
                  )}
                </div>

                {/* <img src={oldestNewestSongs[0]?.img} className="primaryImage" /> */}
                <div className="primaryText">
                <a className="link2" href={oldestNewestSongs[0].url}>
                  <span className="primaryName">
                    {oldestNewestSongs[0]?.name}
                  </span></a>
                  <span className="primaryArtists">
                    {oldestNewestSongs[0]?.artists?.join(", ")}
                  </span>
                  <span style={{ paddingLeft: "20px" }}>
                    {oldestNewestSongs[0]?.date?.substr(0, 4)}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="primaryCard5">
          <div className="primaryTitle">newest song</div>
          {oldestNewestSongs.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            oldestNewestSongs &&
            oldestNewestSongs[1] && (
              <div className="item">
                <div
                  className={`primaryImage`}
                  onClick={() => togglePlayback("additional-audio-4")}
                >
                  <audio
                    id="additional-audio-4"
                    src={oldestNewestSongs[1]?.mp3}
                  ></audio>

                  <img
                    src={oldestNewestSongs[1]?.img}
                    className="primaryImage"
                  />

                  {oldestNewestSongs[1]?.mp3 && (
                    <div
                      className={
                        isPlaying["additional-audio-4"] ? "paused" : "playing"
                      }
                    ></div>
                  )}
                </div>

                {/* <img src={oldestNewestSongs[1]?.img} className="primaryImage" /> */}
                <div className="primaryText">
                <a className="link2" href={oldestNewestSongs[1].url}>
                  <span className="primaryName">
                    {oldestNewestSongs[1]?.name}
                  </span></a>
                  <span className="primaryArtists">
                    {oldestNewestSongs[1]?.artists?.join(", ")}
                  </span>
                  <span style={{ paddingLeft: "20px" }}>
                    {oldestNewestSongs[1]?.date?.substr(0, 4)}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">most popular artist</div>
          {mostLeastPopArtists.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            mostLeastPopArtists &&
            mostLeastPopArtists[0] && (
              <div className="item">
                <img
                  src={mostLeastPopArtists[0]?.img}
                  className="primaryImage"
                />
                <div className="primaryText">
                <a className="link2" href={mostLeastPopArtists[0].url}>
                  <span className="primaryName">
                    {mostLeastPopArtists[0]?.name}
                  </span></a>
                  <span
                    style={{ paddingLeft: "20px" }}
                    data-tooltip-id="dataPageTooltip1"
                    data-tooltip-content="0-100. assigned by Spotify and updated based on current data."
                  >
                    {mostLeastPopArtists[0]?.pop}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">least popular artist</div>
          {mostLeastPopArtists.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            mostLeastPopArtists &&
            mostLeastPopArtists[1] && (
              <div className="item">
                <img
                  src={mostLeastPopArtists[1]?.img}
                  className="primaryImage"
                />
                <div className="primaryText">
                <a className="link2" href={mostLeastPopArtists[1].url}>
                  <span className="primaryName">
                    {mostLeastPopArtists[1]?.name}
                  </span></a>
                  <span
                    style={{ paddingLeft: "20px" }}
                    data-tooltip-id="dataPageTooltip1"
                    data-tooltip-content="0-100. assigned by Spotify and updated based on current data."
                  >
                    {mostLeastPopArtists[1]?.pop}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">most popular album</div>
          {mostLeastPopAlbums.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            mostLeastPopAlbums &&
            mostLeastPopAlbums[0] && (
              <div className="item">
                <img
                  src={mostLeastPopAlbums[0]?.img}
                  className="primaryImage"
                />
                <div className="primaryText">
                <a className="link2" href={mostLeastPopAlbums[0].url}>
                  <span className="primaryName">
                    {mostLeastPopAlbums[0]?.name}
                  </span></a>
                  <span className="primaryArtists">
                    {mostLeastPopAlbums[0]?.artists?.join(", ")}
                  </span>
                  <span
                    style={{ paddingLeft: "20px" }}
                    data-tooltip-id="dataPageTooltip1"
                    data-tooltip-content="0-100. assigned by Spotify and updated based on current data."
                  >
                    {mostLeastPopAlbums[0]?.pop}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">least popular album</div>
          {mostLeastPopAlbums.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            mostLeastPopAlbums &&
            mostLeastPopAlbums[1] && (
              <div className="item">
                <img
                  src={mostLeastPopAlbums[1]?.img}
                  className="primaryImage"
                />
                <div className="primaryText">
                <a className="link2" href={mostLeastPopAlbums[1].url}>
                  <span className="primaryName">
                    {mostLeastPopAlbums[1]?.name}
                  </span></a>
                  <span className="primaryArtists">
                    {mostLeastPopAlbums[1]?.artists?.join(", ")}
                  </span>
                  <span
                    style={{ paddingLeft: "20px" }}
                    data-tooltip-id="dataPageTooltip1"
                    data-tooltip-content="0-100. assigned by Spotify and updated based on current data."
                  >
                    {mostLeastPopAlbums[1]?.pop}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">average song popularity</div>
          {arrays.avgSongPop && (
            <div className="item">
              <div className="primaryText">
                <span
                  className="primaryName2"
                  data-tooltip-id="dataPageTooltip1"
                  data-tooltip-content="0-100. assigned by Spotify and updated based on current data. higher means more popular."
                >
                  {arrays.avgSongPop}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">song popularity standard deviation</div>
          {arrays.songPopStdDev && (
            <div className="item">
              <div className="primaryText">
                <span
                  className="primaryName2"
                  data-tooltip-id="dataPageTooltip1"
                  data-tooltip-content="a larger value indicates more variability, while a smaller value indicates less, on average."
                >
                  {arrays.songPopStdDev}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">average song age</div>
          {arrays.avgSongAgeYrMo && (
            <div className="item">
              <div className="primaryText">
                <span className="primaryName2">
                  {`${
                    arrays.avgSongAgeYrMo[0] === 1
                      ? "1 year"
                      : `${arrays.avgSongAgeYrMo[0]} years`
                  }, ${
                    arrays.avgSongAgeYrMo[1] === 1
                      ? "1 month"
                      : `${arrays.avgSongAgeYrMo[1]} months`
                  }`}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">song age standard deviation</div>
          {arrays.songAgeStdDevYrMo && (
            <div className="item">
              <div className="primaryText">
                <span
                  className="primaryName2"
                  data-tooltip-id="dataPageTooltip1"
                  data-tooltip-content="a larger value indicates more variability, while a smaller value indicates less, on average."
                >
                  {`${
                    arrays.songAgeStdDevYrMo[0] === 1
                      ? "1 year"
                      : `${arrays.songAgeStdDevYrMo[0]} years`
                  }, ${
                    arrays.songAgeStdDevYrMo[1] === 1
                      ? "1 month"
                      : `${arrays.songAgeStdDevYrMo[1]} months`
                  }`}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard6">
          <div className="primaryTitle">percent songs explicit</div>
          {arrays.pctSongsExpl && (
            <div className="item">
              <div className="primaryText">
                <span className="primaryName2">{arrays.pctSongsExpl}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">average album popularity</div>
          {arrays.avgAlbumPop && (
            <div className="item">
              <div className="primaryText">
                <span
                  className="primaryName2"
                  data-tooltip-id="dataPageTooltip1"
                  data-tooltip-content="0-100. assigned by Spotify and updated based on current data. higher means more popular."
                >
                  {arrays.avgAlbumPop}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">
            album popularity standard deviation
          </div>
          {arrays.albumPopsStdDev && (
            <div className="item">
              <div className="primaryText">
                <span
                  className="primaryName2"
                  data-tooltip-id="dataPageTooltip1"
                  data-tooltip-content="a larger value indicates more variability, while a smaller value indicates less, on average."
                >
                  {arrays.albumPopsStdDev}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">average artist popularity</div>
          {arrays.avgArtistPop && (
            <div className="item">
              <div className="primaryText">
                <span
                  className="primaryName2"
                  data-tooltip-id="dataPageTooltip1"
                  data-tooltip-content="0-100. assigned by Spotify and updated based on current data. higher means more popular."
                >
                  {arrays.avgArtistPop}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">
            artist popularity standard deviation
          </div>
          {arrays.artistPopStdDev && (
            <div className="item">
              <div className="primaryText">
                <span
                  className="primaryName2"
                  data-tooltip-id="dataPageTooltip1"
                  data-tooltip-content="a larger value indicates more variability, while a smaller value indicates less, on average."
                >
                  {arrays.artistPopStdDev}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard6">
          <div className="primaryTitle">average artist followers</div>
          {arrays.avgArtistFolls && (
            <div className="item">
              <div className="primaryText">
                <span className="primaryName2">{arrays.avgArtistFolls}</span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard6">
          <div className="primaryTitle">
            artist followers standard deviation
          </div>
          {arrays.artistFollsStdDev && (
            <div className="item">
              <div className="primaryText">
                <span
                  className="primaryName2"
                  data-tooltip-id="dataPageTooltip1"
                  data-tooltip-content="a larger value indicates more variability, while a smaller value indicates less, on average."
                >
                  {arrays.artistFollsStdDev}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="pieCard"
        onMouseOver={()=>setSongReleaseDecadeDistrHover(true)}
        onMouseOut={()=>setSongReleaseDecadeDistrHover(false)}

        onClick={handleTapPie}
      onTouchStart={handleTapPie}
        >
          <div className="primaryTitle">song release decade distribution  <img
                src={rightArrow}
                style={{ width: "15px", verticalAlign: "middle" }}
              /></div>
          {songReleaseDecadeDistrHover ? (
          arrays.decadesAndPcts && arrays.decadesAndPcts[0] === "No data" ? (
            <div className="noData">No data</div>
          ) : (
            <PieChart width={200} height={200}>
              <Pie
                data={pieData}
                outerRadius={30}
                fill="#8884d8"
                dataKey="value"
                label={({ name }) => name} // Set the label to display the name property
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={colors[index % colors.length]} />
                ))}
              </Pie>
            </PieChart>
          ))
        
        
          :(null)}
        </div>
        {/* </div> */}
      </div>

      <div className="audioFeaturesHeader">
        {" "}
        <div
          style={{
            cursor: "pointer",
            margin: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          data-tooltip-id="dataPageTooltip1"
          data-tooltip-content="Dive even deeper with detailed stats on the audio features for your top songs this period."
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          audio features{" "}
          <img
            id="arrow"
            src={arrowRight}
            style={{
              marginLeft: "10px",
              width: "10px",
            }}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ wordWrap: "break-word" }}>
                <div style={{ maxWidth: "140px", margin: "0 auto" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRop: "10px",
                    }}
                  >
                    <img
                      src={rightArrow}
                      style={{ width: "10px", verticalAlign: "middle" }}
                    />
                    &ensp;Hover/tap select labels for more information. Click the arrow for rankings.
                  </span>
                </div>
              </th>

              <th>
                <span
                  className="audioFeaturesColumnLabel"
                  style={{ cursor: "auto" }}
                >
                  average
                </span>
              </th>
              <th
                data-tooltip-id="dataPageTooltip1"
                data-tooltip-content="a larger value indicates more variability, while a smaller value indicates less, on average."
               
              >
                <span className="audioFeaturesColumnLabel" >
                  standard deviation
                </span>
              </th>
              <th>
                <span
                  className="audioFeaturesColumnLabel"
                  style={{ cursor: "auto" }}
                >
                  song with highest value
                </span>
              </th>
              <th>
                <span className="">{/* range */}</span>
              </th>
              <th>
                <span
                  className="audioFeaturesColumnLabel"
                  style={{ cursor: "auto" }}
                >
                  song with lowest value
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => {
              const highestSong = highestAudioFeatureSongs[index];
              const highestSongValue = highestAudioFeatureValues[index];

              const lowestSong = lowestAudioFeatureSongs[index];
              const lowestSongValue = lowestAudioFeatureValues[index];

              return (
                <tr key={feature}>
                  <td>
                    <span
                      className="audioFeaturesColumnLabel"
                      data-tooltip-id="dataPageTooltip1"
                      data-tooltip-content={featureExplanations[index]}
                      style={{cursor:'zoom-in'}}
                    >
                      {feature}
                    </span>
                    <span
                      onClick={(e) => {
                        openAudiofeatureModal(feature);
                      }}
                      title={`Open ${feature} rankings`}
                     
                    >
                      <img
                        src={popoutIcon}
                        style={{
                          width: "10px",
                          marginLeft: "10px",
                          cursor: "ne-resize",
                          pointerEvents: "all",
                        }}
                      />
                    </span>
                  </td>

                  <td>
                    <div
                      className="cellOutline"
                      style={
                        twoAudioFeaturesLowestAvgs.includes(feature) &&
                        !twoAudioFeaturesHighestAvgs.includes(feature) &&
                        arrays.audioFeatureMeans[index] !== "-"
                          ? {
                              // border: "1px solid #ff0000",
                              backgroundColor: "#ffeded",
                              color: "#ff0000",
                            }
                          : twoAudioFeaturesHighestAvgs.includes(feature) &&
                            !twoAudioFeaturesLowestAvgs.includes(feature) &&
                            arrays.audioFeatureMeans[index] !== "-"
                          ? {
                              // border: "1px solid #17d475",
                              backgroundColor: "#e8fcec",
                              color: "#17d475",
                            }
                          : null
                      }
                    >
                      {arrays.audioFeatureMeans[index]}
                    </div>
                  </td>

                  <td>
                    <div
                      className="cellOutline"
                      style={
                        twoAudioFeaturesLowestStdDevs.includes(feature) &&
                        !twoAudioFeaturesHighestStdDevs.includes(feature) &&
                        arrays.audioFeatureStdDevs[index] !== "-"
                          ? {
                              // border: "1px solid #ff0000",
                              backgroundColor: "#ffeded",
                              color: "#ff0000",
                            }
                          : twoAudioFeaturesHighestStdDevs.includes(feature) &&
                            !twoAudioFeaturesLowestStdDevs.includes(feature) &&
                            arrays.audioFeatureStdDevs[index] !== "-"
                          ? {
                              // border: "1px solid #17d475",
                              backgroundColor: "#e8fcec",
                              color: "#17d475",
                            }
                          : null
                      }
                    >
                      {arrays.audioFeatureStdDevs[index]}
                    </div>
                  </td>
                  <td>
                    {highestSong == "-" && (
                      <div className="cellOutline">
                        <div className="noSongData">-</div>
                      </div>
                    )}
                    {highestSong && highestSong != "-" && (
                      <div className="cellOutline">
                        <div
                          className={`primaryImage`}
                          onClick={() =>
                            togglePlayback(`highest-audio-${index}`)
                          }
                        >
                          <audio
                            id={`highest-audio-${index}`}
                            src={highestSong?.mp3}
                          ></audio>

                          <img
                            src={highestSong?.img}
                            className="primaryImage"
                          />

                          {highestSong?.mp3 && (
                            <div
                              className={
                                isPlaying[`highest-audio-${index}`]
                                  ? "paused"
                                  : "playing"
                              }
                            ></div>
                          )}
                        </div>
                        {/* <img
                          className="primaryImage"
                          src={highestSong?.img}
                          alt={""}
                        /> */}
                          <a className="link2" href={highestSong.url}>
                        <p className="primaryName"> {highestSong?.name}</p></a>
                        &emsp;
                        <p className="primaryArtists">
                          {highestSong?.artists?.join(", ")}
                        </p>
                        <span
                          className="cellOutline"
                          style={{ marginLeft: "10px", fontSize: "11px" }}
                        >
                          {highestSongValue}
                        </span>
                        {/* } */}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      className="audioFeaturesColumnLabel"
                      data-tooltip-content={
                        feature !== "duration"
                          ? Math.abs(
                              highestSongValue - lowestSongValue
                            ).toFixed(2)
                          : getTimeDifference(highestSongValue, lowestSongValue)
                      }
                      data-tooltip-id="rangeTooltip"
                    >
                      <img src={range} style={{ width: "20px" }} />
                    </span>
                  </td>
                  <td>
                    {lowestSong == "-" && (
                      <div className="cellOutline">
                        <div className="noSongData">-</div>
                      </div>
                    )}
                    {lowestSong && lowestSong != "-" && (
                      <div className="cellOutline">
                        <div
                          className={`primaryImage`}
                          onClick={() =>
                            togglePlayback(`lowest-audio-${index}`)
                          }
                        >
                          <audio
                            id={`lowest-audio-${index}`}
                            src={lowestSong?.mp3}
                          ></audio>

                          <img src={lowestSong?.img} className="primaryImage" />

                          {lowestSong?.mp3 && (
                            <div
                              className={
                                isPlaying[`lowest-audio-${index}`]
                                  ? "paused"
                                  : "playing"
                              }
                            ></div>
                          )}
                        </div>
                        {/* <img
                          className="primaryImage"
                          src={lowestSong.img}
                          alt={lowestSong?.name}
                        /> */}
                          <a className="link2" href={lowestSong.url}>
                        <p className="primaryName">{lowestSong?.name}</p></a>&emsp;
                        <p className="primaryArtists">
                          {lowestSong.artists?.join(", ")}
                        </p>
                        <span
                          className="cellOutline"
                          style={{ marginLeft: "10px", fontSize: "11px" }}
                        >
                          {lowestSongValue}
                        </span>
                        {/* } */}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* data-tooltip-id="dataPageTooltip1" data-tooltip-content="Open Spotify profile" */}
        <Tooltip id="dataPageTooltip1" className="tooltip3" noArrow  clickable={"true"}/>
        <Tooltip clickable="true" id="rangeTooltip" className="tooltip3" noArrow />

        <Tooltip id="gptTooltip" className="tooltip3"noArrow clickable={"true"}>
          {/* <span className="gradient">comparify</span> */}
          <span>
            <img src={logo} style={{ width: "20px" }} />
          </span>{" "}
          &#10799; <span style={{ color: "#75ac9d" }}>ChatGPT</span>
        </Tooltip>
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Popup Window"
        style={customStyles}
        // id="imgDiv"
      >
        <div id="imgDiv" style={{ padding: "20px" }}>
          <h2 className="gptModalTitle">
            {/* {saveGptClicked ? (
              <span style={{ fontWeight: "bold" }}>comparify</span>
            ) : (
              <span className="gradient">comparify</span>
            )} */}
            <span>
              <img src={logo} style={{ width: "40px" }} />
            </span>{" "}
            &#10799; <span style={{ color: "#75ac9d" }}>ChatGPT</span>
            <br />
            <br />{" "}
            <span style={{ color: "#1e90ff" }}>
              {nameIdImgurlGenerationdate[0]}
            </span>
          </h2>
          <span className="timeRange">{selectedTimeRangeClean}</span>
          <div className="gptHaikusDiv">
            {gptLoading && (
              <div className="loadingDotsGPT">
                <div className="loadingDotsGPT--dot"></div>
                <div className="loadingDotsGPT--dot"></div>
                <div className="loadingDotsGPT--dot"></div>
              </div>
            )}

            {apiResponse && (
              <>
                <div>
                  <img
                    src={gptBtn}
                    style={{
                      width: "30px",
                      float: "left",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  />
                </div>
                <div className="gptContent" style={{ clear: "both" }}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: apiResponse.replace(/\//g, "<br></br>"),
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        {!gptLoading && (
          <>
            <div style={{ marginTop: "-30px" }}>
              <button className="closeBtn" onClick={closeModal}>
                Close
              </button>
              <button
                className="saveImg2"
                onClick={handleConvertToImage}
                title="Download image"
              >
                <img src={download} style={{ width: "10px" }}></img>
              </button>
            </div>
          </>
        )}
      </Modal>

      <Modal
        isOpen={recModalIsOpen}
        onRequestClose={closeRecModal}
        contentLabel="Popup Window"
        style={customRecModalStyles}
        className="recommendationModal"
      >
        <button className="xBtn3" onClick={closeRecModal}>
          <img src={x} style={{ width: "10px" }} alt="x" title="Close"></img>
        </button>
        <h2 className="">
          Recommendations for{" "}
          <span style={{ color: "#1e90ff" }}>
            {nameIdImgurlGenerationdate[0]}
          </span>
        </h2>
        <span className="timeRange">{selectedTimeRangeClean}</span>
        <style>{mediaQueryStyles}</style>
        <DataPageRecommendations
          safeArtistIds={
            arrays.artistIds.length <= 5
              ? [...arrays.artistIds]
              : [...arrays.artistIds]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 2)
          }
          safeGenres={
            arrays.topGenresByArtist.length <= 5
              ? [...arrays.topGenresByArtist]
              : [...arrays.topGenresByArtist]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 1)
          }
          safeTrackIds={
            arrays.songIds.length <= 5
              ? [...arrays.songIds]
              : [...arrays.songIds].sort(() => 0.5 - Math.random()).slice(0, 2)
          }
          target_acousticness={arrays.audioFeatureMeans[0]}
          target_danceability={arrays.audioFeatureMeans[1]}
          target_duration_ms={
            parseInt(arrays.audioFeatureMeans[2]?.split(":")[0]) * 60000 +
            parseInt(arrays.audioFeatureMeans[2]?.split(":")[1]) * 1000
          }
          target_energy={arrays.audioFeatureMeans[3]}
          target_instrumentalness={arrays.audioFeatureMeans[4]}
          target_liveness={arrays.audioFeatureMeans[5]}
          target_loudness={arrays.audioFeatureMeans[6]}
          target_popularity={arrays.avgSongPop}
          target_speechiness={arrays.audioFeatureMeans[7]}
          target_tempo={arrays.audioFeatureMeans[8]}
          target_valence={arrays.audioFeatureMeans[9]}
          allTopSongIds={arrays.songIds}
          exploratoryArtistIds={[...arrays.artistIds.slice(-10)]
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)}
          exploratoryGenres={[...arrays.topGenresByArtist.slice(-10)]
            .sort(() => Math.random() - 0.5)
            .slice(0, 1)}
          exploratoryTrackIds={[...arrays.songIds.slice(-10)]
            .sort(() => Math.random() - 0.5)
            .slice(0, 2)}
          user_id={nameIdImgurlGenerationdate[1]}
          display_name={nameIdImgurlGenerationdate[0]}
          selectedTimeRange={selectedTimeRangeClean}
        />

        {/* <button className="closeBtn" onClick={closeRecModal}>
          Close
        </button> */}
      </Modal>

      <AudiofeatureModal
        location={scrollPosition}
        audiofeatureForModal={
          audiofeatureForModal === "duration"
            ? "duration_ms"
            : audiofeatureForModal
        }
        songs={topSongs}
        token={token}
        isAudiofeatureModalOpen={isAudiofeatureModalOpen}
        closeAudiofeatureModal={closeAudiofeatureModal}
      />

      {/* <Footer /> */}
    </div>
  );
}

export default Data;
