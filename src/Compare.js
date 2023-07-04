import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router";
import logo from "./img/logo.png";
import missingImage from "./img/missingImage.png";
import "./App.css";
import Big from "big.js";
import back from "./img/back.png";
import ScrollButton from "./ScrollButton";
import logoAlt from "./img/logoAlt.png";
import finishSound from "./finished.mp3"


import { PieChart, Pie, Cell, Legend } from "recharts";

import download from "./img/download.png";
import Footer from "./Footer";
import Game from "./Game";

import ComparePageRecommendations from "./ComparePageRecommendations";

import html2canvas from "html2canvas";
import gptBtn from "./img/gptBtn.png";

import Modal from "react-modal";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useGameModalState } from "./GameModalState";

const { Configuration, OpenAIApi } = require("openai");

function Compare() {

  document.title = "comparify - Results";

  const gameModalState = useGameModalState();

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 850);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check on component mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const location = useLocation();

  let file1 = location.state.file1.split(",");
  let file2 = location.state.file2.split(",");

  const token = location.state.token;

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
  };

  const navigate = useNavigate();

  const nameIdImgurlGenerationdate1 = file1.slice(1, 5);
  const nameIdImgurlGenerationdate2 = file2.slice(1, 5);
  if (
    file1.indexOf("nameIdImgurlGenerationdate[4]") === -1 ||
    file2.indexOf("nameIdImgurlGenerationdate[4]") === -1 ||
    nameIdImgurlGenerationdate1.length !== 4 ||
    nameIdImgurlGenerationdate2.length !== 4 ||
    nameIdImgurlGenerationdate1[2].substring(0, 8) !== "https://" ||
    nameIdImgurlGenerationdate2[2].substring(0, 8) !== "https://"
  ) {
    navigate("/code", { state: { error: 400 } });
  }

  const file1StartIndex = file1.indexOf(selectedTimeRange) + 1;
  const file1EndIndex =
    selectedTimeRange === "long_term"
      ? file1.length - 1
      : file1.indexOf(timeRanges[timeRanges.indexOf(selectedTimeRange) + 1]) -
        1;

  const file2StartIndex = file2.indexOf(selectedTimeRange) + 1;
  const file2EndIndex =
    selectedTimeRange === "long_term"
      ? file2.length - 1
      : file2.indexOf(timeRanges[timeRanges.indexOf(selectedTimeRange) + 1]) -
        1;

  const data1 = file1.slice(file1StartIndex, file1EndIndex + 1);
  const data2 = file2.slice(file2StartIndex, file2EndIndex + 1);

  const labels = [
    "songIds[<=50]",
    "mostLeastPopSongIds[<=2]",
    "decadesAndPcts[]",
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

  const arrays1 = {
    songIds: [],
    mostLeastPopSongIds: [],
    decadesAndPcts: [],
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

  const arrays2 = {
    songIds: [],
    mostLeastPopSongIds: [],
    decadesAndPcts: [],
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

  function countOccurrences(arr, searchString) {
    return arr.reduce(function (count, element) {
      if (typeof element === "string" && element.includes(searchString)) {
        count++;
      }
      return count;
    }, 0);
  }

  for (let i = 0; i < labels.length; i++) {
    if (
      countOccurrences(data1, labels[i]) !== 1 ||
      countOccurrences(data2, labels[i]) !== 1
    ) {
      navigate("/code", { state: { error: 400 } });
    }
  }

  for (let i = 0; i < labels.length - 1; i++) {
    const startIndex = data1.indexOf(labels[i]) + 1;
    const endIndex = data1.indexOf(labels[i + 1]);

    const key = labels[i].substring(0, labels[i].indexOf("["));
    arrays1[key] = data1.slice(startIndex, endIndex);
  }

  arrays1.topGenresByArtist = data1.slice(
    data1.indexOf("topGenresByArtist[<=20]") + 1
  );

  for (let i = 0; i < labels.length - 1; i++) {
    const startIndex = data2.indexOf(labels[i]) + 1;
    const endIndex = data2.indexOf(labels[i + 1]);

    const key = labels[i].substring(0, labels[i].indexOf("["));
    arrays2[key] = data2.slice(startIndex, endIndex);
  }

  arrays2.topGenresByArtist = data2.slice(
    data2.indexOf("topGenresByArtist[<=20]") + 1
  );

  let entryCount1 = 0;
  let entryCount2 = 0;

  for (const key in arrays1) {
    if (
      Array.isArray(arrays1[key]) &&
      key !== "avgSongAgeYrMo" &&
      key !== "songAgeStdDevYrMo"
    ) {
      entryCount1 += arrays1[key].length;
    } else {
      entryCount1++;
    }
  }

  for (const key in arrays2) {
    if (
      Array.isArray(arrays2[key]) &&
      key !== "avgSongAgeYrMo" &&
      key !== "songAgeStdDevYrMo"
    ) {
      entryCount2 += arrays2[key].length;
    } else {
      entryCount2++;
    }
  }

  function simplifyNumber(number) {
    const abbreviations = {
      K: 1000,
      M: 1000000,
      B: 1000000000,
    };

    let simplifiedNumber = number;

    if (number >= 1000) {
      const keys = Object.keys(abbreviations);
      for (let i = keys.length - 1; i >= 0; i--) {
        const abbreviation = keys[i];
        const value = abbreviations[abbreviation];
        if (number >= value) {
          simplifiedNumber = (number / value).toFixed(1) + abbreviation;
          break;
        }
      }
    }

    return simplifiedNumber;
  }

  function getMonthDifference(date1, date2) {
    const [year1, month1] = date1.map(Number);
    const [year2, month2] = date2.map(Number);

    const totalMonths1 = year1 * 12 + month1;
    const totalMonths2 = year2 * 12 + month2;

    const diffMonths = Math.abs(totalMonths2 - totalMonths1);

    const diffYears = Math.floor(diffMonths / 12);
    const diffRemainingMonths = diffMonths % 12;

    return [diffYears.toString(), diffRemainingMonths.toString()];
  }

  function getAbsDiffMinSec(minSec1, minSec2) {
    const [minutes1, seconds1] = minSec1.split(":").map(Number);
    const [minutes2, seconds2] = minSec2.split(":").map(Number);

    const diffMinutes = Math.abs(minutes1 - minutes2);
    const diffSeconds = Math.abs(seconds1 - seconds2);

    return `${diffMinutes}:${diffSeconds.toString().padStart(2, "0")}`;
  }

  function getDifferenceSimplified(number1, number2) {
    const abbreviations = {
      K: 1000,
      M: 1000000,
      B: 1000000000,
    };

    const regex = /^(\d+(\.\d+)?)([KMB])$/;

    const matches1 = number1.match(regex);
    const matches2 = number2.match(regex);

    if (matches1 && matches2) {
      const value1 = parseFloat(matches1[1]) * abbreviations[matches1[3]];
      const value2 = parseFloat(matches2[1]) * abbreviations[matches2[3]];

      const difference = value2 - value1;

      return simplifyNumber(Math.abs(difference));
    }

    let numericDiff;
    if (matches1) {
      const value1 = parseFloat(matches1[1]) * abbreviations[matches1[3]];
      numericDiff = parseFloat(number2) - value1;
    } else if (matches2) {
      const value2 = parseFloat(matches2[1]) * abbreviations[matches2[3]];
      numericDiff = value2 - parseFloat(number1);
    } else {
      numericDiff = parseFloat(number2) - parseFloat(number1);
    }

    return simplifyNumber(Math.abs(numericDiff));
  }

  const overlappingData = {};

  for (const field in arrays1) {
    if (arrays1.hasOwnProperty(field) && arrays2.hasOwnProperty(field)) {
      if (field === "decadesAndPcts") {
      }
      if (
        field === "avgSongPop" ||
        field === "songPopStdDev" ||
        field === "pctSongsExpl" ||
        field === "avgAlbumPop" ||
        field === "albumPopsStdDev" ||
        field === "avgArtistPop" ||
        field === "artistPopStdDev"
      ) {
        overlappingData[field] = Math.abs(
          arrays1[field] - arrays2[field]
        ).toFixed(2);
      } else if (field === "avgSongAgeYrMo" || field === "songAgeStdDevYrMo") {
        overlappingData[field] = getMonthDifference(
          arrays1[field],
          arrays2[field]
        );
      } else if (field === "avgArtistFolls" || field === "artistFollsStdDev") {
        overlappingData[field] = getDifferenceSimplified(
          arrays1[field][0],
          arrays2[field][0]
        );
      } else if (
        field === "audioFeatureMeans" ||
        field === "audioFeatureStdDevs"
      ) {
        const array1 = arrays1[field];
        const array2 = arrays2[field];

        const overlappingArray = [];
        for (let i = 0; i < array1.length; i++) {
          if (i !== 2) {
            overlappingArray.push(
              Math.abs(parseFloat(array1[i]) - parseFloat(array2[i])).toFixed(2)
            );
          } else {
            overlappingArray.push(getAbsDiffMinSec(array1[i], array2[i]));
          }
        }
        overlappingData[field] = overlappingArray;
      } else if (field === "mostLeastPopSongIds") {
        const overlappingArray = [];
        if (arrays1.mostLeastPopSongIds[0] === arrays2.mostLeastPopSongIds[0]) {
          overlappingArray.push(arrays1.mostLeastPopSongIds[0]);
        } else {
          overlappingArray.push("");
        }

        if (arrays1.mostLeastPopSongIds[1] === arrays2.mostLeastPopSongIds[1]) {
          overlappingArray.push(arrays1.mostLeastPopSongIds[1]);
        } else {
          overlappingArray.push("");
        }

        overlappingData[field] = overlappingArray;
      } else if (field === "oldestNewestSongIds") {
        const overlappingArray = [];
        if (arrays1.oldestNewestSongIds[0] === arrays2.oldestNewestSongIds[0]) {
          overlappingArray.push(arrays1.oldestNewestSongIds[0]);
        } else {
          overlappingArray.push("");
        }

        if (arrays1.oldestNewestSongIds[1] === arrays2.oldestNewestSongIds[1]) {
          overlappingArray.push(arrays1.oldestNewestSongIds[1]);
        } else {
          overlappingArray.push("");
        }

        overlappingData[field] = overlappingArray;
      } else if (field === "mostLeastPopSongIds") {
        const overlappingArray = [];
        if (
          arrays1.mostLeastPopArtistIds[0] === arrays2.mostLeastPopArtistIds[0]
        ) {
          overlappingArray.push(arrays1.mostLeastPopArtistIds[0]);
        } else {
          overlappingArray.push("");
        }

        if (
          arrays1.mostLeastPopArtistIds[1] === arrays2.mostLeastPopArtistIds[1]
        ) {
          overlappingArray.push(arrays1.mostLeastPopArtistIds[1]);
        } else {
          overlappingArray.push("");
        }

        overlappingData[field] = overlappingArray;
      } else if (
        field === "highestAudioFeatureSongIds" ||
        field === "lowestAudioFeatureSongIds"
      ) {
        overlappingData[field] = findOverlappingElements(
          arrays1[field],
          arrays2[field]
        );
      } else {
        overlappingData[field] = arrays1[field].filter((value) =>
          arrays2[field].includes(value)
        );
      }
    }
  }

  function findOverlappingElements(arr1, arr2) {
    let overlapping = [];
    for (let i = 0; i < arr1.length; i++) {
      if (arr2.includes(arr1[i])) {
        overlapping.push(arr1[i]);
      } else {
        overlapping.push("");
      }
    }
    return overlapping;
  }

  function replaceNaNWithDash(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (isNaN(value[i])) {
              value[i] = "-";
            }
          }
        } else if (isNaN(value)) {
          obj[key] = "-";
        }
      }
    }
  }

  function calculateDurationSimilarity(duration1, duration2) {
    const [min1, sec1] = duration1.split(":").map(Number);
    const [min2, sec2] = duration2.split(":").map(Number);

    const durationInSeconds1 = min1 * 60 + sec1;
    const durationInSeconds2 = min2 * 60 + sec2;

    const differenceInSeconds = Math.abs(
      durationInSeconds1 - durationInSeconds2
    );

    const similarity =
      1 -
      differenceInSeconds / Math.max(durationInSeconds1, durationInSeconds2);

    return similarity;
  }

  function calculateDateSimilarity(date1, date2) {
    var months1 = date1[0] * 12 + date1[1];
    var months2 = date2[0] * 12 + date2[1];

    var difference = Math.abs(months1 - months2);
    var maxDifference = Math.max(months1, months2);

    var similarity = 1 - difference / maxDifference;
    return similarity;
  }

  function calculateSimilarity(number1, number2, threshold) {
    var difference = Math.abs(number1 - number2);
    if (difference === 0) {
      return 1;
    } else if (difference <= threshold) {
      return 1 - difference / threshold;
    } else {
      return 0;
    }
  }

  function calculateSimilarityBig(number1, number2, threshold) {
    const bigNumber1 = new Big(number1);
    const bigNumber2 = new Big(number2);

    const difference = bigNumber1.minus(bigNumber2).abs();

    if (difference.eq(0)) {
      return 1;
    } else if (difference.lte(threshold)) {
      const similarity = new Big(1).minus(difference.div(threshold));
      return similarity.toNumber();
    } else {
      return 0;
    }
  }

  function sumObjectElements(obj) {
    let sum = 0;

    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          if (typeof obj[key][i] === "number") {
            sum += obj[key][i];
          }
        }
      } else if (typeof obj[key] === "number") {
        sum += obj[key];
      }
    }

    return sum;
  }

  function compareFollowerCounts(number1, number2) {
    const abbreviations = {
      K: 1000,
      M: 1000000,
      B: 1000000000,
    };

    const [value1, abbreviation1] =
      extractFollowerCountValueAndAbbreviation(number1);
    const [value2, abbreviation2] =
      extractFollowerCountValueAndAbbreviation(number2);

    if (abbreviation1 !== abbreviation2) {
      return 0;
    }

    const fullValue1 = value1 * abbreviations[abbreviation1];
    const fullValue2 = value2 * abbreviations[abbreviation2];

    const similarity =
      1 - Math.abs(fullValue1 - fullValue2) / Math.max(fullValue1, fullValue2);
    return similarity;
  }

  function extractFollowerCountValueAndAbbreviation(number) {
    const value = parseFloat(number);
    const abbreviation = number.slice(-1);
    return [value, abbreviation];
  }

  function calculateSimilarity(number1, number2) {
    var difference = Math.abs(number1 - number2);
    var maxDifference = Math.max(number1, number2);
    var similarity = 1 - difference / maxDifference;
    return similarity;
  }

  const similarities = {};

  for (const field in arrays1) {
    if (arrays1.hasOwnProperty(field) && arrays2.hasOwnProperty(field)) {
      if (
        field === "audioFeatureMeans" ||
        field === "audioFeatureStdDevs" ||
        field === "avgSongAgeYrMo" ||
        field === "songAgeStdDevYrMo"
      ) {
        if (arrays1[field].every((element) => element === "-")) {
          similarities[field] = Array(arrays1[field].length).fill("-");
          continue;
        } else if (arrays2[field].every((element) => element === "-")) {
          similarities[field] = Array(arrays2[field].length).fill("-");
          continue;
        }
      }
      if (arrays1[field] == "-" || arrays2[field] == "-") {
        similarities[field] = "-";
        continue;
      }
      if (
        field === "avgSongPop" ||
        field === "songPopStdDev" ||
        field === "pctSongsExpl" ||
        field === "avgAlbumPop" ||
        field === "albumPopsStdDev" ||
        field === "avgArtistPop" ||
        field === "artistPopStdDev"
      ) {
        similarities[field] = calculateSimilarity(
          parseFloat(arrays1[field]),
          parseFloat(arrays2[field])
        );
      } else if (field === "avgSongAgeYrMo" || field === "songAgeStdDevYrMo") {
        similarities[field] = calculateDateSimilarity(
          arrays1[field],
          arrays2[field]
        );
      } else if (field === "avgArtistFolls" || field === "artistFollsStdDev") {
        similarities[field] = compareFollowerCounts(
          arrays1[field].toString(),
          arrays2[field].toString()
        );
      } else if (field === "audioFeatureMeans") {
        const array1 = arrays1[field];
        const array2 = arrays2[field];

        const similarityArray = [];
        for (let i = 0; i < array1.length; i++) {
          if (i !== 2) {
            similarityArray.push(
              calculateSimilarity(parseFloat(array1[i]), parseFloat(array2[i]))
            );
          } else {
            similarityArray.push(
              calculateDurationSimilarity(array1[i], array2[i])
            );
          }
        }
        similarities[field] = similarityArray;
      } else if (field === "audioFeatureStdDevs") {
        const array1 = arrays1[field];
        const array2 = arrays2[field];

        const similarityArray = [];
        for (let i = 0; i < array1.length; i++) {
          if (i !== 2) {
            similarityArray.push(
              calculateSimilarity(parseFloat(array1[i]), parseFloat(array2[i]))
            );
          } else {
            similarityArray.push(
              calculateDurationSimilarity(array1[i], array2[i])
            );
          }
        }
        similarities[field] = similarityArray;
      }
    }
  }

  let similaritiesCount = sumObjectElements(similarities);

  for (const key in overlappingData) {
    if (
      key !== "avgSongPop" &&
      key !== "songPopStdDev" &&
      key !== "avgSongAgeYrMo" &&
      key !== "songAgeStdDevYrMo" &&
      key !== "pctSongsExpl" &&
      key !== "audioFeatureMeans" &&
      key !== "audioFeatureStdDevs" &&
      key !== "avgAlbumPop" &&
      key !== "albumPopsStdDev" &&
      key !== "avgArtistPop" &&
      key !== "artistPopStdDev" &&
      key !== "avgArtistFolls" &&
      key !== "artistFollsStdDev"
    ) {
      similaritiesCount += overlappingData[key].filter(
        (entry) => entry !== "" && entry !== "No data"
      ).length;
    }
  }

  const similarityPct =
    (similaritiesCount / (0.5 * (entryCount1 + entryCount2))) * 100;

  const getSongs = async (songIds, arrayToSet) => {
    try {
      if (songIds.length > 0 && songIds && songIds[0] !== "No data") {
        const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: songIds.join(","),
          },
        });

        const songsData = data.tracks.map((track) => ({
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          img: track.album.images[0]?.url || missingImage,
          mp3: track.preview_url || null,
          url: track.external_urls.spotify,
        }));

        arrayToSet(songsData);
      } else {
        arrayToSet([]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
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
  const [expirationTime, setExpirationTime] = useState("");

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

  const getHighestAudioFeatureSongs = async (songIds, arrayToSet) => {
    try {
      const validSongIds = songIds.filter((id) => id !== "");
      if (validSongIds.length === 0 || (songIds && songIds[0] == "No data")) {
        arrayToSet(new Array(songIds.length).fill(""));
        return;
      }

      const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ids: validSongIds.join(","),
        },
      });

      const highestAudioFeatureSongsData = data.tracks.map((track) => ({
        name: track.name,
        artists: track.artists.map((artist) => artist.name),
        img: track.album.images[0]?.url || missingImage,
      }));

      const valuesToSet = [];

      let index = 0;
      songIds.forEach((id) => {
        if (id !== "") {
          valuesToSet.push(highestAudioFeatureSongsData[index]);
          index++;
        } else {
          valuesToSet.push("");
        }
      });

      arrayToSet(valuesToSet);
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getLowestAudioFeatureSongs = async (songIds, arrayToSet) => {
    try {
      const validSongIds = songIds.filter((id) => id !== "");
      if (validSongIds.length === 0 || (songIds && songIds[0] == "No data")) {
        arrayToSet(new Array(songIds.length).fill(""));
        return;
      }

      const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ids: validSongIds.join(","),
        },
      });

      const lowestAudioFeatureSongsData = data.tracks.map((track) => ({
        name: track.name,
        artists: track.artists.map((artist) => artist.name),
        img: track.album.images[0]?.url || missingImage,
      }));

      const valuesToSet = [];

      let index = 0;
      songIds.forEach((id) => {
        if (id !== "") {
          valuesToSet.push(lowestAudioFeatureSongsData[index]);
          index++;
        } else {
          valuesToSet.push("");
        }
      });

      arrayToSet(valuesToSet);
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getMostLeastPopSongs = async (songIds, arrayToSet) => {
    try {
      // console.log(songIds);
      if (
        songIds.length == 0 ||
        (songIds && songIds.length > 0 && songIds[0] == "No data") ||
        (songIds[0] == "" && songIds[1] == "")
      ) {
        arrayToSet(["", ""]);
        return;
      }

      let ids = songIds.join(",");
      let indices = "01";
      if (songIds[0] == "") {
        ids = songIds[1];
        indices = "1";
      } else if (songIds[1] == "") {
        ids = songIds[0];
        indices = "0";
      }

      const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ids: ids,
        },
      });

      const mostLeastPopSongsData = data.tracks.map((track) => ({
        name: track.name,
        pop: track.popularity,
        artists: track.artists.map((artist) => artist.name),
        img: track.album.images[0]?.url || missingImage,
      }));

      if (indices == "01") {
        arrayToSet(mostLeastPopSongsData);
      } else if (indices == "1") {
        arrayToSet(["", mostLeastPopSongsData[0]]);
      } else if (indices == "0") {
        arrayToSet([mostLeastPopSongsData[0], ""]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getOldestNewestSongs = async (songIds, arrayToSet) => {
    try {
      if (
        songIds.length == 0 ||
        (songIds && songIds.length > 0 && songIds[0] == "No data") ||
        (songIds[0] == "" && songIds[1] == "")
      ) {
        arrayToSet(["", ""]);
        return;
      }

      let ids = songIds.join(",");
      let indices = "01";
      if (songIds[0] == "") {
        ids = songIds[1];
        indices = "1";
      } else if (songIds[1] == "") {
        ids = songIds[0];
        indices = "0";
      }

      const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ids: ids,
        },
      });

      const oldestNewestSongsData = data.tracks.map((track) => ({
        name: track.name,
        date: track.album.release_date,
        artists: track.artists.map((artist) => artist.name),
        img: track.album.images[0]?.url || missingImage,
      }));

      if (indices == "01") {
        arrayToSet(oldestNewestSongsData);
      } else if (indices == "1") {
        arrayToSet(["", oldestNewestSongsData[0]]);
      } else if (indices == "0") {
        arrayToSet([oldestNewestSongsData[0], ""]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getAlbums = async (albumIds, arrayToSet) => {
    try {
      if (albumIds.length > 0 && albumIds && albumIds[0] !== "No data") {
        const maxAlbumsPerRequest = 20;
        const albumChunks = [];

        for (let i = 0; i < albumIds.length; i += maxAlbumsPerRequest) {
          albumChunks.push(albumIds.slice(i, i + maxAlbumsPerRequest));
        }

        const albumData = [];

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
          }));

          albumData.push(...chunkAlbumsData);
        }

        arrayToSet(albumData);
      } else {
        arrayToSet([]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getMostLeastPopAlbums = async (albumIds, arrayToSet) => {
    try {
      if (
        albumIds.length == 0 ||
        (albumIds && albumIds.length > 0 && albumIds[0] == "No data") ||
        (albumIds[0] == "" && albumIds[1] == "")
      ) {
        arrayToSet(["", ""]);
        return;
      }

      let ids = albumIds.join(",");
      let indices = "01";
      if (albumIds[0] == "") {
        ids = albumIds[1];
        indices = "1";
      } else if (albumIds[1] == "") {
        ids = albumIds[0];
        indices = "0";
      }

      const { data } = await axios.get("https://api.spotify.com/v1/albums", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ids: ids,
        },
      });

      const mostLeastPopAlbumsData = data.albums.map((album) => ({
        name: album.name,
        pop: album.popularity,
        artists: album.artists.map((artist) => artist.name),
        img: album.images[0]?.url || missingImage,
      }));

      if (indices == "01") {
        arrayToSet(mostLeastPopAlbumsData);
      } else if (indices == "1") {
        arrayToSet(["", mostLeastPopAlbumsData[0]]);
      } else if (indices == "0") {
        arrayToSet([mostLeastPopAlbumsData[0], ""]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getArtists = async (artistIds, arrayToSet) => {
    try {
      if (artistIds.length > 0 && artistIds[0] !== "No data") {
        const { data } = await axios.get("https://api.spotify.com/v1/artists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: artistIds.join(","),
          },
        });

        const artistData = data.artists.map((artist) => ({
          name: artist.name,
          img: artist.images[0]?.url || missingImage,
        }));

        arrayToSet(artistData);
      } else {
        arrayToSet([]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getMostLeastPopArtists = async (artistIds, arrayToSet) => {
    try {
      if (
        artistIds.length == 0 ||
        (artistIds && artistIds.length > 0 && artistIds[0] == "No data") ||
        (artistIds[0] == "" && artistIds[1] == "")
      ) {
        arrayToSet(["", ""]);
        return;
      }

      let ids = artistIds.join(",");
      let indices = "01";
      if (artistIds[0] == "") {
        ids = artistIds[1];
        indices = "1";
      } else if (artistIds[1] == "") {
        ids = artistIds[0];
        indices = "0";
      }

      const { data } = await axios.get("https://api.spotify.com/v1/artists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ids: ids,
        },
      });

      const mostLeastPopArtistsData = data.artists.map((artist) => ({
        name: artist.name,
        pop: artist.popularity,
        img: artist.images[0]?.url || missingImage,
      }));

      if (indices == "01") {
        arrayToSet(mostLeastPopArtistsData);
      } else if (indices == "1") {
        arrayToSet(["", mostLeastPopArtistsData[0]]);
      } else if (indices == "0") {
        arrayToSet([mostLeastPopArtistsData[0], ""]);
      }
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  function handleConvertToImage() {
    const div = document.getElementById("imgDiv");
    if (div) {
      html2canvas(div, {}).then((canvas) => {
        const image = canvas.toDataURL("image/png");
        console.log(image, "image");

        var fileName =
          "comparify score for " +
          nameIdImgurlGenerationdate1[0].replace(/\./g, "") +
          " vs. " +
          nameIdImgurlGenerationdate2[0].replace(/\./g, "") +
          ".png";
        downloadPNG(image, fileName);
      });
    }
  }

  function handleConvertToImageGPT() {
    const div = document.getElementById("gptImgDiv");
    if (div) {
      html2canvas(div, {}).then((canvas) => {
        const image = canvas.toDataURL("image/png");

        var fileName =
          "ChatGPT music analysis for " +
          nameIdImgurlGenerationdate1[0].replace(/\./g, "") +
          " vs. " +
          nameIdImgurlGenerationdate2[0].replace(/\./g, "") +
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

  const [sharedTopSongs, setSharedTopSongs] = useState([]);
  const [user1TopSongs, setUser1TopSongs] = useState([]);
  const [user2TopSongs, setUser2TopSongs] = useState([]);

  const [sharedTopArtists, setSharedTopArtists] = useState([]);
  const [user1TopArtists, setUser1TopArtists] = useState([]);
  const [user2TopArtists, setUser2TopArtists] = useState([]);

  const [sharedTopAlbums, setSharedTopAlbums] = useState([]);
  const [user1TopAlbums, setUser1TopAlbums] = useState([]);
  const [user2TopAlbums, setUser2TopAlbums] = useState([]);

  const [sharedMostLeastPopSongs, setSharedMostLeastPopSongs] = useState([]);
  const [user1MostLeastPopSongs, setUser1MostLeastPopSongs] = useState([]);
  const [user2MostLeastPopSongs, setUser2MostLeastPopSongs] = useState([]);

  const [sharedOldestNewestSongs, setSharedOldestNewestSongs] = useState([]);
  const [user1OldestNewestSongs, setUser1OldestNewestSongs] = useState([]);
  const [user2OldestNewestSongs, setUser2OldestNewestSongs] = useState([]);

  const [sharedMostLeastPopAlbums, setSharedMostLeastPopAlbums] = useState([]);
  const [user1MostLeastPopAlbums, setUser1MostLeastPopAlbums] = useState([]);
  const [user2MostLeastPopAlbums, setUser2MostLeastPopAlbums] = useState([]);

  const [sharedHighestAudioFeatureSongs, setSharedHighestAudioFeatureSongs] =
    useState([]);
  const [user1HighestAudioFeatureSongs, setUser1HighestAudioFeatureSongs] =
    useState([]);
  const [user2HighestAudioFeatureSongs, setUser2HighestAudioFeatureSongs] =
    useState([]);

  const [sharedLowestAudioFeatureSongs, setSharedLowestAudioFeatureSongs] =
    useState([]);
  const [user1LowestAudioFeatureSongs, setUser1LowestAudioFeatureSongs] =
    useState([]);
  const [user2LowestAudioFeatureSongs, setUser2LowestAudioFeatureSongs] =
    useState([]);

  const [sharedMostLeastPopArtists, setSharedMostLeastPopArtists] = useState(
    []
  );
  const [user1MostLeastPopArtists, setUser1MostLeastPopArtists] = useState([]);
  const [user2MostLeastPopArtists, setUser2MostLeastPopArtists] = useState([]);

  useEffect(() => {
    // console.log(overlappingData.songIds);
    getSongs(overlappingData.songIds, setSharedTopSongs);
    getSongs(
      arrays1.songIds.filter((item) => !overlappingData.songIds.includes(item)),
      setUser1TopSongs
    );
    getSongs(
      arrays2.songIds.filter((item) => !overlappingData.songIds.includes(item)),
      setUser2TopSongs
    );

    getHighestAudioFeatureSongs(
      overlappingData.highestAudioFeatureSongIds,
      setSharedHighestAudioFeatureSongs
    );
    getHighestAudioFeatureSongs(
      arrays1.highestAudioFeatureSongIds,
      setUser1HighestAudioFeatureSongs
    );
    getHighestAudioFeatureSongs(
      arrays2.highestAudioFeatureSongIds,
      setUser2HighestAudioFeatureSongs
    );

    getAudioFeatureValues(
      overlappingData.highestAudioFeatureSongIds,
      setSharedHighestAudioFeatureValues
    );
    getAudioFeatureValues(
      arrays1.highestAudioFeatureSongIds,
      setUser1HighestAudioFeatureValues
    );
    getAudioFeatureValues(
      arrays2.highestAudioFeatureSongIds,
      setUser2HighestAudioFeatureValues
    );

    getLowestAudioFeatureSongs(
      overlappingData.lowestAudioFeatureSongIds,
      setSharedLowestAudioFeatureSongs
    );
    getLowestAudioFeatureSongs(
      arrays1.lowestAudioFeatureSongIds,
      setUser1LowestAudioFeatureSongs
    );
    getLowestAudioFeatureSongs(
      arrays2.lowestAudioFeatureSongIds,
      setUser2LowestAudioFeatureSongs
    );

    getAudioFeatureValues(
      overlappingData.lowestAudioFeatureSongIds,
      setSharedLowestAudioFeatureValues
    );
    getAudioFeatureValues(
      arrays1.lowestAudioFeatureSongIds,
      setUser1LowestAudioFeatureValues
    );
    getAudioFeatureValues(
      arrays2.lowestAudioFeatureSongIds,
      setUser2LowestAudioFeatureValues
    );

    getMostLeastPopSongs(
      overlappingData.mostLeastPopSongIds,
      setSharedMostLeastPopSongs
    );
    getMostLeastPopSongs(
      arrays1.mostLeastPopSongIds,
      setUser1MostLeastPopSongs
    );
    getMostLeastPopSongs(
      arrays2.mostLeastPopSongIds,
      setUser2MostLeastPopSongs
    );

    getOldestNewestSongs(
      overlappingData.oldestNewestSongIds,
      setSharedOldestNewestSongs
    );
    getOldestNewestSongs(
      arrays1.oldestNewestSongIds,
      setUser1OldestNewestSongs
    );
    getOldestNewestSongs(
      arrays2.oldestNewestSongIds,
      setUser2OldestNewestSongs
    );

    getAlbums(overlappingData.albumIds, setSharedTopAlbums);
    getAlbums(
      arrays1.albumIds.filter(
        (item) => !overlappingData.albumIds.includes(item)
      ),
      setUser1TopAlbums
    );
    getAlbums(
      arrays2.albumIds.filter(
        (item) => !overlappingData.albumIds.includes(item)
      ),
      setUser2TopAlbums
    );

    getMostLeastPopAlbums(
      overlappingData.mostLeastPopAlbumIds,
      setSharedMostLeastPopAlbums
    );
    getMostLeastPopAlbums(
      arrays1.mostLeastPopAlbumIds,
      setUser1MostLeastPopAlbums
    );
    getMostLeastPopAlbums(
      arrays2.mostLeastPopAlbumIds,
      setUser2MostLeastPopAlbums
    );

    getArtists(overlappingData.artistIds, setSharedTopArtists);
    getArtists(
      arrays1.artistIds.filter(
        (item) => !overlappingData.artistIds.includes(item)
      ),
      setUser1TopArtists
    );
    getArtists(
      arrays2.artistIds.filter(
        (item) => !overlappingData.artistIds.includes(item)
      ),
      setUser2TopArtists
    );

    getMostLeastPopArtists(
      overlappingData.mostLeastPopArtistIds,
      setSharedMostLeastPopArtists
    );
    getMostLeastPopArtists(
      arrays1.mostLeastPopArtistIds,
      setUser1MostLeastPopArtists
    );
    getMostLeastPopArtists(
      arrays2.mostLeastPopArtistIds,
      setUser2MostLeastPopArtists
    );
  }, [selectedTimeRange]);

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

  const getGptPrompt = () => {
    let prompt = "Prompt error. Try again.";
    if (
      nameIdImgurlGenerationdate1 &&
      nameIdImgurlGenerationdate1[0] &&
      nameIdImgurlGenerationdate2 &&
      nameIdImgurlGenerationdate2[0]
    ) {
      prompt =
        "Compare and contrast " +
        nameIdImgurlGenerationdate1[0] +
        " and " +
        nameIdImgurlGenerationdate2[0] +
        "'s music taste in the form of a short poem. IMPORTANT: indicate each new line with a forward slash! Use this information: ";
    }

    if (similarityPct) {
      prompt += "Their percent similar is " + similarityPct + "%.";
    }
    if (sharedTopSongs && sharedTopSongs.length > 0) {
      prompt +=
        "They both like '" +
        sharedTopSongs[0].name.toString() +
        "' by " +
        sharedTopSongs[0].artists[0].toString() +
        ".";
    }
    if (sharedTopArtists && sharedTopArtists.length > 0) {
      prompt += "They both like " + sharedTopArtists[0].name.toString() + ".";
    }
    if (sharedTopAlbums && sharedTopAlbums.length > 0) {
      prompt +=
        "They both like " +
        sharedTopAlbums[0].name.toString() +
        " by " +
        sharedTopAlbums[0].artists[0].toString() +
        ".";
    }
    if (
      overlappingData.topGenresByArtist &&
      overlappingData.topGenresByArtist.length > 0
    ) {
      prompt +=
        "They both like " + overlappingData.topGenresByArtist[0].toString();
      if (overlappingData.topGenresByArtist.length > 1) {
        prompt += " and " + overlappingData.topGenresByArtist[1].toString();
      }
      prompt += ".";
    }

    if (
      arrays1.topGenresByArtist.filter(
        (item) => !overlappingData.topGenresByArtist.includes(item)
      ) &&
      arrays1.topGenresByArtist.filter(
        (item) => !overlappingData.topGenresByArtist.includes(item)
      ).length > 0
    ) {
      prompt +=
        "However, only " +
        nameIdImgurlGenerationdate1[0].toString() +
        " likes " +
        arrays1.topGenresByArtist
          .filter(
            (item) => !overlappingData.topGenresByArtist.includes(item)
          )[0]
          .toString() +
        ".";
    }

    if (
      arrays2.topGenresByArtist.filter(
        (item) => !overlappingData.topGenresByArtist.includes(item)
      ) &&
      arrays2.topGenresByArtist.filter(
        (item) => !overlappingData.topGenresByArtist.includes(item)
      ).length > 0
    ) {
      prompt +=
        "Also, only " +
        nameIdImgurlGenerationdate2[0].toString() +
        " likes " +
        arrays2.topGenresByArtist
          .filter(
            (item) => !overlappingData.topGenresByArtist.includes(item)
          )[0]
          .toString() +
        ".";
    }

    if (user1TopArtists && user1TopArtists.length > 0) {
      prompt +=
        "Only " +
        nameIdImgurlGenerationdate1[0].toString() +
        " likes " +
        user1TopArtists[0].name +
        ".";
    }

    if (user2TopArtists && user2TopArtists.length > 0) {
      prompt +=
        "Only " +
        nameIdImgurlGenerationdate2[0].toString() +
        " likes " +
        user2TopArtists[0].name +
        ".";
    }

    if (similarities.avgSongPop && similarities.avgSongPop > 0.75) {
      prompt += "They both like songs with similar popularity levels.";
    }
    if (similarities.avgSongAgeYrMo && similarities.avgSongAgeYrMo > 0.75) {
      prompt += "They both like songs with similar ages.";
    }
    if (similarities.avgArtistPop && similarities.avgArtistPop > 0.75) {
      prompt += "They both like artists with similar popularity levels.";
    }

    if (similarities.audioFeatureMeans) {
      const maxFeatureValue = Math.max(...similarities.audioFeatureMeans);
      if (maxFeatureValue > 0.5) {
        prompt +=
          "They both tend to like songs with similar levels of " +
          features[
            similarities.audioFeatureMeans.indexOf(maxFeatureValue)
          ].toString() +
          ".";
      }

      const minFeatureValue = Math.min(...similarities.audioFeatureMeans);
      if (maxFeatureValue < 0.5) {
        prompt +=
          "But, they both tend to have different preferences when it comes to the " +
          features[
            similarities.audioFeatureMeans.indexOf(minFeatureValue)
          ].toString() +
          " of a song.";
      }
    }

    return prompt;
  };

  function msToMinSec(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  const [sharedHighestAudioFeatureValues, setSharedHighestAudioFeatureValues] =
    useState([]);
  const [user1HighestAudioFeatureValues, setUser1HighestAudioFeatureValues] =
    useState([]);
  const [user2HighestAudioFeatureValues, setUser2HighestAudioFeatureValues] =
    useState([]);

  const [sharedLowestAudioFeatureValues, setSharedLowestAudioFeatureValues] =
    useState([]);
  const [user1LowestAudioFeatureValues, setUser1LowestAudioFeatureValues] =
    useState([]);
  const [user2LowestAudioFeatureValues, setUser2LowestAudioFeatureValues] =
    useState([]);

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

      if (allEmpty || (songIds && songIds[0] == "No data")) {
        return Array(songIds.length).fill("");
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

  // const [playModalIsOpen, setPlayModalIsOpen] = useState(false);
  // const openPlayModal = async () => {
  //   setPlayModalIsOpen(true);
  // };
  // const closePlayModal = () => {
  //   setPlayModalIsOpen(false);
  // };

  const [recModalIsOpen, setRecModalIsOpen] = useState(false);
  const openRecModal = async () => {
    setRecModalIsOpen(true);
  };
  const closeRecModal = () => {
    setRecModalIsOpen(false);
  };

  const openModal = async () => {
    setIsOpen(true);
    await handleGptSumbit();
  };

  const handleGptSumbit = async () => {
    setGptLoading(true);

    let gptPrompt = getGptPrompt();

    if (!gptPrompt) {
      gptPrompt =
        "Display the following statement (without quotes around it): Prompt error. Try again.";
    }

    try {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: gptPrompt,
        temperature: 1,
        max_tokens: 700,
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

  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const customStyles = {
    overlay: {
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
      zIndex: 9999,
      width: "30%",
      height: "fit-content",
      margin: "auto",
      borderRadius: "10px",
      outline: "none",
      padding: "20px",
      maxHeight: "80%",
    },
  };

  // const playModalStyles = {
  //   overlay: {
  //     zIndex: 9999,
  //     backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   },
  //   content: {
  //     margin: "auto",
  //     width: '50%',
  //     height: '60%',
  //     overflow: "hidden", // Hides the scroll bar
  //     borderRadius:'20px'

  //   },
  // };

  const playModalStyles = {
    overlay: {
      zIndex: 9999,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      // outline: '0',
    },
    content: {
      margin: "auto",
      maxWidth: "600px",
      outline: "0",

      maxHeight: "500px",
      width: "90%",
      height: "90%",
      overflow: "hidden",
      borderRadius: "20px",
      background: "#f8f8ff",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
  };
  const mediaQueryStyles = `@media (max-width: 768px) {
    .gameModal {
      width: 90% !important;
      padding:0px !important;
    }
  }`;

  // <style>{mediaQueryStyles}</style>

  Modal.setAppElement("#root");

  const configuration = new Configuration({
    organization: "org-K3YIyvzJixL8ZKFVjQJCKBMP",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  delete configuration.baseOptions.headers["User-Agent"];

  const openai = new OpenAIApi(configuration);
  const [apiResponse, setApiResponse] = useState("");

  const [gptLoading, setGptLoading] = useState(false);

  const date1 = new Date(nameIdImgurlGenerationdate1[3]);
  const date2 = new Date(nameIdImgurlGenerationdate2[3]);

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const generationDateTime1 = date1.toLocaleString(undefined, {
    timeZone: localTimeZone,
  });
  const generationDateTime2 = date2.toLocaleString(undefined, {
    timeZone: localTimeZone,
  });

  const [state, setState] = useState({
    view1: true,
    view2: false,
    view3: false,
  });

  function handleClick(number) {
    if (number === 1) {
      setState({ view1: true, view2: false, view3: false });
    } else if (number === 2) {
      setState({ view1: false, view2: true, view3: false });
    } else {
      setState({ view1: false, view2: false, view3: true });
    }
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

  const pieData1 = [];

  for (let i = 0; i < arrays1.decadesAndPcts.length; i += 2) {
    const decade = arrays1.decadesAndPcts[i];
    const percentage = arrays1.decadesAndPcts[i + 1];
    pieData1.push({ name: `${decade}s`, value: parseFloat(percentage) });
  }

  const pieData2 = [];

  for (let i = 0; i < arrays2.decadesAndPcts.length; i += 2) {
    const decade = arrays2.decadesAndPcts[i];
    const percentage = arrays2.decadesAndPcts[i + 1];
    pieData2.push({ name: `${decade}s`, value: parseFloat(percentage) });
  }

  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) {
      return true;
    }
    return new Date().getTime() > parseInt(expirationTime);
  };

  const toPlayPage = async () => {
    if (isTokenExpired()) {
      logout();
    } else {
      navigate("/play", {
        state: {
          token: token,
          sharedSongs: sharedTopSongs,
          user1Songs: user1TopSongs,
          user2Songs: user2TopSongs,
        },
      });
    }
  };

  return (
    <div>
      {/* <ScrollButton /> */}
      <Link to="/" title="Home" style={{ display: "block" }}>
        <img
          src={logoAlt}
          style={{ width: 80, paddingTop: "20px", pointerEvents: "none" }}
        ></img>
      </Link>
      <h3>
        comparify results
        <span>
          &emsp;
          <img
            id="gptTooltip"
            className="zoom"
            onClick={openModal}
            src={gptBtn}
            style={{ width: "15px", cursor: "pointer" }}
          ></img>
        </span>
      </h3>
      <div className="container">
        <div className="image">
          <a
            id="SpotifyProfileLink"
            href={
              "https://open.spotify.com/user/" + nameIdImgurlGenerationdate1[1]
            }
          >
            <img
              src={nameIdImgurlGenerationdate1[2]}
              style={{
                width: "30px",
                borderRadius: "50%",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              alt="Image 1"
            ></img>
          </a>
          <div
            id="generationDateTooltip1"
            className="text"
            style={{ color: "#1e90ff", fontWeight: "bold" }}
          >
            {nameIdImgurlGenerationdate1[0]}
          </div>
        </div>
        <span style={{ color: "#18d860", fontWeight: "bold" }}>vs.</span>
        <div className="image">
          <a
            id="SpotifyProfileLink"
            href={
              "https://open.spotify.com/user/" + nameIdImgurlGenerationdate2[1]
            }
          >
            <img
              src={nameIdImgurlGenerationdate2[2]}
              style={{
                width: "30px",
                borderRadius: "50%",
                paddingLeft: "10px",
                paddingRight: "10px",
              }}
              alt="Image 2"
            ></img>
          </a>
          <div
            id="generationDateTooltip2"
            className="text"
            style={{ color: "#FFDF00", fontWeight: "bold" }}
          >
            {nameIdImgurlGenerationdate2[0]}
          </div>
        </div>
      </div>
      <h2>
        <span
          style={{
            background:
              "linear-gradient(to right, #1e90ff 0%, #1e90ff 40%, #18d860 40%, #18d860 60%, #FFDF00 60%, #FFDF00 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {similarityPct.toFixed(3)}%
        </span>

        <span style={{ fontSize: "16px" }}>&ensp;similar&emsp;</span>

        <button
          className="saveImg"
          onClick={handleConvertToImage}
          data-tooltip-id="downloadScoreImageTooltip"
          data-tooltip-content="Save percent as image"
        >
          <img src={download} style={{ width: "10px" }}></img>
        </button>
      </h2>

      <div style={{ width: "0", height: "0", overflow: "hidden" }}>
        <div id="imgDiv" style={{ width: 200, paddingBottom: "2px" }}>
          <img src={logoAlt} style={{ width: 80, paddingTop: "20px" }}></img>
          <h3>comparify score</h3>
          <h4>
            <span style={{ color: "#1e90ff" }}>
              {nameIdImgurlGenerationdate1[0]}
            </span>{" "}
            <span style={{ color: "#18d860" }}>vs.</span>{" "}
            <span style={{ color: "#FFDF00" }}>
              {nameIdImgurlGenerationdate2[0]}
            </span>
          </h4>
          <span className="timeRange">{selectedTimeRangeClean}</span>

          <h2>
            <span>{similarityPct.toFixed(3)}&nbsp;%</span>

            <span style={{ fontSize: "16px" }}>&ensp;similar</span>
          </h2>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <div className="recommendationsBtn" onClick={openRecModal}>
          Get recommendations
        </div>
        {/* <div className="recommendationsBtn"  onClick={() => {
              toPlayPage();
            }}>
          Play
        </div> */}
        <div
          className="recommendationsBtn border"
          onClick={gameModalState.openGameModal}
        >
          Play
        </div>



        {/* <div><button className="sun-button">Hover Me</button>
</div> */}
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

      {isSmallScreen ? (
        <div>
          <table>
            <tbody>
              <tr>
                <td>
                  <button
                    className={
                      !state.view1
                        ? "image viewToggle grayscale shrink"
                        : "image viewToggle"
                    }
                    onClick={() => handleClick(1)}
                    title="See shared view"
                    style={{}}
                  >
                    <img
                      src={nameIdImgurlGenerationdate1[2]}
                      style={{
                        width: "30px",
                        borderRadius: "50%",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        pointerEvents: "none",
                      }}
                      alt="Image 1"
                    ></img>
                    <div
                      className="text"
                      style={{ color: "#1e90ff", fontWeight: "bold" }}
                    >
                      {nameIdImgurlGenerationdate1[0]}
                    </div>
                  </button>
                </td>
                <td>
                  <div
                    className={!state.view2 ? "grayscale shrink" : ""}
                    style={{ display: "flex", justifyContent: "center" }}
                    onClick={() => handleClick(2)}
                  >
                    <button
                      className="viewToggle"
                      style={{ color: "#18d860", fontWeight: "bold" }}
                      title={`See ${nameIdImgurlGenerationdate2[0]}'s view`}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="image">
                          <img
                            src={nameIdImgurlGenerationdate1[2]}
                            style={{
                              width: "30px",
                              borderRadius: "50%",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                            }}
                            alt="Image 1"
                          />
                          <div
                            className="text"
                            style={{ color: "#1e90ff", fontWeight: "bold" }}
                          >
                            {nameIdImgurlGenerationdate1[0]}
                          </div>
                        </div>
                        <span>+</span>
                        <div className="image">
                          <img
                            src={nameIdImgurlGenerationdate2[2]}
                            style={{
                              width: "30px",
                              borderRadius: "50%",
                              paddingLeft: "10px",
                              paddingRight: "10px",
                            }}
                            alt="Image 2"
                          />
                          <div
                            className="text"
                            style={{ color: "#FFDF00", fontWeight: "bold" }}
                          >
                            {nameIdImgurlGenerationdate2[0]}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </td>
                <td>
                  <button
                    className={
                      !state.view3
                        ? "image viewToggle grayscale shrink"
                        : "image viewToggle"
                    }
                    onClick={() => handleClick(3)}
                    title={`See ${nameIdImgurlGenerationdate1[0]}'s view`}
                    style={{}}
                  >
                    <img
                      src={nameIdImgurlGenerationdate2[2]}
                      style={{
                        width: "30px",
                        borderRadius: "50%",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      }}
                      alt="Image 1"
                    ></img>
                    <div
                      className="text"
                      style={{ color: "#FFDF00", fontWeight: "bold" }}
                    >
                      {nameIdImgurlGenerationdate2[0]}
                    </div>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {state.view1 && (
            <>
              <table className="compareTable">
                <tbody>
                  <tr></tr>
                  <tr>
                    <td>
                      <div className="compareCard1">
                        <div className="primaryTitle">top songs</div>
                        {user1TopSongs.length > 0 ? (
                          user1TopSongs.map((song, index) => (
                            <div key={index} className="item">
                              <img src={song.img} className="primaryImage" />
                              <div className="primaryText">
                                <span className="primaryName">{song.name}</span>
                                <span className="primaryArtists">
                                  {song.artists.join(", ")}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard1">
                        <div className="primaryTitle"> top artists</div>
                        {user1TopArtists.length > 0 ? (
                          user1TopArtists.map((artist, index) => (
                            <div key={index} className="item">
                              <img src={artist.img} className="primaryImage" />
                              <div className="primaryText">
                                <span className="primaryName">
                                  {artist.name}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard1">
                        <div className="primaryTitle"> top albums</div>
                        {user1TopAlbums.length > 0 ? (
                          user1TopAlbums.map((album, index) => (
                            <div key={index} className="item">
                              <img src={album.img} className="primaryImage" />
                              <div className="primaryText">
                                <span className="primaryName">
                                  {album.name}
                                </span>
                                <span className="primaryArtists">
                                  {album.artists.join(", ")}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard1">
                        <div className="primaryTitle"> top genres</div>
                        {arrays1.topGenresByArtist.filter(
                          (item) =>
                            !overlappingData.topGenresByArtist.includes(item)
                        ).length > 0 &&
                        arrays1.topGenresByArtist &&
                        arrays1.topGenresByArtist[0] !== "No data" ? (
                          arrays1.topGenresByArtist
                            .filter(
                              (item) =>
                                !overlappingData.topGenresByArtist.includes(
                                  item
                                )
                            )
                            .map((genre, index) => (
                              <div key={index} className="item">
                                <div className="primaryText">
                                  <span className="primaryName">{genre}</span>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard1">
                        <div className="primaryTitle"> top labels</div>
                        {arrays1.topLabelsByAlbums.filter(
                          (item) =>
                            !overlappingData.topLabelsByAlbums.includes(item)
                        ).length > 0 &&
                        arrays1.topLabelsByAlbums &&
                        arrays1.topLabelsByAlbums[0] !== "No data" ? (
                          arrays1.topLabelsByAlbums
                            .filter(
                              (item) =>
                                !overlappingData.topLabelsByAlbums.includes(
                                  item
                                )
                            )
                            .map((label, index) => (
                              <div key={index} className="item">
                                <div className="primaryText">
                                  <span className="primaryName">{label}</span>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">most popular song</div>
                        {user1MostLeastPopSongs &&
                        user1MostLeastPopSongs[0] &&
                        arrays1.mostLeastPopSongIds[0] !==
                          arrays2.mostLeastPopSongIds[0] ? (
                          <div className="item">
                            <img
                              src={user1MostLeastPopSongs[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user1MostLeastPopSongs[0]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user1MostLeastPopSongs[0]?.artists.join(", ")}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user1MostLeastPopSongs[0]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">least popular song</div>
                        {user1MostLeastPopSongs &&
                        user1MostLeastPopSongs[1] &&
                        arrays1.mostLeastPopSongIds[1] !==
                          arrays2.mostLeastPopSongIds[1] ? (
                          <div className="item">
                            <img
                              src={user1MostLeastPopSongs[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user1MostLeastPopSongs[1]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user1MostLeastPopSongs[1]?.artists.join(", ")}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user1MostLeastPopSongs[1]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">oldest song</div>
                        {user1OldestNewestSongs &&
                        user1OldestNewestSongs[0] &&
                        arrays1.oldestNewestSongIds[0] !==
                          arrays2.oldestNewestSongIds[0] ? (
                          <div className="item">
                            <img
                              src={user1OldestNewestSongs[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user1OldestNewestSongs[0]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user1OldestNewestSongs[0]?.artists.join(", ")}
                              </span>
                              <span style={{ paddingLeft: "20px" }}>
                                {user1OldestNewestSongs[0]?.date.substr(0, 4)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">newest song</div>
                        {user1OldestNewestSongs &&
                        user1OldestNewestSongs[1] &&
                        arrays1.oldestNewestSongIds[1] !==
                          arrays2.oldestNewestSongIds[1] ? (
                          <div className="item">
                            <img
                              src={user1OldestNewestSongs[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user1OldestNewestSongs[1]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user1OldestNewestSongs[1]?.artists.join(", ")}
                              </span>
                              <span style={{ paddingLeft: "20px" }}>
                                {user1OldestNewestSongs[1]?.date.substr(0, 4)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">most popular artist</div>
                        {user1MostLeastPopArtists &&
                        user1MostLeastPopArtists[0] &&
                        arrays1.mostLeastPopArtistIds[0] !==
                          arrays2.mostLeastPopArtistIds[0] ? (
                          <div className="item">
                            <img
                              src={user1MostLeastPopArtists[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user1MostLeastPopArtists[0]?.name}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user1MostLeastPopArtists[0]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">least popular artist</div>
                        {user1MostLeastPopArtists &&
                        user1MostLeastPopArtists[1] &&
                        arrays1.mostLeastPopArtistIds[1] !==
                          arrays2.mostLeastPopArtistIds[1] ? (
                          <div className="item">
                            <img
                              src={user1MostLeastPopArtists[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user1MostLeastPopArtists[1]?.name}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user1MostLeastPopArtists[1]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">most popular album</div>
                        {user1MostLeastPopAlbums &&
                        user1MostLeastPopAlbums[0] &&
                        arrays1.mostLeastPopAlbumIds[0] !==
                          arrays2.mostLeastPopAlbumIds[0] ? (
                          <div className="item">
                            <img
                              src={user1MostLeastPopAlbums[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user1MostLeastPopAlbums[0]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user1MostLeastPopAlbums[0]?.artists.join(", ")}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user1MostLeastPopAlbums[0]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">least popular album</div>
                        {user1MostLeastPopAlbums &&
                        user1MostLeastPopAlbums[1] &&
                        arrays1.mostLeastPopAlbumIds[1] !==
                          arrays2.mostLeastPopAlbumIds[1] ? (
                          <div className="item">
                            <img
                              src={user1MostLeastPopAlbums[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user1MostLeastPopAlbums[1]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user1MostLeastPopAlbums[1]?.artists.join(", ")}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user1MostLeastPopAlbums[1]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr style={{ height: "80px" }}></tr>
                  <tr>
                    <td></td>
                    <td className="statsHeader">stats</td>
                    <td></td>
                  </tr>
                  <tr style={{ height: "40px" }}></tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1 pieCard">
                        <div className="primaryTitle">
                          song release decade distribution
                        </div>
                        {arrays1.decadesAndPcts &&
                        arrays1.decadesAndPcts[0] === "No data" ? (
                          <div className="noData">No data</div>
                        ) : (
                          <PieChart width={200} height={200}>
                            <Pie
                              data={pieData1}
                              outerRadius={30}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name }) => name} // Set the label to display the name property
                            >
                              {pieData1.map((entry, index) => (
                                <Cell
                                  key={index}
                                  fill={colors[index % colors.length]}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">
                          average song popularity
                        </div>
                        {arrays1.avgSongPop && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {arrays1.avgSongPop}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">
                          song popularity standard deviation
                        </div>
                        {arrays1.songPopStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {arrays1.songPopStdDev}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">average song age</div>
                        {arrays1.avgSongAgeYrMo && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {`${
                                  arrays1.avgSongAgeYrMo[0] === 1
                                    ? "1 year"
                                    : `${arrays1.avgSongAgeYrMo[0]} years`
                                }, ${
                                  arrays1.avgSongAgeYrMo[1] === 1
                                    ? "1 month"
                                    : `${arrays1.avgSongAgeYrMo[1]} months`
                                }`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">
                          song age standard deviation
                        </div>
                        {arrays1.songAgeStdDevYrMo && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {`${
                                  arrays1.songAgeStdDevYrMo[0] === 1
                                    ? "1 year"
                                    : `${arrays1.songAgeStdDevYrMo[0]} years`
                                }, ${
                                  arrays1.songAgeStdDevYrMo[1] === 1
                                    ? "1 month"
                                    : `${arrays1.songAgeStdDevYrMo[1]} months`
                                }`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">
                          percent songs explicit
                        </div>
                        {arrays1.pctSongsExpl && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {arrays1.pctSongsExpl}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">
                          average album popularity
                        </div>
                        {arrays1.avgAlbumPop && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {arrays1.avgAlbumPop}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">
                          album popularity standard deviation
                        </div>
                        {arrays1.albumPopsStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {arrays1.albumPopsStdDev}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">
                          average artist popularity
                        </div>
                        {arrays1.avgArtistPop && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {arrays1.avgArtistPop}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">
                          artist popularity standard deviation
                        </div>
                        {arrays1.artistPopStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {arrays1.artistPopStdDev}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">
                          average artist followers
                        </div>

                        {arrays1.avgArtistFolls && (
                          <div className="item" style={{ fontSize: "20px" }}>
                            <div className="primaryText">
                              <span className="primaryName2">
                                {arrays1.avgArtistFolls}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1">
                        <div className="primaryTitle">
                          artist followers standard deviation
                        </div>
                        {arrays1.artistFollsStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {arrays1.artistFollsStdDev}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>{" "}
            </>
          )}
          {state.view2 && (
            <>
              <table className="compareTable">
                <tbody>
                  <tr></tr>
                  <tr>
                    <td>
                      <div className="compareCard2">
                        <div className="primaryTitle">top songs</div>
                        {sharedTopSongs.length > 0 ? (
                          sharedTopSongs.map((song, index) => (
                            <div key={index} className="item">
                              <img src={song.img} className="primaryImage" />
                              <div className="primaryText">
                                <span className="primaryName">{song.name}</span>
                                <span className="primaryArtists">
                                  {song.artists.join(", ")}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard2">
                        <div className="primaryTitle"> top artists</div>
                        {sharedTopArtists.length > 0 ? (
                          sharedTopArtists.map((artist, index) => (
                            <div key={index} className="item">
                              <img src={artist.img} className="primaryImage" />
                              <div className="primaryText">
                                <span className="primaryName">
                                  {artist.name}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard2">
                        <div className="primaryTitle"> top albums</div>
                        {sharedTopAlbums.length > 0 ? (
                          sharedTopAlbums.map((album, index) => (
                            <div key={index} className="item">
                              <img src={album.img} className="primaryImage" />
                              <div className="primaryText">
                                <span className="primaryName">
                                  {album.name}
                                </span>
                                <span className="primaryArtists">
                                  {album.artists.join(", ")}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard2">
                        <div className="primaryTitle"> top genres</div>
                        {overlappingData.topGenresByArtist.length > 0 &&
                        overlappingData.topGenresByArtist &&
                        overlappingData.topGenresByArtist[0] !== "No data" ? (
                          overlappingData.topGenresByArtist.map(
                            (genre, index) => (
                              <div key={index} className="item">
                                <div className="primaryText">
                                  <span className="primaryName">{genre}</span>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard2">
                        <div className="primaryTitle"> top labels</div>
                        {overlappingData.topLabelsByAlbums.length > 0 &&
                        overlappingData.topLabelsByAlbums &&
                        overlappingData.topLabelsByAlbums[0] !== "No data" ? (
                          overlappingData.topLabelsByAlbums.map(
                            (label, index) => (
                              <div key={index} className="item">
                                <div className="primaryText">
                                  <span className="primaryName">{label}</span>
                                </div>
                              </div>
                            )
                          )
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">most popular song</div>
                        {sharedMostLeastPopSongs &&
                        sharedMostLeastPopSongs[0] ? (
                          <div className="item">
                            <img
                              src={sharedMostLeastPopSongs[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {sharedMostLeastPopSongs[0]?.name}
                              </span>
                              <span className="primaryArtists">
                                {sharedMostLeastPopSongs[0]?.artists.join(", ")}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {sharedMostLeastPopSongs[0]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">least popular song</div>
                        {sharedMostLeastPopSongs &&
                        sharedMostLeastPopSongs[1] ? (
                          <div className="item">
                            <img
                              src={sharedMostLeastPopSongs[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {sharedMostLeastPopSongs[1]?.name}
                              </span>
                              <span className="primaryArtists">
                                {sharedMostLeastPopSongs[1]?.artists.join(", ")}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {sharedMostLeastPopSongs[1]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">oldest song</div>
                        {sharedOldestNewestSongs &&
                        sharedOldestNewestSongs[0] ? (
                          <div className="item">
                            <img
                              src={sharedOldestNewestSongs[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {sharedOldestNewestSongs[0]?.name}
                              </span>
                              <span className="primaryArtists">
                                {sharedOldestNewestSongs[0]?.artists.join(", ")}
                              </span>
                              <span style={{ paddingLeft: "20px" }}>
                                {sharedOldestNewestSongs[0]?.date.substr(0, 4)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">newest song</div>
                        {sharedOldestNewestSongs &&
                        sharedOldestNewestSongs[1] ? (
                          <div className="item">
                            <img
                              src={sharedOldestNewestSongs[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {sharedOldestNewestSongs[1]?.name}
                              </span>
                              <span className="primaryArtists">
                                {sharedOldestNewestSongs[1]?.artists.join(", ")}
                              </span>
                              <span style={{ paddingLeft: "20px" }}>
                                {sharedOldestNewestSongs[1]?.date.substr(0, 4)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">most popular artist</div>
                        {sharedMostLeastPopArtists &&
                        sharedMostLeastPopArtists[0] ? (
                          <div className="item">
                            <img
                              src={sharedMostLeastPopArtists[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {sharedMostLeastPopArtists[0]?.name}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {sharedMostLeastPopArtists[0]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">least popular artist</div>
                        {sharedMostLeastPopArtists &&
                        sharedMostLeastPopArtists[1] ? (
                          <div className="item">
                            <img
                              src={sharedMostLeastPopArtists[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {sharedMostLeastPopArtists[1]?.name}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {sharedMostLeastPopArtists[1]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">most popular album</div>
                        {sharedMostLeastPopAlbums &&
                        sharedMostLeastPopAlbums[0] ? (
                          <div className="item">
                            <img
                              src={sharedMostLeastPopAlbums[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {sharedMostLeastPopAlbums[0]?.name}
                              </span>
                              <span className="primaryArtists">
                                {sharedMostLeastPopAlbums[0]?.artists.join(
                                  ", "
                                )}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {sharedMostLeastPopAlbums[0]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">least popular album</div>
                        {sharedMostLeastPopAlbums &&
                        sharedMostLeastPopAlbums[1] ? (
                          <div className="item">
                            <img
                              src={sharedMostLeastPopAlbums[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {sharedMostLeastPopAlbums[1]?.name}
                              </span>
                              <span className="primaryArtists">
                                {sharedMostLeastPopAlbums[1]?.artists.join(
                                  ", "
                                )}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {sharedMostLeastPopAlbums[1]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr style={{ height: "80px" }}></tr>
                  <tr>
                    <td></td>
                    <td className="statsHeader">stats</td>
                    <td></td>
                  </tr>
                  <tr style={{ height: "40px" }}></tr>
                  <tr>
                    <td className="differencesLabel">differences</td>
                    {/* <td> 
     
      </td>
      
      <td> 
       
      </td> */}
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">
                          average song popularity
                        </div>
                        {overlappingData.avgSongPop && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {!isNaN(overlappingData.avgSongPop)
                                  ? overlappingData.avgSongPop
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">
                          song popularity standard deviation
                        </div>
                        {overlappingData.songPopStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {!isNaN(overlappingData.songPopStdDev)
                                  ? overlappingData.songPopStdDev
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">average song age</div>
                        {overlappingData.avgSongAgeYrMo && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {isNaN(overlappingData.avgSongAgeYrMo[0]) ||
                                isNaN(overlappingData.avgSongAgeYrMo[1])
                                  ? `- years, - months`
                                  : `${
                                      overlappingData.avgSongAgeYrMo[0] === 1
                                        ? "1 year"
                                        : `${overlappingData.avgSongAgeYrMo[0]} years`
                                    }, ${
                                      overlappingData.avgSongAgeYrMo[1] === 1
                                        ? "1 month"
                                        : `${overlappingData.avgSongAgeYrMo[1]} months`
                                    }`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">
                          song age standard deviation
                        </div>
                        {overlappingData.songAgeStdDevYrMo && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {isNaN(overlappingData.songAgeStdDevYrMo[0]) ||
                                isNaN(overlappingData.songAgeStdDevYrMo[1])
                                  ? `- years, - months`
                                  : `${
                                      overlappingData.songAgeStdDevYrMo[0] === 1
                                        ? "1 year"
                                        : `${overlappingData.songAgeStdDevYrMo[0]} years`
                                    }, ${
                                      overlappingData.songAgeStdDevYrMo[1] === 1
                                        ? "1 month"
                                        : `${overlappingData.songAgeStdDevYrMo[1]} months`
                                    }`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">
                          percent songs explicit
                        </div>
                        {overlappingData.pctSongsExpl && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {!isNaN(overlappingData.pctSongsExpl)
                                  ? overlappingData.pctSongsExpl
                                  : "-"}
                                %
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">
                          average album popularity
                        </div>
                        {overlappingData.avgAlbumPop && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {!isNaN(overlappingData.avgAlbumPop)
                                  ? overlappingData.avgAlbumPop
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">
                          album popularity standard deviation
                        </div>
                        {overlappingData.albumPopsStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {!isNaN(overlappingData.albumPopsStdDev)
                                  ? overlappingData.albumPopsStdDev
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">
                          average artist popularity
                        </div>
                        {overlappingData.avgArtistPop && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {!isNaN(overlappingData.avgArtistPop)
                                  ? overlappingData.avgArtistPop
                                  : "-"}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">
                          artist popularity standard deviation
                        </div>
                        {overlappingData.artistPopStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {overlappingData.artistPopStdDev}
                                {/* {!isNaN(overlappingData.artistPopStdDev)
                                  ? overlappingData.artistPopStdDev
                                  : "-"} */}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">
                          average artist followers
                        </div>
                        <div className="item">
                          <div className="primaryText">
                            <span className="primaryName2">
                              {overlappingData.avgArtistFolls}
                              {/* {!isNaN(overlappingData.avgArtistFolls)
                                ? overlappingData.avgArtistFolls
                                : "-"} */}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall2">
                        <div className="primaryTitle">
                          artist followers standard deviation
                        </div>
                        <div className="item">
                          <div className="primaryText">
                            <span className="primaryName2" id="stdDev">
                              {overlappingData.artistFollsStdDev}
                              {/* {!isNaN(overlappingData.artistFollsStdDev)
                                ? overlappingData.artistFollsStdDev
                                : "-"} */}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
          {state.view3 && (
            <>
              <table className="compareTable" style={{ margin: "0 auto" }}>
                <tbody>
                  <tr>
                    <th></th>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard3">
                        <div className="primaryTitle">top songs</div>
                        {user2TopSongs.length > 0 ? (
                          user2TopSongs.map((song, index) => (
                            <div key={index} className="item">
                              <img src={song.img} className="primaryImage" />
                              <div className="primaryText">
                                <span className="primaryName">{song.name}</span>
                                <span className="primaryArtists">
                                  {song.artists.join(", ")}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard3">
                        <div className="primaryTitle"> top artists</div>
                        {user2TopArtists.length > 0 ? (
                          user2TopArtists.map((artist, index) => (
                            <div key={index} className="item">
                              <img src={artist.img} className="primaryImage" />
                              <div className="primaryText">
                                <span className="primaryName">
                                  {artist.name}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard3">
                        <div className="primaryTitle"> top albums</div>
                        {user2TopAlbums.length > 0 ? (
                          user2TopAlbums.map((album, index) => (
                            <div key={index} className="item">
                              <img src={album.img} className="primaryImage" />
                              <div className="primaryText">
                                <span className="primaryName">
                                  {album.name}
                                </span>
                                <span className="primaryArtists">
                                  {album.artists.join(", ")}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard3">
                        <div className="primaryTitle"> top genres</div>
                        {arrays2.topGenresByArtist.filter(
                          (item) =>
                            !overlappingData.topGenresByArtist.includes(item)
                        ).length > 0 &&
                        arrays2.topGenresByArtist &&
                        arrays2.topGenresByArtist[0] !== "No data" ? (
                          arrays2.topGenresByArtist
                            .filter(
                              (item) =>
                                !overlappingData.topGenresByArtist.includes(
                                  item
                                )
                            )
                            .map((genre, index) => (
                              <div key={index} className="item">
                                <div className="primaryText">
                                  <span className="primaryName">{genre}</span>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCard3">
                        <div className="primaryTitle"> top labels</div>
                        {arrays2.topLabelsByAlbums.filter(
                          (item) =>
                            !overlappingData.topLabelsByAlbums.includes(item)
                        ).length > 0 &&
                        arrays2.topLabelsByAlbums &&
                        arrays2.topLabelsByAlbums[0] !== "No data" ? (
                          arrays2.topLabelsByAlbums
                            .filter(
                              (item) =>
                                !overlappingData.topLabelsByAlbums.includes(
                                  item
                                )
                            )
                            .map((label, index) => (
                              <div key={index} className="item">
                                <div className="primaryText">
                                  <span className="primaryName">{label}</span>
                                </div>
                              </div>
                            ))
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">most popular song</div>
                        {user2MostLeastPopSongs &&
                        user2MostLeastPopSongs[0] &&
                        arrays1.mostLeastPopSongIds[0] !==
                          arrays2.mostLeastPopSongIds[0] ? (
                          <div className="item">
                            <img
                              src={user2MostLeastPopSongs[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user2MostLeastPopSongs[0]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user2MostLeastPopSongs[0]?.artists.join(", ")}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user2MostLeastPopSongs[0]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">least popular song</div>
                        {user2MostLeastPopSongs &&
                        user2MostLeastPopSongs[1] &&
                        arrays1.mostLeastPopSongIds[1] !==
                          arrays2.mostLeastPopSongIds[1] ? (
                          <div className="item">
                            <img
                              src={user2MostLeastPopSongs[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user2MostLeastPopSongs[1]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user2MostLeastPopSongs[1]?.artists.join(", ")}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user2MostLeastPopSongs[1]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">oldest song</div>
                        {user2OldestNewestSongs &&
                        user2OldestNewestSongs[0] &&
                        arrays1.oldestNewestSongIds[0] !==
                          arrays2.oldestNewestSongIds[0] ? (
                          <div className="item">
                            <img
                              src={user2OldestNewestSongs[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user2OldestNewestSongs[0]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user2OldestNewestSongs[0]?.artists.join(", ")}
                              </span>
                              <span style={{ paddingLeft: "20px" }}>
                                {user2OldestNewestSongs[0]?.date.substr(0, 4)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">newest song</div>
                        {user2OldestNewestSongs &&
                        user2OldestNewestSongs[1] &&
                        arrays1.oldestNewestSongIds[1] !==
                          arrays2.oldestNewestSongIds[1] ? (
                          <div className="item">
                            <img
                              src={user2OldestNewestSongs[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user2OldestNewestSongs[1]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user2OldestNewestSongs[1]?.artists.join(", ")}
                              </span>
                              <span style={{ paddingLeft: "20px" }}>
                                {user2OldestNewestSongs[1]?.date.substr(0, 4)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">most popular artist</div>
                        {user2MostLeastPopArtists &&
                        user2MostLeastPopArtists[0] &&
                        arrays1.mostLeastPopArtistIds[0] !==
                          arrays2.mostLeastPopArtistIds[0] ? (
                          <div className="item">
                            <img
                              src={user2MostLeastPopArtists[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user2MostLeastPopArtists[0]?.name}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user2MostLeastPopArtists[0]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">least popular artist</div>
                        {user2MostLeastPopArtists &&
                        user2MostLeastPopArtists[1] &&
                        arrays1.mostLeastPopArtistIds[1] !==
                          arrays2.mostLeastPopArtistIds[1] ? (
                          <div className="item">
                            <img
                              src={user2MostLeastPopArtists[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user2MostLeastPopArtists[1]?.name}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user2MostLeastPopArtists[1]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">most popular album</div>
                        {user2MostLeastPopAlbums &&
                        user2MostLeastPopAlbums[0] &&
                        arrays1.mostLeastPopAlbumIds[0] !==
                          arrays2.mostLeastPopAlbumIds[0] ? (
                          <div className="item">
                            <img
                              src={user2MostLeastPopAlbums[0]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user2MostLeastPopAlbums[0]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user2MostLeastPopAlbums[0]?.artists.join(", ")}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user2MostLeastPopAlbums[0]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">least popular album</div>
                        {user2MostLeastPopAlbums &&
                        user2MostLeastPopAlbums[1] &&
                        arrays1.mostLeastPopAlbumIds[1] !==
                          arrays2.mostLeastPopAlbumIds[1] ? (
                          <div className="item">
                            <img
                              src={user2MostLeastPopAlbums[1]?.img}
                              className="primaryImage"
                            />
                            <div className="primaryText">
                              <span className="primaryName">
                                {user2MostLeastPopAlbums[1]?.name}
                              </span>
                              <span className="primaryArtists">
                                {user2MostLeastPopAlbums[1]?.artists.join(", ")}
                              </span>
                              <span
                                style={{ paddingLeft: "20px" }}
                                id="popularity"
                              >
                                {user2MostLeastPopAlbums[1]?.pop}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="noData">No data</div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr style={{ height: "80px" }}></tr>
                  <tr>
                    <td></td>
                    <td className="statsHeader">stats</td>
                    <td></td>
                  </tr>
                  <tr style={{ height: "40px" }}></tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall1 pieCard">
                        <div className="primaryTitle">
                          song release decade distribution
                        </div>
                        {arrays2.decadesAndPcts &&
                        arrays2.decadesAndPcts[0] === "No data" ? (
                          <div className="noData">No data</div>
                        ) : (
                          <PieChart width={200} height={200}>
                            <Pie
                              data={pieData2}
                              outerRadius={30}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name }) => name} // Set the label to display the name property
                            >
                              {pieData2.map((entry, index) => (
                                <Cell
                                  key={index}
                                  fill={colors[index % colors.length]}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">
                          average song popularity
                        </div>
                        {arrays2.avgSongPop && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {arrays2.avgSongPop}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">
                          song popularity standard deviation
                        </div>
                        {arrays2.songPopStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {arrays2.songPopStdDev}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">average song age</div>
                        {arrays2.avgSongAgeYrMo && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {`${
                                  arrays2.avgSongAgeYrMo[0] === 1
                                    ? "1 year"
                                    : `${arrays2.avgSongAgeYrMo[0]} years`
                                }, ${
                                  arrays2.avgSongAgeYrMo[1] === 1
                                    ? "1 month"
                                    : `${arrays2.avgSongAgeYrMo[1]} months`
                                }`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">
                          song age standard deviation
                        </div>
                        {arrays2.songAgeStdDevYrMo && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {`${
                                  arrays2.songAgeStdDevYrMo[0] === 1
                                    ? "1 year"
                                    : `${arrays2.songAgeStdDevYrMo[0]} years`
                                }, ${
                                  arrays2.songAgeStdDevYrMo[1] === 1
                                    ? "1 month"
                                    : `${arrays2.songAgeStdDevYrMo[1]} months`
                                }`}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">
                          percent songs explicit
                        </div>
                        {arrays2.pctSongsExpl && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {arrays2.pctSongsExpl}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">
                          average album popularity
                        </div>
                        {arrays2.avgAlbumPop && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {arrays2.avgAlbumPop}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">
                          album popularity standard deviation
                        </div>
                        {arrays2.albumPopsStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {arrays2.albumPopsStdDev}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">
                          average artist popularity
                        </div>
                        {arrays2.avgArtistPop && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {arrays2.avgArtistPop}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">
                          artist popularity standard deviation
                        </div>
                        {arrays2.artistPopStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {arrays2.artistPopStdDev}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">
                          average artist followers
                        </div>
                        {arrays2.avgArtistFolls && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2">
                                {arrays2.avgArtistFolls}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="compareCardSmall3">
                        <div className="primaryTitle">
                          artist followers standard deviation
                        </div>
                        {arrays2.artistFollsStdDev && (
                          <div className="item">
                            <div className="primaryText">
                              <span className="primaryName2" id="stdDev">
                                {arrays2.artistFollsStdDev}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          )}
        </div>
      ) : (
        <table className="compareTable">
          <tbody>
            <tr>
              <th>
                <div
                  className="image"
                  data-tooltip-id="column1"
                  data-tooltip-content={`Unique data for ${nameIdImgurlGenerationdate1[0]} only`}
                >
                  <img
                    src={nameIdImgurlGenerationdate1[2]}
                    style={{
                      width: "30px",
                      borderRadius: "50%",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      pointerEvents: "none",
                    }}
                    alt="Image 1"
                  ></img>
                  <div
                    className="text"
                    style={{ color: "#1e90ff", fontWeight: "bold" }}
                  >
                    {nameIdImgurlGenerationdate1[0]}
                  </div>
                </div>
              </th>
              <th>
                <div
                  className="container"
                  style={{ color: "#18d860", fontWeight: "bold" }}
                  data-tooltip-id="column2"
                  data-tooltip-content={`Overlapping (shared) data for both ${nameIdImgurlGenerationdate1[0]} and ${nameIdImgurlGenerationdate2[0]}`}
                >
                  <div className="image">
                    <img
                      src={nameIdImgurlGenerationdate1[2]}
                      style={{
                        width: "30px",
                        borderRadius: "50%",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      }}
                      alt="Image 1"
                    ></img>
                    <div
                      className="text"
                      style={{ color: "#1e90ff", fontWeight: "bold" }}
                    >
                      {nameIdImgurlGenerationdate1[0]}
                    </div>
                  </div>
                  <span>+</span>
                  <div className="image">
                    <img
                      src={nameIdImgurlGenerationdate2[2]}
                      style={{
                        width: "30px",
                        borderRadius: "50%",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                      }}
                      alt="Image 2"
                    ></img>
                    <div
                      className="text"
                      style={{ color: "#FFDF00", fontWeight: "bold" }}
                    >
                      {nameIdImgurlGenerationdate2[0]}
                    </div>
                  </div>
                </div>
              </th>
              <th>
                <div
                  className="image"
                  data-tooltip-id="column3"
                  data-tooltip-content={`Unique data for ${nameIdImgurlGenerationdate2[0]} only`}
                >
                  <img
                    src={nameIdImgurlGenerationdate2[2]}
                    style={{
                      width: "30px",
                      borderRadius: "50%",
                      paddingLeft: "10px",
                      paddingRight: "10px",
                    }}
                    alt="Image 1"
                  ></img>
                  <div
                    className="text"
                    style={{ color: "#FFDF00", fontWeight: "bold" }}
                  >
                    {nameIdImgurlGenerationdate2[0]}
                  </div>
                </div>
              </th>
            </tr>
            <tr>
              <td>
                <div className="compareCard1">
                  <div className="primaryTitle">top songs</div>
                  {user1TopSongs.length > 0 ? (
                    user1TopSongs.map((song, index) => (
                      <div key={index} className="item">
                        <img src={song.img} className="primaryImage" />
                        <div className="primaryText">
                          <span className="primaryName">{song.name}</span>
                          <span className="primaryArtists">
                            {song.artists.join(", ")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>

              <td>
                <div className="compareCard2">
                  <div className="primaryTitle">top songs</div>
                  {sharedTopSongs.length > 0 ? (
                    sharedTopSongs.map((song, index) => (
                      <div key={index} className="item">
                        <img src={song.img} className="primaryImage" />
                        <div className="primaryText">
                          <span className="primaryName">{song.name}</span>
                          <span className="primaryArtists">
                            {song.artists.join(", ")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCard3">
                  <div className="primaryTitle">top songs</div>
                  {user2TopSongs.length > 0 ? (
                    user2TopSongs.map((song, index) => (
                      <div key={index} className="item">
                        <img src={song.img} className="primaryImage" />
                        <div className="primaryText">
                          <span className="primaryName">{song.name}</span>
                          <span className="primaryArtists">
                            {song.artists.join(", ")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="compareCard1">
                  <div className="primaryTitle"> top artists</div>
                  {user1TopArtists.length > 0 ? (
                    user1TopArtists.map((artist, index) => (
                      <div key={index} className="item">
                        <img src={artist.img} className="primaryImage" />
                        <div className="primaryText">
                          <span className="primaryName">{artist.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCard2">
                  <div className="primaryTitle"> top artists</div>
                  {sharedTopArtists.length > 0 ? (
                    sharedTopArtists.map((artist, index) => (
                      <div key={index} className="item">
                        <img src={artist.img} className="primaryImage" />
                        <div className="primaryText">
                          <span className="primaryName">{artist.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCard3">
                  <div className="primaryTitle"> top artists</div>
                  {user2TopArtists.length > 0 ? (
                    user2TopArtists.map((artist, index) => (
                      <div key={index} className="item">
                        <img src={artist.img} className="primaryImage" />
                        <div className="primaryText">
                          <span className="primaryName">{artist.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="compareCard1">
                  <div className="primaryTitle"> top albums</div>
                  {user1TopAlbums.length > 0 ? (
                    user1TopAlbums.map((album, index) => (
                      <div key={index} className="item">
                        <img src={album.img} className="primaryImage" />
                        <div className="primaryText">
                          <span className="primaryName">{album.name}</span>
                          <span className="primaryArtists">
                            {album.artists.join(", ")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCard2">
                  <div className="primaryTitle"> top albums</div>
                  {sharedTopAlbums.length > 0 ? (
                    sharedTopAlbums.map((album, index) => (
                      <div key={index} className="item">
                        <img src={album.img} className="primaryImage" />
                        <div className="primaryText">
                          <span className="primaryName">{album.name}</span>
                          <span className="primaryArtists">
                            {album.artists.join(", ")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCard3">
                  <div className="primaryTitle"> top albums</div>
                  {user2TopAlbums.length > 0 ? (
                    user2TopAlbums.map((album, index) => (
                      <div key={index} className="item">
                        <img src={album.img} className="primaryImage" />
                        <div className="primaryText">
                          <span className="primaryName">{album.name}</span>
                          <span className="primaryArtists">
                            {album.artists.join(", ")}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="compareCard1">
                  <div className="primaryTitle"> top genres</div>
                  {arrays1.topGenresByArtist.filter(
                    (item) => !overlappingData.topGenresByArtist.includes(item)
                  ).length > 0 &&
                  arrays1.topGenresByArtist &&
                  arrays1.topGenresByArtist[0] !== "No data" ? (
                    arrays1.topGenresByArtist
                      .filter(
                        (item) =>
                          !overlappingData.topGenresByArtist.includes(item)
                      )
                      .map((genre, index) => (
                        <div key={index} className="item">
                          <div className="primaryText">
                            <span className="primaryName">{genre}</span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCard2">
                  <div className="primaryTitle"> top genres</div>
                  {overlappingData.topGenresByArtist.length > 0 &&
                  overlappingData.topGenresByArtist &&
                  overlappingData.topGenresByArtist[0] !== "No data" ? (
                    overlappingData.topGenresByArtist.map((genre, index) => (
                      <div key={index} className="item">
                        <div className="primaryText">
                          <span className="primaryName">{genre}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCard3">
                  <div className="primaryTitle"> top genres</div>
                  {arrays2.topGenresByArtist.filter(
                    (item) => !overlappingData.topGenresByArtist.includes(item)
                  ).length > 0 &&
                  arrays2.topGenresByArtist &&
                  arrays2.topGenresByArtist[0] !== "No data" ? (
                    arrays2.topGenresByArtist
                      .filter(
                        (item) =>
                          !overlappingData.topGenresByArtist.includes(item)
                      )
                      .map((genre, index) => (
                        <div key={index} className="item">
                          <div className="primaryText">
                            <span className="primaryName">{genre}</span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="compareCard1">
                  <div className="primaryTitle"> top labels</div>
                  {arrays1.topLabelsByAlbums.filter(
                    (item) => !overlappingData.topLabelsByAlbums.includes(item)
                  ).length > 0 &&
                  arrays1.topLabelsByAlbums &&
                  arrays1.topLabelsByAlbums[0] !== "No data" ? (
                    arrays1.topLabelsByAlbums
                      .filter(
                        (item) =>
                          !overlappingData.topLabelsByAlbums.includes(item)
                      )
                      .map((label, index) => (
                        <div key={index} className="item">
                          <div className="primaryText">
                            <span className="primaryName">{label}</span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCard2">
                  <div className="primaryTitle"> top labels</div>
                  {overlappingData.topLabelsByAlbums.length > 0 &&
                  overlappingData.topLabelsByAlbums &&
                  overlappingData.topLabelsByAlbums[0] !== "No data" ? (
                    overlappingData.topLabelsByAlbums.map((label, index) => (
                      <div key={index} className="item">
                        <div className="primaryText">
                          <span className="primaryName">{label}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCard3">
                  <div className="primaryTitle"> top labels</div>
                  {arrays2.topLabelsByAlbums.filter(
                    (item) => !overlappingData.topLabelsByAlbums.includes(item)
                  ).length > 0 &&
                  arrays2.topLabelsByAlbums &&
                  arrays2.topLabelsByAlbums[0] !== "No data" ? (
                    arrays2.topLabelsByAlbums
                      .filter(
                        (item) =>
                          !overlappingData.topLabelsByAlbums.includes(item)
                      )
                      .map((label, index) => (
                        <div key={index} className="item">
                          <div className="primaryText">
                            <span className="primaryName">{label}</span>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">most popular song</div>
                  {user1MostLeastPopSongs &&
                  user1MostLeastPopSongs[0] &&
                  arrays1.mostLeastPopSongIds[0] !==
                    arrays2.mostLeastPopSongIds[0] ? (
                    <div className="item">
                      <img
                        src={user1MostLeastPopSongs[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user1MostLeastPopSongs[0]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user1MostLeastPopSongs[0]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user1MostLeastPopSongs[0]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">most popular song</div>
                  {sharedMostLeastPopSongs && sharedMostLeastPopSongs[0] ? (
                    <div className="item">
                      <img
                        src={sharedMostLeastPopSongs[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {sharedMostLeastPopSongs[0]?.name}
                        </span>
                        <span className="primaryArtists">
                          {sharedMostLeastPopSongs[0]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {sharedMostLeastPopSongs[0]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">most popular song</div>
                  {user2MostLeastPopSongs &&
                  user2MostLeastPopSongs[0] &&
                  arrays1.mostLeastPopSongIds[0] !==
                    arrays2.mostLeastPopSongIds[0] ? (
                    <div className="item">
                      <img
                        src={user2MostLeastPopSongs[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user2MostLeastPopSongs[0]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user2MostLeastPopSongs[0]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user2MostLeastPopSongs[0]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">least popular song</div>
                  {user1MostLeastPopSongs &&
                  user1MostLeastPopSongs[1] &&
                  arrays1.mostLeastPopSongIds[1] !==
                    arrays2.mostLeastPopSongIds[1] ? (
                    <div className="item">
                      <img
                        src={user1MostLeastPopSongs[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user1MostLeastPopSongs[1]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user1MostLeastPopSongs[1]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user1MostLeastPopSongs[1]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">least popular song</div>
                  {sharedMostLeastPopSongs && sharedMostLeastPopSongs[1] ? (
                    <div className="item">
                      <img
                        src={sharedMostLeastPopSongs[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {sharedMostLeastPopSongs[1]?.name}
                        </span>
                        <span className="primaryArtists">
                          {sharedMostLeastPopSongs[1]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {sharedMostLeastPopSongs[1]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">least popular song</div>
                  {user2MostLeastPopSongs &&
                  user2MostLeastPopSongs[1] &&
                  arrays1.mostLeastPopSongIds[1] !==
                    arrays2.mostLeastPopSongIds[1] ? (
                    <div className="item">
                      <img
                        src={user2MostLeastPopSongs[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user2MostLeastPopSongs[1]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user2MostLeastPopSongs[1]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user2MostLeastPopSongs[1]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">oldest song</div>
                  {user1OldestNewestSongs &&
                  user1OldestNewestSongs[0] &&
                  arrays1.oldestNewestSongIds[0] !==
                    arrays2.oldestNewestSongIds[0] ? (
                    <div className="item">
                      <img
                        src={user1OldestNewestSongs[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user1OldestNewestSongs[0]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user1OldestNewestSongs[0]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }}>
                          {user1OldestNewestSongs[0]?.date.substr(0, 4)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">oldest song</div>
                  {sharedOldestNewestSongs && sharedOldestNewestSongs[0] ? (
                    <div className="item">
                      <img
                        src={sharedOldestNewestSongs[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {sharedOldestNewestSongs[0]?.name}
                        </span>
                        <span className="primaryArtists">
                          {sharedOldestNewestSongs[0]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }}>
                          {sharedOldestNewestSongs[0]?.date.substr(0, 4)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">oldest song</div>
                  {user2OldestNewestSongs &&
                  user2OldestNewestSongs[0] &&
                  arrays1.oldestNewestSongIds[0] !==
                    arrays2.oldestNewestSongIds[0] ? (
                    <div className="item">
                      <img
                        src={user2OldestNewestSongs[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user2OldestNewestSongs[0]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user2OldestNewestSongs[0]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }}>
                          {user2OldestNewestSongs[0]?.date.substr(0, 4)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">newest song</div>
                  {user1OldestNewestSongs &&
                  user1OldestNewestSongs[1] &&
                  arrays1.oldestNewestSongIds[1] !==
                    arrays2.oldestNewestSongIds[1] ? (
                    <div className="item">
                      <img
                        src={user1OldestNewestSongs[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user1OldestNewestSongs[1]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user1OldestNewestSongs[1]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }}>
                          {user1OldestNewestSongs[1]?.date.substr(0, 4)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">newest song</div>
                  {sharedOldestNewestSongs && sharedOldestNewestSongs[1] ? (
                    <div className="item">
                      <img
                        src={sharedOldestNewestSongs[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {sharedOldestNewestSongs[1]?.name}
                        </span>
                        <span className="primaryArtists">
                          {sharedOldestNewestSongs[1]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }}>
                          {sharedOldestNewestSongs[1]?.date.substr(0, 4)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">newest song</div>
                  {user2OldestNewestSongs &&
                  user2OldestNewestSongs[1] &&
                  arrays1.oldestNewestSongIds[1] !==
                    arrays2.oldestNewestSongIds[1] ? (
                    <div className="item">
                      <img
                        src={user2OldestNewestSongs[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user2OldestNewestSongs[1]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user2OldestNewestSongs[1]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }}>
                          {user2OldestNewestSongs[1]?.date.substr(0, 4)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">most popular artist</div>
                  {user1MostLeastPopArtists &&
                  user1MostLeastPopArtists[0] &&
                  arrays1.mostLeastPopArtistIds[0] !==
                    arrays2.mostLeastPopArtistIds[0] ? (
                    <div className="item">
                      <img
                        src={user1MostLeastPopArtists[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user1MostLeastPopArtists[0]?.name}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user1MostLeastPopArtists[0]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">most popular artist</div>
                  {sharedMostLeastPopArtists && sharedMostLeastPopArtists[0] ? (
                    <div className="item">
                      <img
                        src={sharedMostLeastPopArtists[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {sharedMostLeastPopArtists[0]?.name}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {sharedMostLeastPopArtists[0]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">most popular artist</div>
                  {user2MostLeastPopArtists &&
                  user2MostLeastPopArtists[0] &&
                  arrays1.mostLeastPopArtistIds[0] !==
                    arrays2.mostLeastPopArtistIds[0] ? (
                    <div className="item">
                      <img
                        src={user2MostLeastPopArtists[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user2MostLeastPopArtists[0]?.name}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user2MostLeastPopArtists[0]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">least popular artist</div>
                  {user1MostLeastPopArtists &&
                  user1MostLeastPopArtists[1] &&
                  arrays1.mostLeastPopArtistIds[1] !==
                    arrays2.mostLeastPopArtistIds[1] ? (
                    <div className="item">
                      <img
                        src={user1MostLeastPopArtists[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user1MostLeastPopArtists[1]?.name}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user1MostLeastPopArtists[1]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">least popular artist</div>
                  {sharedMostLeastPopArtists && sharedMostLeastPopArtists[1] ? (
                    <div className="item">
                      <img
                        src={sharedMostLeastPopArtists[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {sharedMostLeastPopArtists[1]?.name}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {sharedMostLeastPopArtists[1]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">least popular artist</div>
                  {user2MostLeastPopArtists &&
                  user2MostLeastPopArtists[1] &&
                  arrays1.mostLeastPopArtistIds[1] !==
                    arrays2.mostLeastPopArtistIds[1] ? (
                    <div className="item">
                      <img
                        src={user2MostLeastPopArtists[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user2MostLeastPopArtists[1]?.name}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user2MostLeastPopArtists[1]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">most popular album</div>
                  {user1MostLeastPopAlbums &&
                  user1MostLeastPopAlbums[0] &&
                  arrays1.mostLeastPopAlbumIds[0] !==
                    arrays2.mostLeastPopAlbumIds[0] ? (
                    <div className="item">
                      <img
                        src={user1MostLeastPopAlbums[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user1MostLeastPopAlbums[0]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user1MostLeastPopAlbums[0]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user1MostLeastPopAlbums[0]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">most popular album</div>
                  {sharedMostLeastPopAlbums && sharedMostLeastPopAlbums[0] ? (
                    <div className="item">
                      <img
                        src={sharedMostLeastPopAlbums[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {sharedMostLeastPopAlbums[0]?.name}
                        </span>
                        <span className="primaryArtists">
                          {sharedMostLeastPopAlbums[0]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {sharedMostLeastPopAlbums[0]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">most popular album</div>
                  {user2MostLeastPopAlbums &&
                  user2MostLeastPopAlbums[0] &&
                  arrays1.mostLeastPopAlbumIds[0] !==
                    arrays2.mostLeastPopAlbumIds[0] ? (
                    <div className="item">
                      <img
                        src={user2MostLeastPopAlbums[0]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user2MostLeastPopAlbums[0]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user2MostLeastPopAlbums[0]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user2MostLeastPopAlbums[0]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">least popular album</div>
                  {user1MostLeastPopAlbums &&
                  user1MostLeastPopAlbums[1] &&
                  arrays1.mostLeastPopAlbumIds[1] !==
                    arrays2.mostLeastPopAlbumIds[1] ? (
                    <div className="item">
                      <img
                        src={user1MostLeastPopAlbums[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user1MostLeastPopAlbums[1]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user1MostLeastPopAlbums[1]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user1MostLeastPopAlbums[1]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">least popular album</div>
                  {sharedMostLeastPopAlbums && sharedMostLeastPopAlbums[1] ? (
                    <div className="item">
                      <img
                        src={sharedMostLeastPopAlbums[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {sharedMostLeastPopAlbums[1]?.name}
                        </span>
                        <span className="primaryArtists">
                          {sharedMostLeastPopAlbums[1]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {sharedMostLeastPopAlbums[1]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">least popular album</div>
                  {user2MostLeastPopAlbums &&
                  user2MostLeastPopAlbums[1] &&
                  arrays1.mostLeastPopAlbumIds[1] !==
                    arrays2.mostLeastPopAlbumIds[1] ? (
                    <div className="item">
                      <img
                        src={user2MostLeastPopAlbums[1]?.img}
                        className="primaryImage"
                      />
                      <div className="primaryText">
                        <span className="primaryName">
                          {user2MostLeastPopAlbums[1]?.name}
                        </span>
                        <span className="primaryArtists">
                          {user2MostLeastPopAlbums[1]?.artists.join(", ")}
                        </span>
                        <span style={{ paddingLeft: "20px" }} id="popularity">
                          {user2MostLeastPopAlbums[1]?.pop}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="noData">No data</div>
                  )}
                </div>
              </td>
            </tr>

            <tr style={{ height: "80px" }}></tr>
            <tr>
              <td></td>
              <td className="statsHeader">stats</td>
              <td></td>
            </tr>
            <tr style={{ height: "40px" }}></tr>
            <tr>
              <td></td>
              <td className="differencesLabel">differences</td>
              <td></td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1 pieCard">
                  <div className="primaryTitle">
                    song release decade distribution
                  </div>
                  {arrays1.decadesAndPcts &&
                  arrays1.decadesAndPcts[0] === "No data" ? (
                    <div className="noData">No data</div>
                  ) : (
                    <PieChart width={200} height={200}>
                      <Pie
                        data={pieData1}
                        outerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name }) => name} // Set the label to display the name property
                      >
                        {pieData1.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={colors[index % colors.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  )}
                </div>
              </td>
              <td></td>
              <td>
                <div className="compareCardSmall3 pieCard">
                  <div className="primaryTitle">
                    song release decade distribution
                  </div>
                  {arrays2.decadesAndPcts &&
                  arrays2.decadesAndPcts[0] === "No data" ? (
                    <div className="noData">No data</div>
                  ) : (
                    <PieChart width={200} height={200}>
                      <Pie
                        data={pieData2}
                        outerRadius={30}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name }) => name} // Set the label to display the name property
                      >
                        {pieData2.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={colors[index % colors.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">average song popularity</div>
                  {arrays1.avgSongPop && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {arrays1.avgSongPop}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">average song popularity</div>
                  {overlappingData.avgSongPop && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {!isNaN(overlappingData.avgSongPop)
                            ? overlappingData.avgSongPop
                            : "-"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">average song popularity</div>
                  {arrays2.avgSongPop && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {arrays2.avgSongPop}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">
                    song popularity standard deviation
                  </div>
                  {arrays1.songPopStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {arrays1.songPopStdDev}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">
                    song popularity standard deviation
                  </div>
                  {overlappingData.songPopStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {!isNaN(overlappingData.songPopStdDev)
                            ? overlappingData.songPopStdDev
                            : "-"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">
                    song popularity standard deviation
                  </div>
                  {arrays2.songPopStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {arrays2.songPopStdDev}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">average song age</div>
                  {arrays1.avgSongAgeYrMo && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {`${
                            arrays1.avgSongAgeYrMo[0] === 1
                              ? "1 year"
                              : `${arrays1.avgSongAgeYrMo[0]} years`
                          }, ${
                            arrays1.avgSongAgeYrMo[1] === 1
                              ? "1 month"
                              : `${arrays1.avgSongAgeYrMo[1]} months`
                          }`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">average song age</div>
                  {overlappingData.avgSongAgeYrMo && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {isNaN(overlappingData.avgSongAgeYrMo[0]) ||
                          isNaN(overlappingData.avgSongAgeYrMo[1])
                            ? `- years, - months`
                            : `${
                                overlappingData.avgSongAgeYrMo[0] === 1
                                  ? "1 year"
                                  : `${overlappingData.avgSongAgeYrMo[0]} years`
                              }, ${
                                overlappingData.avgSongAgeYrMo[1] === 1
                                  ? "1 month"
                                  : `${overlappingData.avgSongAgeYrMo[1]} months`
                              }`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">average song age</div>
                  {arrays2.avgSongAgeYrMo && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {`${
                            arrays2.avgSongAgeYrMo[0] === 1
                              ? "1 year"
                              : `${arrays2.avgSongAgeYrMo[0]} years`
                          }, ${
                            arrays2.avgSongAgeYrMo[1] === 1
                              ? "1 month"
                              : `${arrays2.avgSongAgeYrMo[1]} months`
                          }`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">
                    song age standard deviation
                  </div>
                  {arrays1.songAgeStdDevYrMo && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {`${
                            arrays1.songAgeStdDevYrMo[0] === 1
                              ? "1 year"
                              : `${arrays1.songAgeStdDevYrMo[0]} years`
                          }, ${
                            arrays1.songAgeStdDevYrMo[1] === 1
                              ? "1 month"
                              : `${arrays1.songAgeStdDevYrMo[1]} months`
                          }`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">
                    song age standard deviation
                  </div>
                  {overlappingData.songAgeStdDevYrMo && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {isNaN(overlappingData.songAgeStdDevYrMo[0]) ||
                          isNaN(overlappingData.songAgeStdDevYrMo[1])
                            ? `- years, - months`
                            : `${
                                overlappingData.songAgeStdDevYrMo[0] === 1
                                  ? "1 year"
                                  : `${overlappingData.songAgeStdDevYrMo[0]} years`
                              }, ${
                                overlappingData.songAgeStdDevYrMo[1] === 1
                                  ? "1 month"
                                  : `${overlappingData.songAgeStdDevYrMo[1]} months`
                              }`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">
                    song age standard deviation
                  </div>
                  {arrays2.songAgeStdDevYrMo && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {`${
                            arrays2.songAgeStdDevYrMo[0] === 1
                              ? "1 year"
                              : `${arrays2.songAgeStdDevYrMo[0]} years`
                          }, ${
                            arrays2.songAgeStdDevYrMo[1] === 1
                              ? "1 month"
                              : `${arrays2.songAgeStdDevYrMo[1]} months`
                          }`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">percent songs explicit</div>
                  {arrays1.pctSongsExpl && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {arrays1.pctSongsExpl}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">percent songs explicit</div>
                  {overlappingData.pctSongsExpl && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {!isNaN(overlappingData.pctSongsExpl)
                            ? overlappingData.pctSongsExpl
                            : "-"}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">percent songs explicit</div>
                  {arrays2.pctSongsExpl && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {arrays2.pctSongsExpl}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">average album popularity</div>
                  {arrays1.avgAlbumPop && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {arrays1.avgAlbumPop}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">average album popularity</div>
                  {overlappingData.avgAlbumPop && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {!isNaN(overlappingData.avgAlbumPop)
                            ? overlappingData.avgAlbumPop
                            : "-"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">average album popularity</div>
                  {arrays2.avgAlbumPop && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {arrays2.avgAlbumPop}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">
                    album popularity standard deviation
                  </div>
                  {arrays1.albumPopsStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {arrays1.albumPopsStdDev}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">
                    album popularity standard deviation
                  </div>
                  {overlappingData.albumPopsStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {!isNaN(overlappingData.albumPopsStdDev)
                            ? overlappingData.albumPopsStdDev
                            : "-"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">
                    album popularity standard deviation
                  </div>
                  {arrays2.albumPopsStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {arrays2.albumPopsStdDev}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">average artist popularity</div>
                  {arrays1.avgArtistPop && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {arrays1.avgArtistPop}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">average artist popularity</div>
                  {overlappingData.avgArtistPop && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {!isNaN(overlappingData.avgArtistPop)
                            ? overlappingData.avgArtistPop
                            : "-"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">average artist popularity</div>
                  {arrays2.avgArtistPop && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {arrays2.avgArtistPop}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">
                    artist popularity standard deviation
                  </div>
                  {arrays1.artistPopStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {arrays1.artistPopStdDev}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">
                    artist popularity standard deviation
                  </div>
                  {overlappingData.artistPopStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {!isNaN(overlappingData.artistPopStdDev)
                            ? overlappingData.artistPopStdDev
                            : "-"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">
                    artist popularity standard deviation
                  </div>
                  {arrays2.artistPopStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {arrays2.artistPopStdDev}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">average artist followers</div>

                  {arrays1.avgArtistFolls && (
                    <div className="item" style={{ fontSize: "20px" }}>
                      <div className="primaryText">
                        <span className="primaryName2">
                          {arrays1.avgArtistFolls}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">average artist followers</div>
                  <div className="item">
                    <div className="primaryText">
                      <span className="primaryName2">
                        {overlappingData.avgArtistFolls}
                        {/* {!isNaN(overlappingData.avgArtistFolls)
                          ? overlappingData.avgArtistFolls
                          : "-"} */}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">average artist followers</div>
                  {arrays2.avgArtistFolls && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2">
                          {arrays2.avgArtistFolls}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <div className="compareCardSmall1">
                  <div className="primaryTitle">
                    artist followers standard deviation
                  </div>
                  {arrays1.artistFollsStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {arrays1.artistFollsStdDev}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
              <td>
                <div className="compareCardSmall2">
                  <div className="primaryTitle">
                    artist followers standard deviation
                  </div>
                  <div className="item">
                    <div className="primaryText">
                      <span className="primaryName2" id="stdDev">
                        {overlappingData.artistFollsStdDev}
                        {/* {!isNaN(overlappingData.artistFollsStdDev)
                          ? overlappingData.artistFollsStdDev
                          : "-"} */}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className="compareCardSmall3">
                  <div className="primaryTitle">
                    artist followers standard deviation
                  </div>
                  {arrays2.artistFollsStdDev && (
                    <div className="item">
                      <div className="primaryText">
                        <span className="primaryName2" id="stdDev">
                          {arrays2.artistFollsStdDev}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}

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
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {features.map((feature, index) => {
              const sharedHighestSong = sharedHighestAudioFeatureSongs[index];
              const sharedLowestSong = sharedLowestAudioFeatureSongs[index];
              const user1HighestSong = user1HighestAudioFeatureSongs[index];
              const user2HighestSong = user2HighestAudioFeatureSongs[index];
              const user1LowestSong = user1LowestAudioFeatureSongs[index];
              const user2LowestSong = user2LowestAudioFeatureSongs[index];

              const sharedHighestSongValue =
                sharedHighestAudioFeatureValues[index];
              const user1HighestSongValue =
                user1HighestAudioFeatureValues[index];
              const user2HighestSongValue =
                user2HighestAudioFeatureValues[index];

              const sharedLowestSongValue =
                sharedLowestAudioFeatureValues[index];
              const user1LowestSongValue = user1LowestAudioFeatureValues[index];
              const user2LowestSongValue = user2LowestAudioFeatureValues[index];

              return (
                <tr key={feature}>
                  <td id={feature}>
                    <span className="audioFeaturesColumnLabel">{feature}</span>
                  </td>
                  <td>
                    <span className="cellOutline1">
                      {arrays1.audioFeatureMeans[index]}
                    </span>
                    <span className="cellOutline2">
                      {(feature !== "duration" &&
                        isNaN(overlappingData.audioFeatureMeans[index])) ||
                      (feature == "duration" &&
                        (isNaN(
                          parseInt(
                            overlappingData.audioFeatureMeans[index].substring(
                              0,
                              2
                            )
                          )
                        ) ||
                          isNaN(
                            parseInt(
                              overlappingData.audioFeatureMeans[
                                index
                              ].substring(3, 5)
                            )
                          )))
                        ? "-"
                        : overlappingData.audioFeatureMeans[index]}
                    </span>
                    <span className="cellOutline3">
                      {arrays2.audioFeatureMeans[index]}
                    </span>
                  </td>

                  <td>
                    <span className="cellOutline1">
                      {arrays1.audioFeatureStdDevs[index]}
                    </span>
                    <span className="cellOutline2">
                      {(feature !== "duration" &&
                        isNaN(overlappingData.audioFeatureStdDevs[index])) ||
                      (feature == "duration" &&
                        (isNaN(
                          parseInt(
                            overlappingData.audioFeatureStdDevs[
                              index
                            ].substring(0, 2)
                          )
                        ) ||
                          isNaN(
                            parseInt(
                              overlappingData.audioFeatureStdDevs[
                                index
                              ].substring(3, 5)
                            )
                          )))
                        ? "-"
                        : overlappingData.audioFeatureStdDevs[index]}
                    </span>
                    <span className="cellOutline3">
                      {arrays2.audioFeatureStdDevs[index]}
                    </span>
                  </td>
                  <td>
                    {user1HighestSong &&
                      user1HighestSong.name &&
                      user1HighestSong.img &&
                      user1HighestSong.artists &&
                      arrays1.highestAudioFeatureSongIds[index] !==
                        arrays2.highestAudioFeatureSongIds[index] && (
                        <div className="songCellOutline1">
                          <div className="cellOutlineCompact">
                            <img
                              className="primaryImage"
                              src={user1HighestSong.img}
                              alt={user1HighestSong.name}
                            />
                            <p className="primaryName">
                              {" "}
                              {user1HighestSong.name}
                            </p>
                            &emsp;
                            <p className="primaryArtists">
                              {user1HighestSong.artists.join(", ")}
                            </p>
                          </div>
                          <span
                            className="cellOutline"
                            style={{ marginLeft: "5px", fontSize: "11px" }}
                          >
                            {user1HighestSongValue}
                          </span>
                          {/*} } */}
                        </div>
                      )}
                    {sharedHighestSong &&
                      sharedHighestSong.name &&
                      sharedHighestSong.img &&
                      sharedHighestSong.artists && (
                        <div className="songCellOutline2">
                          <div className="cellOutlineCompact">
                            <img
                              className="primaryImage"
                              src={sharedHighestSong.img}
                              alt={sharedHighestSong.name}
                            />
                            <p className="primaryName">
                              {" "}
                              {sharedHighestSong.name}
                            </p>
                            &emsp;
                            <p className="primaryArtists">
                              {sharedHighestSong.artists.join(", ")}
                            </p>
                          </div>
                          <span
                            className="cellOutline"
                            style={{ marginLeft: "5px", fontSize: "11px" }}
                          >
                            {sharedHighestSongValue}
                          </span>
                          {/*} } */}
                        </div>
                      )}
                    {user2HighestSong &&
                      user2HighestSong.name &&
                      user2HighestSong.img &&
                      user2HighestSong.artists &&
                      arrays1.highestAudioFeatureSongIds[index] !==
                        arrays2.highestAudioFeatureSongIds[index] && (
                        <div className="songCellOutline3">
                          <div className="cellOutlineCompact">
                            <img
                              className="primaryImage"
                              src={user2HighestSong.img}
                              alt={user2HighestSong.name}
                            />
                            <p className="primaryName">
                              {" "}
                              {user2HighestSong.name}
                            </p>
                            &emsp;
                            <p className="primaryArtists">
                              {user2HighestSong.artists.join(", ")}
                            </p>
                          </div>
                          <span
                            className="cellOutline"
                            style={{ marginLeft: "5px", fontSize: "11px" }}
                          >
                            {user2HighestSongValue}
                          </span>
                          {/*} } */}
                        </div>
                      )}
                  </td>
                  <td>
                    {user1LowestSong &&
                      user1LowestSong.name &&
                      user1LowestSong.img &&
                      user1LowestSong.artists &&
                      arrays1.lowestAudioFeatureSongIds[index] !==
                        arrays2.lowestAudioFeatureSongIds[index] && (
                        <div className="songCellOutline1">
                          <div className="cellOutlineCompact">
                            <img
                              className="primaryImage"
                              src={user1LowestSong.img}
                              alt={user1LowestSong.name}
                            />
                            <p className="primaryName">
                              {" "}
                              {user1LowestSong.name}
                            </p>
                            &emsp;
                            <p className="primaryArtists">
                              {user1LowestSong.artists.join(", ")}
                            </p>
                          </div>
                          <span
                            className="cellOutline"
                            style={{ marginLeft: "5px", fontSize: "11px" }}
                          >
                            {user1LowestSongValue}
                          </span>
                          {/*} } */}
                        </div>
                      )}
                    {sharedLowestSong &&
                      sharedLowestSong.name &&
                      sharedLowestSong.img &&
                      sharedLowestSong.artists && (
                        <div className="songCellOutline2">
                          <div className="cellOutlineCompact">
                            <img
                              className="primaryImage"
                              src={sharedLowestSong.img}
                              alt={sharedLowestSong.name}
                            />
                            <p className="primaryName">
                              {" "}
                              {sharedLowestSong.name}
                            </p>
                            &emsp;
                            <p className="primaryArtists">
                              {sharedLowestSong.artists.join(", ")}
                            </p>
                          </div>
                          <span
                            className="cellOutline"
                            style={{ marginLeft: "5px", fontSize: "11px" }}
                          >
                            {sharedLowestSongValue}
                          </span>
                          {/* } */}
                        </div>
                      )}

                    {user2LowestSong &&
                      user2LowestSong.name &&
                      user2LowestSong.img &&
                      user2LowestSong.artists &&
                      arrays1.lowestAudioFeatureSongIds[index] !==
                        arrays2.lowestAudioFeatureSongIds[index] && (
                        <div className="songCellOutline3">
                          <div className="cellOutlineCompact">
                            <img
                              className="primaryImage"
                              src={user2LowestSong.img}
                              alt={user2LowestSong.name}
                            />
                            <p className="primaryName">
                              {" "}
                              {user2LowestSong.name}
                            </p>
                            &emsp;
                            <p className="primaryArtists">
                              {user2LowestSong.artists.join(", ")}
                            </p>
                          </div>
                          <span
                            className="cellOutline"
                            style={{ marginLeft: "5px", fontSize: "11px" }}
                          >
                            {user2LowestSongValue}
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
      </div>

      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Popup Window"
        style={customStyles}
      >
        <div style={{ textAlign: "center" }}>
          <h2 className="">
            <img
              src={gptBtn}
              style={{ width: "40px", marginRight: "10px" }}
            ></img>
            ChatGPT music analysis<br></br>
            <span style={{ color: "#1e90ff" }}>
              {nameIdImgurlGenerationdate1[0]}
            </span>
            <span style={{ color: "#18d860", fontWeight: "bold" }}> vs. </span>{" "}
            <span style={{ color: "#FFDF00", fontWeight: "bold" }}>
              {nameIdImgurlGenerationdate2[0]}
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
          {!gptLoading && (
            <>
              <button className="closeBtn" onClick={closeModal}>
                Close
              </button>
              <button
                className="saveImg2"
                onClick={handleConvertToImageGPT}
                title="Download image"
              >
                <img src={download} style={{ width: "10px" }}></img>
              </button>
            </>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={gameModalState.gameModalIsOpen}
        onRequestClose={gameModalState.closeGameModal}
        contentLabel="Popup Window"
        style={playModalStyles}
        className="gameModal"
      >
        <style>{mediaQueryStyles}</style>

        <Game
          sharedSongs={sharedTopSongs}
          user1Songs={user1TopSongs}
          user2Songs={user2TopSongs}
          closeGameModal={gameModalState.closeGameModal}
          name1={nameIdImgurlGenerationdate1[0]}
          name2={nameIdImgurlGenerationdate2[0]}
        />
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
            {nameIdImgurlGenerationdate1[0]}
          </span>
          <span style={{ color: "#18d860", fontWeight: "bold" }}> vs. </span>{" "}
          <span style={{ color: "#FFDF00", fontWeight: "bold" }}>
            {nameIdImgurlGenerationdate2[0]}
          </span>
        </h2>
        <span className="timeRange">{selectedTimeRangeClean}</span>
        <ComparePageRecommendations
          display_name1={nameIdImgurlGenerationdate1[0]}
          display_name2={nameIdImgurlGenerationdate2[0]}
          display_name={nameIdImgurlGenerationdate1[0]}
          selectedTimeRange={selectedTimeRangeClean}
          user_id={nameIdImgurlGenerationdate1[1]}
          blendArtistIds={
            overlappingData.artistIds.length <= 5
              ? [...overlappingData.artistIds]
              : [...overlappingData.artistIds]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 2)
          }
          blendGenres={
            overlappingData.topGenresByArtist.length <= 5
              ? [...overlappingData.topGenresByArtist]
              : [...overlappingData.topGenresByArtist]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 1)
          }
          blendTrackIds={
            overlappingData.songIds.length <= 5
              ? [...overlappingData.songIds]
              : [...overlappingData.songIds]
                  .sort(() => 0.5 - Math.random())
                  .slice(0, 2)
          }
          target_acousticness={
            (parseFloat(arrays1.audioFeatureMeans[0]) +
              parseFloat(arrays2.audioFeatureMeans[0])) /
            2
          }
          target_danceability={
            (parseFloat(arrays1.audioFeatureMeans[1]) +
              parseFloat(arrays2.audioFeatureMeans[1])) /
            2
          }
          target_duration_ms={
            (parseInt(arrays1.audioFeatureMeans[2].split(":")[0]) * 60000 +
              parseInt(arrays1.audioFeatureMeans[2].split(":")[1]) * 1000 +
              (parseInt(arrays2.audioFeatureMeans[2].split(":")[0]) * 60000 +
                parseInt(arrays2.audioFeatureMeans[2].split(":")[1]) * 1000)) /
            2
          }
          target_energy={
            (parseFloat(arrays1.audioFeatureMeans[3]) +
              parseFloat(arrays2.audioFeatureMeans[3])) /
            2
          }
          target_instrumentalness={
            (parseFloat(arrays1.audioFeatureMeans[4]) +
              parseFloat(arrays2.audioFeatureMeans[4])) /
            2
          }
          target_liveness={
            (parseFloat(arrays1.audioFeatureMeans[5]) +
              parseFloat(arrays2.audioFeatureMeans[5])) /
            2
          }
          target_loudness={
            (parseFloat(arrays1.audioFeatureMeans[6]) +
              parseFloat(arrays2.audioFeatureMeans[6])) /
            2
          }
          target_popularity={[
            (parseFloat(arrays1.avgSongPop) + parseFloat(arrays2.avgSongPop)) /
              2,
          ]}
          target_speechiness={
            (parseFloat(arrays1.audioFeatureMeans[7]) +
              parseFloat(arrays2.audioFeatureMeans[7])) /
            2
          }
          target_tempo={
            (parseFloat(arrays1.audioFeatureMeans[8]) +
              parseFloat(arrays2.audioFeatureMeans[8])) /
            2
          }
          target_valence={
            (parseFloat(arrays1.audioFeatureMeans[9]) +
              parseFloat(arrays2.audioFeatureMeans[9])) /
            2
          }
          user1AllTopSongs={arrays1.songIds}
          user1AllTopArtists={arrays1.artistIds}
          user1AllTopGenres={arrays1.topGenresByArtist}
          user2AllTopSongs={arrays2.songIds}
          user2AllTopArtists={arrays2.artistIds}
          user2AllTopGenres={arrays2.topGenresByArtist}
          onlyUser1TopSongs={user1TopSongs.map((song) => song.id)}
          onlyUser1TopArtists={user1TopArtists.map((artist) => artist.id)}
          onlyUser1TopGenres={arrays1.topGenresByArtist.filter(
            (item) => !overlappingData.topGenresByArtist.includes(item)
          )}
          onlyUser2TopSongs={user2TopSongs.map((song) => song.id)}
          onlyUser2TopArtists={user2TopArtists.map((artist) => artist.id)}
          onlyUser2TopGenres={arrays2.topGenresByArtist.filter(
            (item) => !overlappingData.topGenresByArtist.includes(item)
          )}

          //       songIds: [],
          // mostLeastPopSongIds: [],
          // decadesAndPcts: [],
          // oldestNewestSongIds: [],
          // avgSongPop: [],
          // songPopStdDev: [],
          // avgSongAgeYrMo: [],
          // songAgeStdDevYrMo: [],
          // pctSongsExpl: [],
          // audioFeatureMeans: [],
          // audioFeatureStdDevs: [],
          // highestAudioFeatureSongIds: [],
          // lowestAudioFeatureSongIds: [],
          // albumIds: [],
          // mostLeastPopAlbumIds: [],
          // avgAlbumPop: [],
          // albumPopsStdDev: [],
          // topLabelsByAlbums: [],
          // artistIds: [],
          // mostLeastPopArtistIds: [],
          // avgArtistPop: [],
          // artistPopStdDev: [],
          // avgArtistFolls: [],
          // artistFollsStdDev: [],
          // topGenresByArtist: [],
        />
      </Modal>

      <div style={{ width: "0", height: "0", overflow: "hidden" }}>
        <div id="gptImgDiv" style={{ width: 500, padding: "20px" }}>
          <h2 className="gptModalTitle">
            <img
              src={gptBtn}
              style={{ width: "40px", marginRight: "10px" }}
            ></img>
            ChatGPT music analysis<br></br>
            <span style={{ color: "#1e90ff" }}>
              {nameIdImgurlGenerationdate1[0]}
            </span>
            <span style={{ color: "#18d860", fontWeight: "bold" }}> vs. </span>{" "}
            <span style={{ color: "#FFDF00", fontWeight: "bold" }}>
              {nameIdImgurlGenerationdate2[0]}
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
      </div>

      <ReactTooltip
        anchorSelect="#generationDateTooltip1"
        html={`Generated ${generationDateTime1}`}
        style={{
          fontWeight: "bold",
          fontSize: "12px",

          marginBottom: "10px",
          marginTop: "10px",
          width: "fit-content",
          borderRadius: "10px",
          margin: "10px auto",
          padding: "2px 5px",
        }}
        clickable={"true"}
      ></ReactTooltip>

      <ReactTooltip
        anchorSelect="#generationDateTooltip2"
        html={`Generated ${generationDateTime2}`}
        style={{
          fontWeight: "bold",
          fontSize: "12px",

          marginBottom: "10px",
          marginTop: "10px",
          width: "fit-content",
          borderRadius: "10px",
          margin: "10px auto",
          padding: "2px 5px",
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

      <ReactTooltip
        id="downloadScoreImageTooltip"
        style={{
          fontSize: 12,
          pointerEvents: "auto !important",
          fontWeight: "bold",
          borderRadius: "10px",
          zIndex: "2",
          wordBreak: "break-word",
          width: "fit-content",
        }}
      ></ReactTooltip>

      <ReactTooltip
        id="column1"
        style={{
          fontSize: 12,
          pointerEvents: "auto !important",
          fontWeight: "bold",
          borderRadius: "10px",
          zIndex: "2",
          wordBreak: "break-word",
          width: "fit-content",
        }}
      ></ReactTooltip>

      <ReactTooltip
        id="column2"
        style={{
          fontSize: 12,
          pointerEvents: "auto !important",
          fontWeight: "bold",
          borderRadius: "10px",
          zIndex: "2",
          wordBreak: "break-word",
          width: "fit-content",
        }}
      ></ReactTooltip>

      <ReactTooltip
        id="column3"
        style={{
          fontSize: 12,
          pointerEvents: "auto !important",
          fontWeight: "bold",
          borderRadius: "10px",
          zIndex: "2",
          wordBreak: "break-word",
          width: "fit-content",
        }}
      ></ReactTooltip>

      <Footer />
    </div>
  );
}

export default Compare;
