import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {useLocation} from 'react-router';
import logo from './img/logo.png';
import missingImage from './img/missingImage.png';
import './App.css';
import Big from 'big.js'
import back from './img/back.png';
import download from './img/download.png';
import Footer from './Footer'
import html2canvas from 'html2canvas';
import gptBtn from './img/gptBtn.png';
import Modal from 'react-modal';

const {Configuration, OpenAIApi} = require("openai");




function Compare() {

  const location = useLocation();


  let file1 = location.state.file1.split(',');
  let file2 = location.state.file2.split(',');
 
  
  const token = location.state.token;

  const [selectedButton, setSelectedButton] = useState(1);
  const [selectedTimeRange, setSelectedTimeRange] = useState('short_term');
  const timeRanges = ['short_term', 'medium_term', 'long_term'];

  const [selectedTimeRangeClean, setSelectedTimeRangeClean] = useState('last month');
  const timeRangesClean = ['last month', 'last 6 months', 'all time'];
  
  const selectButton = (index) => {
    setSelectedButton(index);
    setSelectedTimeRange(timeRanges[index - 1]);

    setSelectedTimeRangeClean(timeRangesClean[index - 1]);
  };


  const navigate = useNavigate();


  const nameIdImgurlGenerationdate1 = file1.slice(1, 5);
  const nameIdImgurlGenerationdate2 = file2.slice(1, 5);
  if(file1.indexOf('nameIdImgurlGenerationdate[4]') === -1 || file2.indexOf('nameIdImgurlGenerationdate[4]') === -1 || nameIdImgurlGenerationdate1.length !== 4 || nameIdImgurlGenerationdate2.length !== 4 || nameIdImgurlGenerationdate1[2].substring(0,8) !== 'https://' || nameIdImgurlGenerationdate2[2].substring(0,8) !== 'https://') {
    navigate('/code', {state: {error: 400}});
  }
  

  const file1StartIndex = file1.indexOf(selectedTimeRange) + 1;
  const file1EndIndex = (selectedTimeRange === 'long_term') ? file1.length - 1 : file1.indexOf(timeRanges[timeRanges.indexOf(selectedTimeRange) + 1]) - 1;
  

  const file2StartIndex = file2.indexOf(selectedTimeRange) + 1;
  const file2EndIndex = (selectedTimeRange === 'long_term') ? file2.length - 1 : file2.indexOf(timeRanges[timeRanges.indexOf(selectedTimeRange) + 1]) - 1;

  const data1 = file1.slice(file1StartIndex, file1EndIndex + 1);
  const data2 = file2.slice(file2StartIndex, file2EndIndex + 1);

  
  const labels = ['songIds[<=50]', 'mostLeastPopSongIds[<=2]', 'oldestNewestSongIds[<=2]',
                'avgSongPop[1]', 'songPopStdDev[1]', 'avgSongAgeYrMo[2]',
                'songAgeStdDevYrMo[2]', 'pctSongsExpl[1]', 'audioFeatureMeans[11]',
                'audioFeatureStdDevs[11]', 'highestAudioFeatureSongIds[<=11]',
                'lowestAudioFeatureSongIds[<=11]', 'albumIds[<=10]', 'mostLeastPopAlbumIds[<=2]',
                'avgAlbumPop[1]', 'albumPopsStdDev[1]', 'topLabelsByAlbums[<=5]',
                'artistIds[<=50]', 'mostLeastPopArtistIds[<=2]', 'avgArtistPop[1]',
                'artistPopStdDev[1]', 'avgArtistFolls[1]', 'artistFollsStdDev[1]', 'topGenresByArtist[<=20]'];

  const arrays1 = {
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
    topGenresByArtist: []
  };

  const arrays2 = {
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
    topGenresByArtist: []
  };

  function countOccurrences(arr, searchString) {
    return arr.reduce(function (count, element) {
      if (typeof element === 'string' && element.includes(searchString)) {
        count++;
      }
      return count;
    }, 0);
  }

  
  for(let i = 0; i < labels.length; i++) {
    if(countOccurrences(data1, labels[i]) !== 1 || countOccurrences(data2, labels[i]) !== 1) {
      navigate('/code', {state: {error: 400}});
    }
  }







  for(let i = 0; i < labels.length - 1; i++) {
    const startIndex = data1.indexOf(labels[i]) + 1;
    const endIndex = data1.indexOf(labels[i + 1]);

    const key = labels[i].substring(0, labels[i].indexOf('['));
    arrays1[key] = data1.slice(startIndex, endIndex);
  }

  arrays1.topGenresByArtist = data1.slice(data1.indexOf('topGenresByArtist[<=20]') + 1);


  for(let i = 0; i < labels.length - 1; i++) {
    const startIndex = data2.indexOf(labels[i]) + 1;
    const endIndex = data2.indexOf(labels[i + 1]);

    const key = labels[i].substring(0, labels[i].indexOf('['));
    arrays2[key] = data2.slice(startIndex, endIndex);
  }

  arrays2.topGenresByArtist = data2.slice(data2.indexOf('topGenresByArtist[<=20]') + 1);

 

  
  let entryCount1 = 0;
  let entryCount2 = 0;

  for (const key in arrays1) {
    if (Array.isArray(arrays1[key]) && key !== 'avgSongAgeYrMo' && key !==  'songAgeStdDevYrMo') {
      entryCount1 += arrays1[key].length;
    } else {
      entryCount1++;
    }
  }

  for (const key in arrays2) {
    if (Array.isArray(arrays2[key]) && key !== 'avgSongAgeYrMo' && key !==  'songAgeStdDevYrMo') {
      entryCount2 += arrays2[key].length;
    } else {
      entryCount2++;
    }
  }





function expandNumber(simplifiedNumber) {
  const abbreviations = {
    K: 1000,
    M: 1000000,
    B: 1000000000,
  };

  const suffix = simplifiedNumber.slice(-1);
  const numericValue = parseFloat(simplifiedNumber);

  if (abbreviations.hasOwnProperty(suffix)) {
    return numericValue * abbreviations[suffix];
  }

  return numericValue;
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
  const [minutes1, seconds1] = minSec1.split(':').map(Number);
  const [minutes2, seconds2] = minSec2.split(':').map(Number);

  const diffMinutes = Math.abs(minutes1 - minutes2);
  const diffSeconds = Math.abs(seconds1 - seconds2);

  return `${diffMinutes}:${diffSeconds.toString().padStart(2, '0')}`;
}







const overlappingData = {};

for (const field in arrays1) {
  if (arrays1.hasOwnProperty(field) && arrays2.hasOwnProperty(field)) {
    if (
      field === 'avgSongPop' ||
      field === 'songPopStdDev' ||
      field === 'pctSongsExpl' ||
      field === 'avgAlbumPop' ||
      field === 'albumPopsStdDev' ||
      field === 'avgArtistPop' ||
      field === 'artistPopStdDev'
    ) {
      overlappingData[field] = Math.abs(arrays1[field] - arrays2[field]).toFixed(2);
    } else if (field === 'avgSongAgeYrMo' || field === 'songAgeStdDevYrMo') {
      overlappingData[field] = getMonthDifference(arrays1[field], arrays2[field]);
    } else if (field === 'avgArtistFolls' || field === 'artistFollsStdDev') {
      overlappingData[field] = simplifyNumber(Math.abs(expandNumber(arrays1[field]) - expandNumber(arrays2[field])))
    } else if (field === 'audioFeatureMeans' || field === 'audioFeatureStdDevs') {
      const array1 = arrays1[field];
      const array2 = arrays2[field];

      const overlappingArray = [];
      for (let i = 0; i < array1.length; i++) {
        if (i !== 2) { 
          overlappingArray.push(Math.abs(parseFloat(array1[i]) - parseFloat(array2[i])).toFixed(2));
        } else {
          overlappingArray.push(getAbsDiffMinSec(array1[i], array2[i]));
        }
      }
      overlappingData[field] = overlappingArray;
    } else if (field === 'mostLeastPopSongIds') {
      const overlappingArray = [];
      if(arrays1.mostLeastPopSongIds[0] === arrays2.mostLeastPopSongIds[0]) {
        overlappingArray.push(arrays1.mostLeastPopSongIds[0]);
      }
      else {
        overlappingArray.push('');
      }

      if(arrays1.mostLeastPopSongIds[1] === arrays2.mostLeastPopSongIds[1]) {
        overlappingArray.push(arrays1.mostLeastPopSongIds[1]);
      }
      else {
        overlappingArray.push('');
      }

      overlappingData[field] = overlappingArray;
      // console.log([arrays1.mostLeastPopSongIds[0], arrays1.mostLeastPopSongIds[1]]);
      // console.log([arrays2.mostLeastPopSongIds[0], arrays2.mostLeastPopSongIds[1]]);
      // console.log(overlappingData[field]);
    } else {
      overlappingData[field] = arrays1[field].filter((value) => arrays2[field].includes(value));
    }
  }
}









function calculateDurationSimilarity(duration1, duration2) {
  const [min1, sec1] = duration1.split(":").map(Number);
  const [min2, sec2] = duration2.split(":").map(Number);

  const durationInSeconds1 = min1 * 60 + sec1;
  const durationInSeconds2 = min2 * 60 + sec2;

  const differenceInSeconds = Math.abs(durationInSeconds1 - durationInSeconds2);

  const similarity = 1 - differenceInSeconds / Math.max(durationInSeconds1, durationInSeconds2);

  return similarity;
}



function calculateDateSimilarity(date1, date2) {
  var months1 = date1[0] * 12 + date1[1];
  var months2 = date2[0] * 12 + date2[1];
  
  var difference = Math.abs(months1 - months2);
  var maxDifference = Math.max(months1, months2);
  
  var similarity = 1 - (difference / maxDifference);
  return similarity;
}

function calculateSimilarity(number1, number2, threshold) {
  var difference = Math.abs(number1 - number2);
  if (difference === 0) {
    return 1;
  } else if (difference <= threshold) {
    return 1 - (difference / threshold);
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
        if (typeof obj[key][i] === 'number') {
          sum += obj[key][i];
        }
      }
    } else if (typeof obj[key] === 'number') {
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

  const [value1, abbreviation1] = extractFollowerCountValueAndAbbreviation(number1);
  const [value2, abbreviation2] = extractFollowerCountValueAndAbbreviation(number2);

  if (abbreviation1 !== abbreviation2) {
    return 0; 
  }

  const fullValue1 = value1 * abbreviations[abbreviation1];
  const fullValue2 = value2 * abbreviations[abbreviation2];

  const similarity = 1 - Math.abs(fullValue1 - fullValue2) / Math.max(fullValue1, fullValue2);
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
  var similarity = 1 - (difference / maxDifference);
  return similarity;
}






const similarities = {};

for (const field in arrays1) {
  if (arrays1.hasOwnProperty(field) && arrays2.hasOwnProperty(field)) {
    if (
      field === 'avgSongPop' ||
      field === 'songPopStdDev' ||
      field === 'pctSongsExpl' ||
      field === 'avgAlbumPop' ||
      field === 'albumPopsStdDev' ||
      field === 'avgArtistPop' ||
      field === 'artistPopStdDev'
    ) {
      similarities[field] = calculateSimilarity(parseFloat(arrays1[field]), parseFloat(arrays2[field]));
    } else if (field === 'avgSongAgeYrMo' || field === 'songAgeStdDevYrMo') {
      similarities[field] = calculateDateSimilarity(arrays1[field], arrays2[field]);
    } else if (field === 'avgArtistFolls' || field === 'artistFollsStdDev') {
      similarities[field] = compareFollowerCounts(arrays1[field].toString(), arrays2[field].toString());
    } else if (field === 'audioFeatureMeans') {
      const array1 = arrays1[field];
      const array2 = arrays2[field];

      const similarityArray = [];
      for (let i = 0; i < array1.length; i++) {
        if (i !== 2) { 
          similarityArray.push(calculateSimilarity(parseFloat(array1[i]), parseFloat(array2[i])));
        } else {
          similarityArray.push(calculateDurationSimilarity(array1[i], array2[i]));
        }
      }
      similarities[field] = similarityArray;
    } else if (field === 'audioFeatureStdDevs') {
      const array1 = arrays1[field];
      const array2 = arrays2[field];

      const similarityArray = [];
      for (let i = 0; i < array1.length; i++) {
        if (i !== 2) { 
          similarityArray.push(calculateSimilarity(parseFloat(array1[i]), parseFloat(array2[i])));
        } else {
          similarityArray.push(calculateDurationSimilarity(array1[i], array2[i]));
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
    similaritiesCount += overlappingData[key].length;
  }
}







const similarityPct = similaritiesCount / (0.5 * (entryCount1 + entryCount2)) * 100;




const getSongs = async (songIds, arrayToSet) => {
  if(songIds.length > 0) {
    const {data} = await axios.get("https://api.spotify.com/v1/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: songIds.join(',')
      }
    });

    const songsData = data.tracks.map(track => ({
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      img: track.album.images[0]?.url || missingImage
    }));
    
    arrayToSet(songsData);
  }
  else {
    arrayToSet([])
  }
};

const getHighestAudioFeatureSongs = async (songIds) => {
  if(songIds.length > 0) {
    const {data} = await axios.get("https://api.spotify.com/v1/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: songIds.join(',')
      }
    });

    const highestAudioFeatureSongsData = data.tracks.map(track => ({
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      img: track.album.images[0]?.url || missingImage
    }));

    setHighestAudioFeatureSongs(highestAudioFeatureSongsData);
  }
  else {
    setHighestAudioFeatureSongs(['Not enough data to compute']);
  }
};

const getLowestAudioFeatureSongs = async (songIds) => {
  if(songIds.length > 0) {
    const {data} = await axios.get("https://api.spotify.com/v1/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: songIds.join(',')
      }
    });

    const lowestAudioFeatureSongsData = data.tracks.map(track => ({
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      img: track.album.images[0]?.url || missingImage
    }));

    setLowestAudioFeatureSongs(lowestAudioFeatureSongsData);
  }
  else {
    setLowestAudioFeatureSongs(['Not enough data to compute']);
  }
};




const getMostLeastPopSongs = async (songIds, arrayToSet) => {
  if(songIds.length == 0 || (songIds[0] == '' && songIds[1] == '')) {
    arrayToSet(['','']);
    return;
  }
  
  let ids = songIds.join(',');
  let indices = '01';
  if(songIds[0] == '') {
    ids = songIds[1];
    indices = '1'
  }
  else if(songIds[1] == '') {
    ids = songIds[0];
    indices = '0'
  }
  
  
  
  
    const {data} = await axios.get("https://api.spotify.com/v1/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: ids
      }
    });

     const mostLeastPopSongsData = data.tracks.map(track => ({
      name: track.name,
      pop: track.popularity,
      artists: track.artists.map(artist => artist.name),
      img: track.album.images[0]?.url || missingImage
    }));
  
    if(indices == '01') {
      arrayToSet(mostLeastPopSongsData);
    }
    else if(indices == '1') {
      arrayToSet(['',mostLeastPopSongsData[0]]);
    }
    else if(indices == '0') {
      arrayToSet([mostLeastPopSongsData[0],'']);
    }
};

const getOldestNewestSongs = async (songIds) => {
  if(songIds.length > 0) {
    const {data} = await axios.get("https://api.spotify.com/v1/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: songIds.join(',')
      }
    });

    const oldestNewestSongsData = data.tracks.map(track => ({
      name: track.name,
      date: track.album.release_date,
      artists: track.artists.map(artist => artist.name),
      img: track.album.images[0]?.url || missingImage
    }));

    setOldestNewestSongs(oldestNewestSongsData);
  }
  else {
    setOldestNewestSongs(['Not enough data to compute']);
  }
};

const getAlbums = async (albumIds, arrayToSet) => {
  if(albumIds.length > 0) {
    const maxAlbumsPerRequest = 20;
    const albumChunks = [];

    for (let i = 0; i < albumIds.length; i += maxAlbumsPerRequest) {
      albumChunks.push(albumIds.slice(i, i + maxAlbumsPerRequest));
    }

    const albumData = [];

    for(const albumChunk of albumChunks) {
      const {data} = await axios.get("https://api.spotify.com/v1/albums", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          ids: albumChunk.join(',')
        }
      });

      const chunkAlbumsData = data.albums.map(album => ({
        name: album.name,
        artists: album.artists.map(artist => artist.name),
        img: album.images[0]?.url || missingImage
      }));

      albumData.push(...chunkAlbumsData);
    }

    arrayToSet(albumData);
  } 
  else {
    arrayToSet([]);
  }
};

const getMostLeastPopAlbums = async (albumIds) => {
  if(albumIds.length > 0) {
    const {data} = await axios.get("https://api.spotify.com/v1/albums", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: albumIds.join(',')
      }
    });

    const mostLeastPopAlbumsData = data.albums.map(album => ({
      name: album.name,
      pop: album.popularity,
      artists: album.artists.map(artist => artist.name),
      img: album.images[0]?.url || missingImage
    }));
    
    setMostLeastPopAlbums(mostLeastPopAlbumsData);
  }
  else {
    setMostLeastPopAlbums(['Not enough data to compute']);
  }
};


const getArtists = async (artistIds, arrayToSet) => {
  if(artistIds.length > 0) {
    const {data} = await axios.get("https://api.spotify.com/v1/artists", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: artistIds.join(',')
      }
    });

    const artistData = data.artists.map(artist => ({
      name: artist.name,
      img: artist.images[0]?.url || missingImage
    }));
    
    arrayToSet(artistData);
  }
  else {
    arrayToSet([]);
  }
};

const getMostLeastPopArtists = async (artistIds) => {
  if(artistIds.length > 0) {
    const {data} = await axios.get("https://api.spotify.com/v1/artists", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: artistIds.join(',')
      }
    });

    const mostLeastPopArtistsData = data.artists.map(artist => ({
      name: artist.name,
      pop: artist.popularity,
      img: artist.images[0]?.url || missingImage
    }));
    
    setMostLeastPopArtists(mostLeastPopArtistsData);
  }
  else {
    setMostLeastPopArtists(['Not enough data to compute']);
  }
};

function handleConvertToImage() {
  const div = document.getElementById("imgDiv");
  if (div) {
    html2canvas(div, {}).then((canvas) => {
      
      const image = canvas.toDataURL("image/png");
      console.log(image, "image");

      var fileName = 'Your comparify score with ' + nameIdImgurlGenerationdate2[0].replace(/\./g, '') + '.png';
      downloadPNG(image, fileName);
    });
  }
};








function downloadPNG(url, filename) {
  var anchorElement = document.createElement('a');
  anchorElement.href = url;
  anchorElement.download = filename;
  
  // Trigger a click event on the anchor element
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



const [highestAudioFeatureSongs, setHighestAudioFeatureSongs] = useState([]);
const [lowestAudioFeatureSongs, setLowestAudioFeatureSongs] = useState([]);
const [oldestNewestSongs, setOldestNewestSongs] = useState([]);
const [mostLeastPopAlbums, setMostLeastPopAlbums] = useState([]);




const [mostLeastPopArtists, setMostLeastPopArtists] = useState([]);

useEffect(() => {
  getSongs(overlappingData.songIds, setSharedTopSongs);
  getSongs(arrays1.songIds.filter(item => !overlappingData.songIds.includes(item)), setUser1TopSongs);
  getSongs(arrays2.songIds.filter(item => !overlappingData.songIds.includes(item)), setUser2TopSongs);




  getHighestAudioFeatureSongs(overlappingData.highestAudioFeatureSongIds);
  getLowestAudioFeatureSongs(overlappingData.lowestAudioFeatureSongIds);



  getMostLeastPopSongs(overlappingData.mostLeastPopSongIds, setSharedMostLeastPopSongs);
  getMostLeastPopSongs(arrays1.mostLeastPopSongIds, setUser1MostLeastPopSongs);
  getMostLeastPopSongs(arrays2.mostLeastPopSongIds, setUser2MostLeastPopSongs);
  





  getOldestNewestSongs(overlappingData.oldestNewestSongIds);


  getAlbums(overlappingData.albumIds, setSharedTopAlbums);
  getAlbums(arrays1.albumIds.filter(item => !overlappingData.albumIds.includes(item)), setUser1TopAlbums);
  getAlbums(arrays2.albumIds.filter(item => !overlappingData.albumIds.includes(item)), setUser2TopAlbums);



  getMostLeastPopAlbums(overlappingData.mostLeastPopAlbumIds);

  getArtists(overlappingData.artistIds, setSharedTopArtists);
  getArtists(arrays1.artistIds.filter(item => !overlappingData.artistIds.includes(item)), setUser1TopArtists);
  getArtists(arrays2.artistIds.filter(item => !overlappingData.artistIds.includes(item)), setUser2TopArtists);

  getMostLeastPopArtists(overlappingData.mostLeastPopArtistIds);
}, [selectedTimeRange]);
  

const features = ['acousticness','danceability','duration','energy','instrumentalness','liveness','loudness','speechiness','tempo','valence'];














































const openModal = async () => {
  setIsOpen(true);
  await handleGptSumbit();
};

const handleGptSumbit = async () => {
  setGptLoading(true);
  let gptPrompt = 'Compare and contrast ' + nameIdImgurlGenerationdate1[0] + ' and ' + nameIdImgurlGenerationdate2[0] + "'s music taste in the form of a short poem.";

  if(!gptPrompt) {
    gptPrompt = "Display the following statement (without quotes around it): Prompt error. Try again.";
  }
  console.log(gptPrompt);
  
  try {
    const result = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: gptPrompt,
      temperature: 1,
      max_tokens: 700,
    });
    console.log("response", result.data.choices[0].text);
    setApiResponse(result.data.choices[0].text);
  } catch(error) {
    console.log(error);
    setApiResponse("ChatGPT error. This is likely a rate limit. Try again in a minute or so.");
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
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      
      
    },
    content: {
      zIndex: 9999,
      width: '400px',
      height: 'fit-content',
      margin: 'auto',
      borderRadius: '10px',
      outline: 'none',
      padding: '20px',

      maxHeight: '400px',
      overflowY: 'auto'
    }
  };


  Modal.setAppElement('#root')

  const configuration = new Configuration({
    organization: "org-K3YIyvzJixL8ZKFVjQJCKBMP",
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  delete configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(configuration);
  const [apiResponse, setApiResponse] = useState("");


  const [gptLoading, setGptLoading] = useState(false);



    return (
      
        <div>





          <img src={logo} style={{width:80,paddingTop:'20px'}}></img>
          <h3>comparify results<span>&emsp;<img id='gptTooltip' className='zoom' onClick={openModal} src={gptBtn} style={{width:'15px',cursor:'pointer'}}></img></span></h3>
          <div className="container">
        <div className="image">
            <img src={nameIdImgurlGenerationdate1[2]} style={{width:'30px', borderRadius:'50%',paddingLeft:'10px', paddingRight:'10px'}} alt="Image 1"></img>
            <div className="text" style={{color:'#1e90ff', fontWeight:'bold'}}>{nameIdImgurlGenerationdate1[0]}</div>
        </div>
        <span style={{color:'#18d860', fontWeight:'bold'}}>vs.</span>
        <div className="image">
            <img src={nameIdImgurlGenerationdate2[2]} style={{width:'30px', borderRadius:'50%',paddingLeft:'10px', paddingRight:'10px'}} alt="Image 2"></img>
            <div className="text" style={{color:'#FFDF00', fontWeight:'bold'}}>{nameIdImgurlGenerationdate2[0]}</div>
        </div>

    </div>
          <h2>
    <span
      style={{
        background:
          'linear-gradient(to right, #1e90ff 0%, #1e90ff 40%, #18d860 40%, #18d860 60%, #FFDF00 60%, #FFDF00 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {similarityPct.toFixed(3)}%
    </span>
   
    <span style={{ fontSize: '16px' }}> similar&emsp;</span>
    
    <button className="saveImg" onClick={handleConvertToImage} title='Download score image'><img src={download} style={{width:'10px'}}></img></button>
  </h2>

  <div style={{width:'0',height:'0',overflow:'hidden'}}>

                        <div id="imgDiv" style={{width:200}}>

                                <img src={logo} style={{width:80,paddingTop:'20px'}}></img>
                                <h3>comparify score</h3>
                                <h4><span style={{color:'#1e90ff'}}>{nameIdImgurlGenerationdate1[0]}</span> <span style={{color:'#18d860'}}>vs.</span> <span style={{color:'#FFDF00'}}>{nameIdImgurlGenerationdate2[0]}</span></h4>
                                {/* <h2>{similarityPct.toFixed(3)}% <span style={{fontSize:'16px'}}>similar</span></h2> */}
                                <span className="timeRange">{selectedTimeRangeClean}</span>
                                
                                <h2>
                          <span
                            
                          >
                            {similarityPct.toFixed(3)}&nbsp;%
                          </span>
                        
                          <span style={{ fontSize: '16px' }}>&emsp;similar</span>
                          
                        </h2>
                        </div>
                        </div>


          <div className="navBtnContainer">
          <div className="leftNavBtnContainer">
            <Link to='/code' title="Back">
    <button className="leftNavBtn"><img src={back} style={{width:'13px'}}></img></button>
    </Link>
  </div>
            <div className="navBtnOverlay">
              <button className={`navBtn ${selectedButton === 1 ? 'selected' : ''}`} onClick={() => selectButton(1)}>last month</button>
              <button className={`navBtn ${selectedButton === 2 ? 'selected' : ''}`} onClick={() => selectButton(2)}>last 6 months</button>
              <button className={`navBtn ${selectedButton === 3 ? 'selected' : ''}`} onClick={() => selectButton(3)}>all time</button>
            </div>
          </div>



  <table className='compareTable'>
  <tbody>
    <tr>
      <th>
        <div className="image">
            <img src={nameIdImgurlGenerationdate1[2]} style={{width:'30px', borderRadius:'50%',paddingLeft:'10px', paddingRight:'10px'}} alt="Image 1"></img>
            <div className="text" style={{color:'#1e90ff', fontWeight:'bold'}}>{nameIdImgurlGenerationdate1[0]}</div>
        </div>
      </th>
      <th>
        <div className="container" style={{color:'#18d860', fontWeight:'bold'}}>
          <div className="image">
            <img src={nameIdImgurlGenerationdate1[2]} style={{width:'30px', borderRadius:'50%',paddingLeft:'10px', paddingRight:'10px'}} alt="Image 1"></img>
            <div className="text" style={{color:'#1e90ff', fontWeight:'bold'}}>{nameIdImgurlGenerationdate1[0]}</div>
          </div>
          <span>+</span>
          <div className="image">
            <img src={nameIdImgurlGenerationdate2[2]} style={{width:'30px', borderRadius:'50%',paddingLeft:'10px', paddingRight:'10px'}} alt="Image 2"></img>
            <div className="text" style={{color:'#FFDF00', fontWeight:'bold'}}>{nameIdImgurlGenerationdate2[0]}</div>
          </div>
        </div>
      </th>
      <th>
        <div className="image">
            <img src={nameIdImgurlGenerationdate2[2]} style={{width:'30px', borderRadius:'50%',paddingLeft:'10px', paddingRight:'10px'}} alt="Image 1"></img>
            <div className="text" style={{color:'#FFDF00', fontWeight:'bold'}}>{nameIdImgurlGenerationdate2[0]}</div>
        </div>
      </th>
    </tr>
    <tr>
      <td>
        <div className='compareCard1'>
          <div className='primaryTitle'>top songs</div>
          {user1TopSongs.length > 0 &&
            user1TopSongs.map((song, index) => (
              <div key={index} className="item">
                <img src={song.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">{song.name}</span>
                  <span className="primaryArtists">{song.artists.join(', ')}</span>
                </div>
              </div>
            ))
            }
        </div>
      </td>
      <td>
        <div className='compareCard2'>
          <div className='primaryTitle'>top songs</div>
          {sharedTopSongs.length > 0 &&
            sharedTopSongs.map((song, index) => (
            <div key={index} className="item">
              <img src={song.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{song.name}</span>
                <span className="primaryArtists">{song.artists.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      </td>
      <td>
        <div className='compareCard3'>
          <div className='primaryTitle'>top songs</div>
          {user2TopSongs.length > 0 &&
            user2TopSongs.map((song, index) => (
              <div key={index} className="item">
                <img src={song.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">{song.name}</span>
                  <span className="primaryArtists">{song.artists.join(', ')}</span>
                </div>
              </div>
            ))
            }
        </div>
        </td>
    </tr>
    <tr>
      <td>
        <div className='compareCard1'>
          <div className='primaryTitle'> top artists</div>
          {user1TopArtists.length > 0 &&
            user1TopArtists.map((artist, index) => (
              <div key={index} className="item">
                <img src={artist.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">{artist.name}</span>
                </div>
              </div>
            ))
            }
        </div>
      </td>
      <td>
        <div className='compareCard2'>
          <div className='primaryTitle'> top artists</div>
          {sharedTopArtists.length > 0 &&
            sharedTopArtists.map((artist, index) => (
              <div key={index} className="item">
                <img src={artist.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">{artist.name}</span>
                </div>
              </div>
            ))
            }
        </div>
      </td>
      <td>
        <div className='compareCard3'>
          <div className='primaryTitle'> top artists</div>
          {user2TopArtists.length > 0 &&
            user2TopArtists.map((artist, index) => (
              <div key={index} className="item">
                <img src={artist.img} className="primaryImage" />
                <div className="primaryText">
                  <span className="primaryName">{artist.name}</span>
                </div>
              </div>
            ))
            }
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div className='compareCard1'>
          <div className='primaryTitle'> top albums</div>
          {user1TopAlbums.length > 0 &&
            user1TopAlbums.map((album, index) => (
              <div key={index} className="item">
              <img src={album.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{album.name}</span>
                <span className="primaryArtists">{album.artists.join(', ')}</span>
              </div>
            </div>
            ))
            }
        </div>
      </td>
      <td>
        <div className='compareCard2'>
          <div className='primaryTitle'> top albums</div>
          {sharedTopAlbums.length > 0 &&
            sharedTopAlbums.map((album, index) => (
              <div key={index} className="item">
              <img src={album.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{album.name}</span>
                <span className="primaryArtists">{album.artists.join(', ')}</span>
              </div>
            </div>
            ))
            }
        </div>
      </td>
      <td>
        <div className='compareCard3'>
          <div className='primaryTitle'> top albums</div>
          {user2TopAlbums.length > 0 &&
            user2TopAlbums.map((album, index) => (
              <div key={index} className="item">
              <img src={album.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{album.name}</span>
                <span className="primaryArtists">{album.artists.join(', ')}</span>
              </div>
            </div>
            ))
            }
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div className='compareCard1'>
          <div className='primaryTitle'> top genres</div>
          {arrays1.topGenresByArtist.filter(item => !overlappingData.topGenresByArtist.includes(item)).length > 0 &&
            arrays1.topGenresByArtist.filter(item => !overlappingData.topGenresByArtist.includes(item)).map((genre, index) => (
              <div key={index} className="item">
              <div className="primaryText">
                <span className="primaryName">{genre}</span>
              </div>
            </div>
            ))
            }

          
        </div>
      </td>
      <td>
        <div className='compareCard2'>
          <div className='primaryTitle'> top genres</div>
          {overlappingData.topGenresByArtist.length > 0 &&
            overlappingData.topGenresByArtist.map((genre, index) => (
              <div key={index} className="item">
              <div className="primaryText">
                <span className="primaryName">{genre}</span>
              </div>
            </div>
            ))
            }
        </div>
      </td>
      <td>
        <div className='compareCard3'>
          <div className='primaryTitle'> top genres</div>
          {arrays2.topGenresByArtist.filter(item => !overlappingData.topGenresByArtist.includes(item)).length > 0 &&
            arrays2.topGenresByArtist.filter(item => !overlappingData.topGenresByArtist.includes(item)).map((genre, index) => (
              <div key={index} className="item">
              <div className="primaryText">
                <span className="primaryName">{genre}</span>
              </div>
            </div>
            ))
            }
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div className='compareCard1'>
          <div className='primaryTitle'> top labels</div>
          {arrays1.topLabelsByAlbums.filter(item => !overlappingData.topLabelsByAlbums.includes(item)).length > 0 &&
            arrays1.topLabelsByAlbums.filter(item => !overlappingData.topLabelsByAlbums.includes(item)).map((label, index) => (
              <div key={index} className="item">
              <div className="primaryText">
                <span className="primaryName">{label}</span>
              </div>
            </div>
            ))
          }
          
        </div>
      </td>
      <td>
        <div className='compareCard2'>
          <div className='primaryTitle'> top labels</div>
          {overlappingData.topLabelsByAlbums.length > 0 &&
            overlappingData.topLabelsByAlbums.map((label, index) => (
              <div key={index} className="item">
              <div className="primaryText">
                <span className="primaryName">{label}</span>
              </div>
            </div>
            ))
          }
          
        </div>
      </td>
      <td>
        <div className='compareCard3'>
          <div className='primaryTitle'> top labels</div>
          {arrays2.topLabelsByAlbums.filter(item => !overlappingData.topLabelsByAlbums.includes(item)).length > 0 &&
            arrays2.topLabelsByAlbums.filter(item => !overlappingData.topLabelsByAlbums.includes(item)).map((label, index) => (
              <div key={index} className="item">
              <div className="primaryText">
                <span className="primaryName">{label}</span>
              </div>
            </div>
            ))
          }
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
        <div className='compareCardSmall1'>
          <div className='primaryTitle'>most popular song</div>
          {user1MostLeastPopSongs && user1MostLeastPopSongs[0] && arrays1.mostLeastPopSongIds[0] !== arrays2.mostLeastPopSongIds[0] && (
            <div className="item">
              <img src={user1MostLeastPopSongs[0]?.img} className="primaryImage"/>
              <div className="primaryText">
                <span className="primaryName">{user1MostLeastPopSongs[0]?.name}</span>
                <span className="primaryArtists">
                  {user1MostLeastPopSongs[0]?.artists.join(', ')}
                </span>
                <span style={{paddingLeft:'20px'}} id='popularity'>{user1MostLeastPopSongs[0]?.pop}</span>
              </div>
            </div>
            )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
          <div className='primaryTitle'>most popular song</div>
          {sharedMostLeastPopSongs && sharedMostLeastPopSongs[0] && (
            <div className="item">
              <img src={sharedMostLeastPopSongs[0]?.img} className="primaryImage"/>
              <div className="primaryText">
                <span className="primaryName">{sharedMostLeastPopSongs[0]?.name}</span>
                <span className="primaryArtists">
                  {sharedMostLeastPopSongs[0]?.artists.join(', ')}
                </span>
                <span style={{paddingLeft:'20px'}} id='popularity'>{sharedMostLeastPopSongs[0]?.pop}</span>
              </div>
            </div>
            )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
          <div className='primaryTitle'>most popular song</div>
          {user2MostLeastPopSongs && user2MostLeastPopSongs[0] && arrays1.mostLeastPopSongIds[0] !== arrays2.mostLeastPopSongIds[0] && (
            <div className="item">
              <img src={user2MostLeastPopSongs[0]?.img} className="primaryImage"/>
              <div className="primaryText">
                <span className="primaryName">{user2MostLeastPopSongs[0]?.name}</span>
                <span className="primaryArtists">
                  {user2MostLeastPopSongs[0]?.artists.join(', ')}
                </span>
                <span style={{paddingLeft:'20px'}} id='popularity'>{user2MostLeastPopSongs[0]?.pop}</span>
              </div>
            </div>
            )}
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div className='compareCardSmall1'>
          <div className='primaryTitle'>least popular song</div>
          {user1MostLeastPopSongs && user1MostLeastPopSongs[1] && arrays1.mostLeastPopSongIds[1] !== arrays2.mostLeastPopSongIds[1] && (
            <div className="item">
              <img src={user1MostLeastPopSongs[1]?.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{user1MostLeastPopSongs[1]?.name}</span>
                <span className="primaryArtists">
                  {user1MostLeastPopSongs[1]?.artists.join(', ')}
                </span>
                <span style={{paddingLeft:'20px'}} id='popularity'>{user1MostLeastPopSongs[1]?.pop}</span>
              </div>
            </div>
          )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
          <div className='primaryTitle'>least popular song</div>
          {sharedMostLeastPopSongs && sharedMostLeastPopSongs[1] && (
            <div className="item">
              <img src={sharedMostLeastPopSongs[1]?.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{sharedMostLeastPopSongs[1]?.name}</span>
                <span className="primaryArtists">
                  {sharedMostLeastPopSongs[1]?.artists.join(', ')}
                </span>
                <span style={{paddingLeft:'20px'}} id='popularity'>{sharedMostLeastPopSongs[1]?.pop}</span>
              </div>
            </div>
          )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
          <div className='primaryTitle'>least popular song</div>
          {user2MostLeastPopSongs && user2MostLeastPopSongs[1] && arrays1.mostLeastPopSongIds[1] !== arrays2.mostLeastPopSongIds[1] && (
            <div className="item">
              <img src={user2MostLeastPopSongs[1]?.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{user2MostLeastPopSongs[1]?.name}</span>
                <span className="primaryArtists">
                  {user2MostLeastPopSongs[1]?.artists.join(', ')}
                </span>
                <span style={{paddingLeft:'20px'}} id='popularity'>{user2MostLeastPopSongs[1]?.pop}</span>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>
    <tr>
      <td>
        <div className='compareCardSmall1'>
          <div className='primaryTitle'>oldest song</div>
          {oldestNewestSongs && oldestNewestSongs[0] && (
            <div className="item">
              <img src={oldestNewestSongs[0]?.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{oldestNewestSongs[0]?.name}</span>
                <span className="primaryArtists">
                  {oldestNewestSongs[0]?.artists.join(', ')}
                </span>
                <span style={{paddingLeft:'20px'}}>{oldestNewestSongs[0]?.date.substr(0,4)}</span>
              </div>
            </div>
          )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
          <div className='primaryTitle'>oldest song</div>
          {oldestNewestSongs && oldestNewestSongs[0] && (
            <div className="item">
              <img src={oldestNewestSongs[0]?.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{oldestNewestSongs[0]?.name}</span>
                <span className="primaryArtists">
                  {oldestNewestSongs[0]?.artists.join(', ')}
                </span>
                <span style={{paddingLeft:'20px'}}>{oldestNewestSongs[0]?.date.substr(0,4)}</span>
              </div>
            </div>
          )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
          <div className='primaryTitle'>oldest song</div>
          {oldestNewestSongs && oldestNewestSongs[0] && (
            <div className="item">
              <img src={oldestNewestSongs[0]?.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{oldestNewestSongs[0]?.name}</span>
                <span className="primaryArtists">
                  {oldestNewestSongs[0]?.artists.join(', ')}
                </span>
                <span style={{paddingLeft:'20px'}}>{oldestNewestSongs[0]?.date.substr(0,4)}</span>
              </div>
            </div>
          )}
        </div>
      </td>
    </tr>

    <tr>
      <td>
        <div className='compareCardSmall1'>
          <div className='primaryTitle'>newest song</div>
    {oldestNewestSongs && oldestNewestSongs[1] && (
      <div className="item">
        <img src={oldestNewestSongs[1]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{oldestNewestSongs[1]?.name}</span>
          <span className="primaryArtists">
            {oldestNewestSongs[1]?.artists.join(', ')}
          </span>
          <span style={{paddingLeft:'20px'}}>{oldestNewestSongs[1]?.date.substr(0,4)}</span>
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
          <div className='primaryTitle'>newest song</div>
    {oldestNewestSongs && oldestNewestSongs[1] && (
      <div className="item">
        <img src={oldestNewestSongs[1]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{oldestNewestSongs[1]?.name}</span>
          <span className="primaryArtists">
            {oldestNewestSongs[1]?.artists.join(', ')}
          </span>
          <span style={{paddingLeft:'20px'}}>{oldestNewestSongs[1]?.date.substr(0,4)}</span>
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
          <div className='primaryTitle'>newest song</div>
    {oldestNewestSongs && oldestNewestSongs[1] && (
      <div className="item">
        <img src={oldestNewestSongs[1]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{oldestNewestSongs[1]?.name}</span>
          <span className="primaryArtists">
            {oldestNewestSongs[1]?.artists.join(', ')}
          </span>
          <span style={{paddingLeft:'20px'}}>{oldestNewestSongs[1]?.date.substr(0,4)}</span>
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>

    <tr>
      <td>
        <div className='compareCardSmall1'>
          <div className='primaryTitle'>most popular artist</div>
    {mostLeastPopArtists && mostLeastPopArtists[0] && (
      <div className="item">
        <img src={mostLeastPopArtists[0]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopArtists[0]?.name}</span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopArtists[0]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
          <div className='primaryTitle'>most popular artist</div>
    {mostLeastPopArtists && mostLeastPopArtists[0] && (
      <div className="item">
        <img src={mostLeastPopArtists[0]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopArtists[0]?.name}</span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopArtists[0]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
          <div className='primaryTitle'>most popular artist</div>
    {mostLeastPopArtists && mostLeastPopArtists[0] && (
      <div className="item">
        <img src={mostLeastPopArtists[0]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopArtists[0]?.name}</span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopArtists[0]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>

    <tr>
      <td>
        <div className='compareCardSmall1'>
          <div className='primaryTitle'>least popular artist</div>
    {mostLeastPopArtists && mostLeastPopArtists[1] && (
      <div className="item">
        <img src={mostLeastPopArtists[1]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopArtists[1]?.name}</span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopArtists[1]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
          <div className='primaryTitle'>least popular artist</div>
    {mostLeastPopArtists && mostLeastPopArtists[1] && (
      <div className="item">
        <img src={mostLeastPopArtists[1]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopArtists[1]?.name}</span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopArtists[1]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
          <div className='primaryTitle'>least popular artist</div>
    {mostLeastPopArtists && mostLeastPopArtists[1] && (
      <div className="item">
        <img src={mostLeastPopArtists[1]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopArtists[1]?.name}</span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopArtists[1]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>


    <tr>
      <td>
        <div className='compareCardSmall1'>
          <div className='primaryTitle'>most popular album</div>
    {mostLeastPopAlbums && mostLeastPopAlbums[0] && (
      <div className="item">
        <img src={mostLeastPopAlbums[0]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopAlbums[0]?.name}</span>
          <span className="primaryArtists">
            {mostLeastPopAlbums[0]?.artists.join(', ')}
          </span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopAlbums[0]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
          <div className='primaryTitle'>most popular album</div>
    {mostLeastPopAlbums && mostLeastPopAlbums[0] && (
      <div className="item">
        <img src={mostLeastPopAlbums[0]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopAlbums[0]?.name}</span>
          <span className="primaryArtists">
            {mostLeastPopAlbums[0]?.artists.join(', ')}
          </span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopAlbums[0]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
          <div className='primaryTitle'>most popular album</div>
    {mostLeastPopAlbums && mostLeastPopAlbums[0] && (
      <div className="item">
        <img src={mostLeastPopAlbums[0]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopAlbums[0]?.name}</span>
          <span className="primaryArtists">
            {mostLeastPopAlbums[0]?.artists.join(', ')}
          </span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopAlbums[0]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>


    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>least popular album</div>
    {mostLeastPopAlbums && mostLeastPopAlbums[1] && (
      <div className="item">
        <img src={mostLeastPopAlbums[1]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopAlbums[1]?.name}</span>
          <span className="primaryArtists">
            {mostLeastPopAlbums[1]?.artists.join(', ')}
          </span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopAlbums[1]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>least popular album</div>
    {mostLeastPopAlbums && mostLeastPopAlbums[1] && (
      <div className="item">
        <img src={mostLeastPopAlbums[1]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopAlbums[1]?.name}</span>
          <span className="primaryArtists">
            {mostLeastPopAlbums[1]?.artists.join(', ')}
          </span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopAlbums[1]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>least popular album</div>
    {mostLeastPopAlbums && mostLeastPopAlbums[1] && (
      <div className="item">
        <img src={mostLeastPopAlbums[1]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopAlbums[1]?.name}</span>
          <span className="primaryArtists">
            {mostLeastPopAlbums[1]?.artists.join(', ')}
          </span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopAlbums[1]?.pop}</span>
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>



    <tr>
      <td>
        <div className='compareCardSmall1'>
        <div className='primaryTitle'>average song popularity [difference]</div>
    {overlappingData.avgSongPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" >{overlappingData.avgSongPop}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
        <div className='primaryTitle'>average song popularity [difference]</div>
    {overlappingData.avgSongPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" >{overlappingData.avgSongPop}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
        <div className='primaryTitle'>average song popularity [difference]</div>
    {overlappingData.avgSongPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" >{overlappingData.avgSongPop}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>



    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>song popularity standard deviation [difference]</div>
    {overlappingData.songPopStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.songPopStdDev}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>song popularity standard deviation [difference]</div>
    {overlappingData.songPopStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.songPopStdDev}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>song popularity standard deviation [difference]</div>
    {overlappingData.songPopStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.songPopStdDev}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>




    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>average song age</div>
  {overlappingData.avgSongAgeYrMo && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {`${overlappingData.avgSongAgeYrMo[0] === 1 ? '1 year' : `${overlappingData.avgSongAgeYrMo[0]} years`}, ${overlappingData.avgSongAgeYrMo[1] === 1 ? '1 month' : `${overlappingData.avgSongAgeYrMo[1]} months`}`}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>average song age</div>
  {overlappingData.avgSongAgeYrMo && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {`${overlappingData.avgSongAgeYrMo[0] === 1 ? '1 year' : `${overlappingData.avgSongAgeYrMo[0]} years`}, ${overlappingData.avgSongAgeYrMo[1] === 1 ? '1 month' : `${overlappingData.avgSongAgeYrMo[1]} months`}`}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>average song age</div>
  {overlappingData.avgSongAgeYrMo && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {`${overlappingData.avgSongAgeYrMo[0] === 1 ? '1 year' : `${overlappingData.avgSongAgeYrMo[0]} years`}, ${overlappingData.avgSongAgeYrMo[1] === 1 ? '1 month' : `${overlappingData.avgSongAgeYrMo[1]} months`}`}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
    </tr>



    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>song age standard deviation</div>
  {overlappingData.songAgeStdDevYrMo && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2" id='stdDev'>
          {`${overlappingData.songAgeStdDevYrMo[0] === 1 ? '1 year' : `${overlappingData.songAgeStdDevYrMo[0]} years`}, ${overlappingData.songAgeStdDevYrMo[1] === 1 ? '1 month' : `${overlappingData.songAgeStdDevYrMo[1]} months`}`}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>song age standard deviation</div>
  {overlappingData.songAgeStdDevYrMo && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2" id='stdDev'>
          {`${overlappingData.songAgeStdDevYrMo[0] === 1 ? '1 year' : `${overlappingData.songAgeStdDevYrMo[0]} years`}, ${overlappingData.songAgeStdDevYrMo[1] === 1 ? '1 month' : `${overlappingData.songAgeStdDevYrMo[1]} months`}`}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>song age standard deviation</div>
  {overlappingData.songAgeStdDevYrMo && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2" id='stdDev'>
          {`${overlappingData.songAgeStdDevYrMo[0] === 1 ? '1 year' : `${overlappingData.songAgeStdDevYrMo[0]} years`}, ${overlappingData.songAgeStdDevYrMo[1] === 1 ? '1 month' : `${overlappingData.songAgeStdDevYrMo[1]} months`}`}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
    </tr>



    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>percent songs explicit</div>
  {overlappingData.pctSongsExpl && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {overlappingData.pctSongsExpl}%
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>percent songs explicit</div>
  {overlappingData.pctSongsExpl && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {overlappingData.pctSongsExpl}%
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>percent songs explicit</div>
  {overlappingData.pctSongsExpl && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {overlappingData.pctSongsExpl}%
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
    </tr>



    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>average album popularity</div>
    {overlappingData.avgAlbumPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2">{overlappingData.avgAlbumPop}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>average album popularity</div>
    {overlappingData.avgAlbumPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2">{overlappingData.avgAlbumPop}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>average album popularity</div>
    {overlappingData.avgAlbumPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2">{overlappingData.avgAlbumPop}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>



    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>album popularity standard deviation</div>
    {overlappingData.albumPopsStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.albumPopsStdDev}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>album popularity standard deviation</div>
    {overlappingData.albumPopsStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.albumPopsStdDev}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>album popularity standard deviation</div>
    {overlappingData.albumPopsStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.albumPopsStdDev}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>



    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>average artist popularity</div>
    {overlappingData.avgArtistPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2">{overlappingData.avgArtistPop}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>average artist popularity</div>
    {overlappingData.avgArtistPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2">{overlappingData.avgArtistPop}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>average artist popularity</div>
    {overlappingData.avgArtistPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2">{overlappingData.avgArtistPop}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>



    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>artist popularity standard deviation</div>
    {overlappingData.artistPopStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.artistPopStdDev}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>artist popularity standard deviation</div>
    {overlappingData.artistPopStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.artistPopStdDev}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>artist popularity standard deviation</div>
    {overlappingData.artistPopStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.artistPopStdDev}</span>
         
        </div>
      </div>
    )}
        </div>
      </td>
    </tr>


    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>average artist followers</div>
         
  {overlappingData.avgArtistFolls && (
    <div className="item" style={{fontSize:'20px'}}>
      <div className="primaryText">
        <span className="primaryName2">
          {overlappingData.avgArtistFolls}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>average artist followers</div>
  {overlappingData.avgArtistFolls && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {overlappingData.avgArtistFolls}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>average artist followers</div>
  {overlappingData.avgArtistFolls && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {overlappingData.avgArtistFolls}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
    </tr>



    <tr>
      <td>
        <div className='compareCardSmall1'>
         <div className='primaryTitle'>artist followers standard deviation</div>
  {overlappingData.artistFollsStdDev && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2" id='stdDev'>
          {overlappingData.artistFollsStdDev}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall2'>
         <div className='primaryTitle'>artist followers standard deviation</div>
  {overlappingData.artistFollsStdDev && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2" id='stdDev'>
          {overlappingData.artistFollsStdDev}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
      <td>
        <div className='compareCardSmall3'>
         <div className='primaryTitle'>artist followers standard deviation</div>
  {overlappingData.artistFollsStdDev && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2" id='stdDev'>
          {overlappingData.artistFollsStdDev}
        </span>
      </div>
    </div>
  )}
        </div>
      </td>
    </tr>
</tbody>
  </table> 








    {/* <div className="table-container">
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th className='gradient'>difference in averages</th>
                    <th className='gradient' id='stdDev'>difference in standard deviations</th>
                    <th className='gradient'>shared song with highest value</th>
                    <th className='gradient'>shared song with lowest value</th>
                </tr>
            </thead>
            <tbody>
                
    
{features.map((feature, index) => {
            const highestSong = highestAudioFeatureSongs[index];
            const lowestSong = lowestAudioFeatureSongs[index];

            return (
              <tr key={feature}>
                <td className='gradient' id={feature}>{feature}</td>
                <td><div className='cellOutline'>{overlappingData.audioFeatureMeans[index]}</div></td>
                <td><div className='cellOutline'>{overlappingData.audioFeatureStdDevs[index]}</div></td>
                <td>
                  {highestSong && highestSong.name && highestSong.img && highestSong.artists && (
                    <div className='cellOutline'>
                      <img className='primaryImage' src={highestSong.img} alt={highestSong.name} />
                      <p className='primaryName'> {highestSong.name}</p>&emsp;
                      <p className='primaryArtists'>{highestSong.artists.join(', ')}</p>
                    </div>
                  )}
                </td>
                <td>
                  {lowestSong && lowestSong.name && lowestSong.img && lowestSong.artists && (
                    <div className='cellOutline'>
                      <img className='primaryImage' src={lowestSong.img} alt={lowestSong.name} />
                      <p className='primaryName'>{lowestSong.name}</p>&emsp;
                      <p className='primaryArtists'>{lowestSong.artists.join(', ')}</p>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
                
            </tbody>
        </table>
        </div> */}

<Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Popup Window"
        style={customStyles} 
        id="imgDiv"
      >

        <h2 className='gptModalTitle'><img src={gptBtn} style={{width:'40px', marginRight:'10px'}}></img>ChatGPT-generated comparison for <span style={{color:'#1e90ff'}}>{nameIdImgurlGenerationdate1[0]}</span><span style={{color:'#18d860', fontWeight:'bold'}}> vs. </span> <span style={{color:'#FFDF00', fontWeight:'bold'}}>{nameIdImgurlGenerationdate2[0]}</span>'s music preferences</h2>
        <span className="timeRange">{selectedTimeRangeClean}</span>
          <div className='gptHaikusDiv'>
              {gptLoading && <div className="loadingDots">
                        <div className="loadingDots--dot"></div>
                        <div className="loadingDots--dot"></div>
                        <div className="loadingDots--dot"></div>
                    </div>}
                          {/* {gptLoading && <h4>Generating response...</h4>} */}
                        {apiResponse && (
                        <div className='gptContent'>
                          
                        {/* {apiResponse.replace(/\//g, '<br></br>')} */}
                        <div dangerouslySetInnerHTML={{ __html: apiResponse.replace(/\//g, '<br></br>') }}/>
                        </div>
                        )}
            
          </div>
        <button className='closeBtn' onClick={closeModal}>Close</button>
        <button className="saveImg2" onClick={handleConvertToImage} title='Download image'><img src={download} style={{width:'10px'}}></img></button>

      </Modal>
       <Footer/>


            
        </div>
    )
}

export default Compare