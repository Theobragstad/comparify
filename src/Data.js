import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router";
import logo from "./img/logo.png";
import missingImage from "./img/missingImage.png";
import "./App.css";
import back from "./img/back.png";
import gptBtn from "./img/gptBtn.png";
import html2canvas from "html2canvas";
import Footer from "./Footer";
import { Tooltip as ReactTooltip } from "react-tooltip";
import download from "./img/download.png";
import Modal from "react-modal";
import DataPageRecommendations from "./DataPageRecommendations";

const { Configuration, OpenAIApi } = require("openai");

function Data() {
  Modal.setAppElement("#root");

  const configuration = new Configuration({
    organization: "org-K3YIyvzJixL8ZKFVjQJCKBMP",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  delete configuration.baseOptions.headers["User-Agent"];

  const openai = new OpenAIApi(configuration);
  const [apiResponse, setApiResponse] = useState("");

  const [gptLoading, setGptLoading] = useState(false);

  const handleGptSumbit = async () => {
    setGptLoading(true);
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
        temperature: 0.5,
        max_tokens: 200,
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
    const div = document.getElementById("imgDiv");
    if (div) {
      html2canvas(div, {}).then((canvas) => {
        const image = canvas.toDataURL("image/png");

        var fileName =
          "ChatGPT music analysis for " +
          nameIdImgurlGenerationdate[0] +
          ".png";
        downloadPNG(image, fileName);
      });
    }
  }

  function downloadPNG(url, filename) {
    var anchorElement = document.createElement("a");
    anchorElement.href = url;
    anchorElement.download = filename;

    anchorElement.click();
  }

  const [isOpen, setIsOpen] = useState(false);

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
      width: "25%",
      height: "fit-content",
      margin: "auto",
      borderRadius: "10px",
      outline: "none",
      padding: "20px",

      maxHeight: "90vh",
      overflowY: "scroll",
    },
  };

  const [selectedButton, setSelectedButton] = useState(1);
  const [selectedTimeRange, setSelectedTimeRange] = useState("short_term");
  const timeRanges = ["short_term", "medium_term", "long_term"];

  const [selectedTimeRangeClean, setSelectedTimeRangeClean] =
    useState("last month");
  const timeRangesClean = ["last month", "last 6 months", "all time"];

  const selectButton = (index) => {
    setSelectedButton(index);
    setSelectedTimeRange(timeRanges[index - 1]);

    setSelectedTimeRangeClean(timeRangesClean[index - 1]);

    setApiResponse("");
  };

  const location = useLocation();
  const token = location.state.token;
  const allData = location.state.data.split(",");
  const nameIdImgurlGenerationdate = allData.slice(1, 5);

  const dataStartIndex = allData.indexOf(selectedTimeRange) + 1;
  const dataEndIndex =
    selectedTimeRange === "long_term"
      ? allData.length - 1
      : allData.indexOf(timeRanges[timeRanges.indexOf(selectedTimeRange) + 1]) -
        1;

  const data = allData.slice(dataStartIndex, dataEndIndex + 1);

  const labels = [
    "songIds[<=50]",
    "mostLeastPopSongIds[<=2]",
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

  const getTopSongs = async (songIds) => {
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
        name: track.name,
        artists: track.artists.map((artist) => artist.name),
        img: track.album.images[0]?.url || missingImage,
      }));

      setTopSongs(topSongsData);
    } else {
      setTopSongs([]);
    }
    // console.log(topSongs);
  };

  const getHighestAudioFeatureSongs = async (songIds) => {
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
      }));

      setHighestAudioFeatureSongs(highestAudioFeatureSongsData);
    } else {
      setHighestAudioFeatureSongs(Array(11).fill("-"));
    }
  };

  const getLowestAudioFeatureSongs = async (songIds) => {
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
      }));

      setLowestAudioFeatureSongs(lowestAudioFeatureSongsData);
    } else {
      setLowestAudioFeatureSongs(Array(11).fill("-"));
    }
  };

  const getMostLeastPopSongs = async (songIds) => {
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
      }));

      setMostLeastPopSongs(mostLeastPopSongsData);
    } else {
      setMostLeastPopSongs([]);
    }
  };

  const getOldestNewestSongs = async (songIds) => {
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
      }));

      setOldestNewestSongs(oldestNewestSongsData);
    } else {
      setOldestNewestSongs([]);
    }
  };

  const getTopAlbums = async (albumIds) => {
    if (albumIds && albumIds.length > 0 && albumIds[0] !== "No data") {
      const maxAlbumsPerRequest = 20;
      const albumChunks = [];

      for (let i = 0; i < albumIds.length; i += maxAlbumsPerRequest) {
        albumChunks.push(albumIds.slice(i, i + maxAlbumsPerRequest));
      }

      const topAlbumData = [];

      for (const albumChunk of albumChunks) {
        const { data } = await axios.get("https://api.spotify.com/v1/albums", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: albumChunk.join(","),
          },
        });

        const chunkAlbumsData = data.albums.map((album) => ({
          name: album.name,
          artists: album.artists.map((artist) => artist.name),
          img: album.images[0]?.url || missingImage,
        }));

        topAlbumData.push(...chunkAlbumsData);
      }

      setTopAlbums(topAlbumData);
    } else {
      setTopAlbums([]);
    }
  };

  const getMostLeastPopAlbums = async (albumIds) => {
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
      }));

      setMostLeastPopAlbums(mostLeastPopAlbumsData);
    } else {
      setMostLeastPopAlbums([]);
    }
  };

  const getTopArtists = async (artistIds) => {
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
      }));

      setTopArtists(topArtistsData);
    } else {
      setTopArtists([]);
    }
  };

  const getMostLeastPopArtists = async (artistIds) => {
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
      }));

      setMostLeastPopArtists(mostLeastPopArtistsData);
    } else {
      setMostLeastPopArtists([]);
    }
  };

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
    return (
      "Youll be given some information about a persons music preferences. Your task is to generate a short, fun, and creative poem representing their music taste, in the second person. Try to incorporate most of the provided data into the poem. IMPORTANT: indicate each new line with a forward slash! ALSO VERY IMPORTANT: limit your poem to at most 70 words. The data is: Their top song is " +
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
      ". Theyve listened to music from both " +
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
      "."
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

  useEffect(() => {
    if (isTokenExpired()) {
      logout();
    }
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
  }, [selectedTimeRange]);

  const navigate = useNavigate();

  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) {
      return true;
    }
    return new Date().getTime() > parseInt(expirationTime);
  };

  const logout = () => {
    setExpirationTime("");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expirationTime");
    navigate("/");
  };

  const [expirationTime, setExpirationTime] = useState("");

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
  };

  function msToMinSec(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const [recModalIsOpen, setRecModalIsOpen] = useState(false);
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

  return (
    <div>
      <Link to="/" title="Home" style={{ display: "block" }}>
        <img className="dataPageLogo" src={logo}></img>
      </Link>

      <div>
        <div style={{ display: "inline-block", marginTop: "20px" }}>
          <span>
            <h4 style={{ display: "inline" }}>comparify data for&nbsp;</h4>
          </span>
          <a
            href={
              "https://open.spotify.com/user/" + nameIdImgurlGenerationdate[1]
            }
            style={{ textDecoration: "none" }}
            id="SpotifyProfileLink"
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

            <div
              style={{
                color: "#1e90ff",
                fontWeight: "bold",
                display: "inline",
              }}
            >
              {nameIdImgurlGenerationdate[0]}
            </div>
          </a>
          <span>
            &emsp;
            <img
              id="gptTooltip"
              onClick={openModal}
              className="zoom"
              src={gptBtn}
              style={{ width: "15px", cursor: "pointer" }}
            />
          </span>
        </div>
      </div>
      <div className="generationDateTime">Generated {generationDateTime}</div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div
          className="recommendationsBtn"
          onClick={openRecModal}
          style={{
            width: "fit-content",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "bold",
            margin: "auto",
            padding: "2px 5px",
          }}
        >
          Get music recommendations
        </div>
      </div>
      <div className="navBtnContainer">
        <div className="leftNavBtnContainer">
          <Link to="/code" title="Back">
            <button className="leftNavBtn">
              <img src={back} style={{ width: "13px" }}></img>
            </button>
          </Link>
        </div>
        <div className="navBtnOverlay">
          <button
            className={`navBtn ${selectedButton === 1 ? "selected" : ""}`}
            onClick={() => selectButton(1)}
          >
            last month
          </button>
          <button
            className={`navBtn ${selectedButton === 2 ? "selected" : ""}`}
            onClick={() => selectButton(2)}
          >
            last 6 months
          </button>
          <button
            className={`navBtn ${selectedButton === 3 ? "selected" : ""}`}
            onClick={() => selectButton(3)}
          >
            all time
          </button>
        </div>
      </div>

      <div className="card-row">
        <div className="primaryCard1">
          <div className="primaryTitle">top songs</div>
          {topSongs.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            topSongs.map((song, index) => (
              <div key={index} className="item">
                <img src={song?.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">{song.name}</span>
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
                  <span className="primaryName">
                    {artist.name ? artist.name : artist}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="primaryCard1">
          <div className="primaryTitle" id="topAlbums">
            top albums
          </div>
          {topAlbums.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            topAlbums.map((album, index) => (
              <div key={index} className="item">
                <img src={album?.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">
                    {album.name ? album.name : album}
                  </span>
                  <span className="primaryArtists">
                    {album.artists?.join(", ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="primaryCard2">
          <div className="primaryTitle" id="topGenres">
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
          <div className="primaryTitle" id="topLabels">
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
      </div>

      <div className="card-row">
        <div className="primaryCard4">
          <div className="primaryTitle">most popular song</div>
          {mostLeastPopSongs.length === 0 ? (
            <div className="noData">No data</div>
          ) : (
            mostLeastPopSongs &&
            mostLeastPopSongs[0] && (
              <div className="item">
                <img src={mostLeastPopSongs[0]?.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">
                    {mostLeastPopSongs[0]?.name}
                  </span>
                  <span className="primaryArtists">
                    {mostLeastPopSongs[0]?.artists?.join(", ")}
                  </span>
                  <span style={{ paddingLeft: "20px" }} id="popularity">
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
                <img src={mostLeastPopSongs[1]?.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">
                    {mostLeastPopSongs[1]?.name}
                  </span>
                  <span className="primaryArtists">
                    {mostLeastPopSongs[1]?.artists?.join(", ")}
                  </span>
                  <span style={{ paddingLeft: "20px" }} id="popularity">
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
                <img src={oldestNewestSongs[0]?.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">
                    {oldestNewestSongs[0]?.name}
                  </span>
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
                <img src={oldestNewestSongs[1]?.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">
                    {oldestNewestSongs[1]?.name}
                  </span>
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
                  <span className="primaryName">
                    {mostLeastPopArtists[0]?.name}
                  </span>
                  <span style={{ paddingLeft: "20px" }} id="popularity">
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
                  <span className="primaryName">
                    {mostLeastPopArtists[1]?.name}
                  </span>
                  <span style={{ paddingLeft: "20px" }} id="popularity">
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
                  <span className="primaryName">
                    {mostLeastPopAlbums[0]?.name}
                  </span>
                  <span className="primaryArtists">
                    {mostLeastPopAlbums[0]?.artists?.join(", ")}
                  </span>
                  <span style={{ paddingLeft: "20px" }} id="popularity">
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
                  <span className="primaryName">
                    {mostLeastPopAlbums[1]?.name}
                  </span>
                  <span className="primaryArtists">
                    {mostLeastPopAlbums[1]?.artists?.join(", ")}
                  </span>
                  <span style={{ paddingLeft: "20px" }} id="popularity">
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
                <span className="primaryName2">{arrays.avgSongPop}</span>
              </div>
            </div>
          )}
        </div>

        <div className="primaryCard4">
          <div className="primaryTitle">song popularity standard deviation</div>
          {arrays.songPopStdDev && (
            <div className="item">
              <div className="primaryText">
                <span className="primaryName2" id="stdDev">
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
                <span className="primaryName2" id="stdDev">
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
                <span className="primaryName2">{arrays.avgAlbumPop}</span>
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
                <span className="primaryName2" id="stdDev">
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
                <span className="primaryName2">{arrays.avgArtistPop}</span>
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
                <span className="primaryName2" id="stdDev">
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
                <span className="primaryName2" id="stdDev">
                  {arrays.artistFollsStdDev}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="audioFeaturesHeader">audio features</div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{ textAlign: "left", wordWrap: "break-word" }}>
                <div style={{ maxWidth: "140px", margin: "0 auto" }}>
                  <span style={{ fontSize: "10px" }}>
                    &#9432;&ensp;You can hover over select labels for more
                    information.
                  </span>
                </div>
              </th>

              <th>
                <span className="audioFeaturesColumnLabel">average</span>
              </th>
              <th id="stdDev">
                <span className="audioFeaturesColumnLabel">
                  standard deviation
                </span>
              </th>
              <th>
                <span className="audioFeaturesColumnLabel">
                  song with highest value
                </span>
              </th>
              <th>
                <span className="audioFeaturesColumnLabel">
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
                  <td id={feature}>
                    <span className="audioFeaturesColumnLabel">{feature}</span>
                  </td>

                  <td>
                    <div
                      className="cellOutline"
                      style={
                        twoAudioFeaturesLowestAvgs.includes(feature) &&
                        !twoAudioFeaturesHighestAvgs.includes(feature) &&
                        arrays.audioFeatureMeans[index] !== "-"
                          ? {
                              border: "1px solid #ff0000",
                              backgroundColor: "#ffeded",
                              color: "#ff0000",
                            }
                          : twoAudioFeaturesHighestAvgs.includes(feature) &&
                            !twoAudioFeaturesLowestAvgs.includes(feature) &&
                            arrays.audioFeatureMeans[index] !== "-"
                          ? {
                              border: "1px solid #17d475",
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
                    <div className="cellOutline">
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
                        <img
                          className="primaryImage"
                          src={highestSong?.img}
                          alt={""}
                        />
                        <p className="primaryName"> {highestSong?.name}</p>
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
                    {lowestSong == "-" && (
                      <div className="cellOutline">
                        <div className="noSongData">-</div>
                      </div>
                    )}
                    {lowestSong && lowestSong != "-" && (
                      <div className="cellOutline">
                        <img
                          className="primaryImage"
                          src={lowestSong.img}
                          alt={lowestSong?.name}
                        />
                        <p className="primaryName">{lowestSong?.name}</p>&emsp;
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

        <ReactTooltip
          anchorSelect="#topAlbums"
          html={"based on frequency of occurences in top songs."}
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "25px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>

        <ReactTooltip
          anchorSelect="#topGenres"
          html={"based on frequency of occurences in top artists."}
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "25px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>

        <ReactTooltip
          anchorSelect="#topLabels"
          html={"based on frequency of occurences in top songs."}
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "25px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>

        <ReactTooltip
          anchorSelect="#popularity"
          html={"0-100. assigned by Spotify and updated based on current data."}
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "25px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>

        <ReactTooltip
          anchorSelect="#stdDev"
          html={
            "a larger value indicates more variability, while a smaller value indicates less, on average."
          }
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "25px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>

        <ReactTooltip
          anchorSelect="#acousticness"
          html={
            "A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic."
          }
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>
        <ReactTooltip
          anchorSelect="#danceability"
          html={
            "Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable."
          }
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>
        <ReactTooltip
          anchorSelect="#energy"
          html={
            "Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy."
          }
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>
        <ReactTooltip
          anchorSelect="#instrumentalness"
          html={`Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.`}
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>
        <ReactTooltip
          anchorSelect="#liveness"
          html={
            "Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live."
          }
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>
        <ReactTooltip
          anchorSelect="#loudness"
          html={
            "The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db."
          }
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>
        <ReactTooltip
          anchorSelect="#speechiness"
          html={
            "Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks."
          }
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>
        <ReactTooltip
          anchorSelect="#tempo"
          html={
            "The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration."
          }
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>
        <ReactTooltip
          anchorSelect="#valence"
          html={
            "A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
          }
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "200px",
          }}
          clickable={"true"}
        ></ReactTooltip>

        <ReactTooltip
          anchorSelect="#gptTooltip"
          html={"ChatGPT"}
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "fit-content",
          }}
          clickable={"true"}
        ></ReactTooltip>

        <ReactTooltip
          anchorSelect="#SpotifyProfileLink"
          html={"Open Spotify profile"}
          style={{
            fontSize: 12,
            pointerEvents: "auto !important",
            fontWeight: "bold",
            borderRadius: "10px",
            zIndex: "2",
            wordBreak: "break-word",
            width: "fit-content",
          }}
          clickable={"true"}
        ></ReactTooltip>
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
            <img
              src={gptBtn}
              style={{ width: "40px", marginRight: "10px" }}
            ></img>
            ChatGPT music analysis for{" "}
            <span style={{ color: "#1e90ff" }}>
              {nameIdImgurlGenerationdate[0]}
            </span>
          </h2>
          <span className="timeRange">{selectedTimeRangeClean}</span>
          <div className="gptHaikusDiv">
            {gptLoading && (
              <div className="loadingDots">
                <div className="loadingDots--dot"></div>
                <div className="loadingDots--dot"></div>
                <div className="loadingDots--dot"></div>
              </div>
            )}
            {apiResponse && (
              <div className="gptContent">
                <div
                  dangerouslySetInnerHTML={{
                    __html: apiResponse.replace(/\//g, "<br></br>"),
                  }}
                />
              </div>
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
        style={customStyles}
      >
        <h2 className="">
          Music recommendations for{" "}
          <span style={{ color: "#1e90ff" }}>
            {nameIdImgurlGenerationdate[0]}
          </span>
        </h2>
        <span className="timeRange">{selectedTimeRangeClean}</span>
        <DataPageRecommendations
          safeArtistIds={arrays.artistIds[0]}
          exploratoryArtistIds={arrays.artistIds[49]}
        />

        <button className="closeBtn" onClick={closeRecModal}>
          Close
        </button>
      </Modal>

      <Footer />
    </div>
  );
}

export default Data;
