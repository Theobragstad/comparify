import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router';
import logo from './img/logo.png';
import missingImage from './img/missingImage.png';
import './Data.css';
import Big from 'big.js'
import back from './img/back.png';
import download from './img/download.png';
import Footer from './Footer'

import html2canvas from 'html2canvas';




function Compare() {
 


  const [loading, setLoading] = useState(false);



    const location = useLocation();
    const file1 = location.state.file1.split(',');
    const file2 = location.state.file2.split(',');
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


    

    // const userNameAndId1 = file1.slice(1, 3);
    // const userNameAndId2 = file2.slice(1, 3);
    const nameIdImgurlGenerationdate1 = file1.slice(1, 5);
    const nameIdImgurlGenerationdate2 = file2.slice(1, 5);

    


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




const getTopSongs = async (songIds) => {
  if(songIds.length > 0) {
    const {data} = await axios.get("https://api.spotify.com/v1/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: songIds.join(',')
      }
    });

    const topSongsData = data.tracks.map(track => ({
      name: track.name,
      artists: track.artists.map(artist => artist.name),
      img: track.album.images[0]?.url || missingImage
    }));
    
    setTopSongs(topSongsData);
  }
  else {
    setTopSongs(['Not enough data to compute']);
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

const getMostLeastPopSongs = async (songIds) => {
  if(songIds.length > 0) {
    const {data} = await axios.get("https://api.spotify.com/v1/tracks", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: songIds.join(',')
      }
    });

    const mostLeastPopSongsData = data.tracks.map(track => ({
      name: track.name,
      pop: track.popularity,
      artists: track.artists.map(artist => artist.name),
      img: track.album.images[0]?.url || missingImage
    }));

    setMostLeastPopSongs(mostLeastPopSongsData);
  }
  else {
    setMostLeastPopSongs(['Not enough data to compute']);
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

const getTopAlbums = async (albumIds) => {
  if(albumIds.length > 0) {
    const maxAlbumsPerRequest = 20;
    const albumChunks = [];

    for (let i = 0; i < albumIds.length; i += maxAlbumsPerRequest) {
      albumChunks.push(albumIds.slice(i, i + maxAlbumsPerRequest));
    }

    const topAlbumData = [];

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

      topAlbumData.push(...chunkAlbumsData);
    }

    setTopAlbums(topAlbumData);
  } 
  else {
    setTopAlbums(['Not enough data to compute']);
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


const getTopArtists = async (artistIds) => {
  if(artistIds.length > 0) {
    const {data} = await axios.get("https://api.spotify.com/v1/artists", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        ids: artistIds.join(',')
      }
    });

    const topArtistsData = data.artists.map(artist => ({
      name: artist.name,
      img: artist.images[0]?.url || missingImage
    }));
    
    setTopArtists(topArtistsData);
  }
  else {
    setTopArtists(['Not enough data to compute']);
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

      var fileName = 'Your comparify Result with ' + nameIdImgurlGenerationdate2[0].replace(/\./g, '') + '.png';
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

const [topSongs, setTopSongs] = useState([]);
const [highestAudioFeatureSongs, setHighestAudioFeatureSongs] = useState([]);
const [lowestAudioFeatureSongs, setLowestAudioFeatureSongs] = useState([]);
const [mostLeastPopSongs, setMostLeastPopSongs] = useState([]);
const [oldestNewestSongs, setOldestNewestSongs] = useState([]);
const [topAlbums, setTopAlbums] = useState([]);
const [mostLeastPopAlbums, setMostLeastPopAlbums] = useState([]);
const [topArtists, setTopArtists] = useState([]);
const [mostLeastPopArtists, setMostLeastPopArtists] = useState([]);

useEffect(() => {
  getTopSongs(overlappingData.songIds);
  getHighestAudioFeatureSongs(overlappingData.highestAudioFeatureSongIds);
  getLowestAudioFeatureSongs(overlappingData.lowestAudioFeatureSongIds);
  getMostLeastPopSongs(overlappingData.mostLeastPopSongIds);
  getOldestNewestSongs(overlappingData.oldestNewestSongIds);
  getTopAlbums(overlappingData.albumIds);
  getMostLeastPopAlbums(overlappingData.mostLeastPopAlbumIds);
  getTopArtists(overlappingData.artistIds);
  getMostLeastPopArtists(overlappingData.mostLeastPopArtistIds);
}, [selectedTimeRange]);

  
const features = ['acousticness','danceability','duration','energy','instrumentalness','liveness','loudness','speechiness','tempo','valence'];


    return (
      
        <div>





          <img src={logo} style={{width:80,paddingTop:'20px'}}></img>
          <h3>comparify Results</h3>
          {/* <img src={nameIdImgurlGenerationdate[2]} style={{verticalAlign: 'middle', width:'30px', borderRadius:'50%',paddingLeft:'10px', paddingRight:'10px'}}></img> */}
          <div class="container">
        <div class="image">
            <img src={nameIdImgurlGenerationdate1[2]} style={{width:'30px', borderRadius:'50%',paddingLeft:'10px', paddingRight:'10px'}} alt="Image 1"></img>
            <div class="text" style={{color:'#1e90ff', fontWeight:'bold'}}>{nameIdImgurlGenerationdate1[0]}</div>
        </div>
        <span style={{color:'#18d860', fontWeight:'bold'}}>vs.</span>
        <div class="image">
            <img src={nameIdImgurlGenerationdate2[2]} style={{width:'30px', borderRadius:'50%',paddingLeft:'10px', paddingRight:'10px'}} alt="Image 2"></img>
            <div class="text" style={{color:'#FFDF00', fontWeight:'bold'}}>{nameIdImgurlGenerationdate2[0]}</div>
        </div>
    </div>
          {/* <h4><span style={{color:'#1e90ff'}}>{userNameAndId1[0]}</span> <span style={{color:'#18d860'}}>vs.</span> <span style={{color:'#FFDF00'}}>{userNameAndId2[0]}</span></h4> */}
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
    
    <button className="saveImg" onClick={handleConvertToImage} title='Download image'><img src={download} style={{width:'10px'}}></img></button>
  </h2>

  <div style={{width:'0',height:'0',overflow:'hidden'}}>

                        <div id="imgDiv" style={{width:200}}>

                                <img src={logo} style={{width:80,paddingTop:'20px'}}></img>
                                <h3>comparify Results</h3>
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
{/* 
        <div className="songContainer">
          <div className="songTitle">top songs</div>
            <div className="songCard">
              <div className="songContent">   
                {topSongs.length > 0 ? (
                  topSongs.map((song, index) => (
                    <div key={index} className="songItem">
                      <img src={song.img} className="songImage" />
                      <div className="songText">
                        <span className="songName">{song.name}</span>
                        <span className="songArtists">&emsp;{song.artists.join(', ')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>no similarities.</div>
                )}
            </div>
          </div>
        </div> */}


    <div className="card-row">
        <div className="primaryCard1">
            <div className='primaryTitle'>shared top songs</div>
            {topSongs.length === 0 && 
              <div className='centeredEmpty' >
                none
              </div>
            }
              {topSongs.map((song, index) => (
                <div key={index} className="item">
                  <img src={song.img} className="primaryImage" />
                  <div className="primaryText">
                    <span className="primaryName">{song.name}</span>
                    <span className="primaryArtists">{song.artists.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>


            <div className="primaryCard2">
        <div className='primaryTitle'>shared top artists</div>
        {topArtists.length === 0 && 
              <div className='centeredEmpty'>
                none
              </div>
            }
          {topArtists.map((artist, index) => (
            <div key={index} className="item">
              <img src={artist.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{artist.name}</span>
              </div>
            </div>
          ))}
        </div>



        <div className="primaryCard1" id='topAlbums'>
        <div className='primaryTitle'>shared top albums</div>
        {topAlbums.length === 0 && 
              <div className='centeredEmpty' >
                none
              </div>
            }
          {topAlbums.map((album, index) => (
            <div key={index} className="item">
              <img src={album.img} className="primaryImage" />
              <div className="primaryText">
                <span className="primaryName">{album.name}</span>
                <span className="primaryArtists">{album.artists.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>


        <div className="primaryCard2" id='topGenres'>
        <div className='primaryTitle'>shared top genres</div>
        {overlappingData.topGenresByArtist.length === 0 && 
              <div className='centeredEmpty' >
                none
              </div>
            }
          {overlappingData.topGenresByArtist.map((genre, index) => (
            <div key={index} className="item">
              <div className="primaryText">
                <span className="primaryName">{genre}</span>
              </div>
            </div>
          ))}
        </div>


        <div className="primaryCard3" id='topLabels'>
        <div className='primaryTitle'>shared top labels</div>
        {overlappingData.topLabelsByAlbums.length === 0 && 
              <div className='centeredEmpty' >
                none
              </div>
            }
          {overlappingData.topLabelsByAlbums.map((label, index) => (
            <div key={index} className="item">
              <div className="primaryText">
                <span className="primaryName">{label}</span>
              </div>
            </div>
          ))}
        </div>

      
    </div>


    <div className="card-row" style={{paddingTop:'30px'}}>
              <div className="primaryCard4">
              <div className='primaryTitle'>same most popular song?</div>
              {mostLeastPopSongs && mostLeastPopSongs[0] === 'Not enough data to compute' &&
              <div className='centeredEmpty' >
              no
            </div>
              
              }
              {mostLeastPopSongs && mostLeastPopSongs[0] && (
                <div className="item">
                  <img src={mostLeastPopSongs[0]?.img} className="primaryImage" />
                  <div className="primaryText">
                    <span className="primaryName">{mostLeastPopSongs[0]?.name}</span>
                    <span className="primaryArtists">
                      {mostLeastPopSongs[0]?.artists.join(', ')}
                    </span>
                    <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopSongs[0]?.pop}</span>
                  </div>
                </div>
              )}
              
            </div>




  <div className="primaryCard4">
    <div className='primaryTitle'>same least popular song?</div>
    {mostLeastPopSongs && mostLeastPopSongs[1] && (
      <div className="item">
        <img src={mostLeastPopSongs[1]?.img} className="primaryImage" />
        <div className="primaryText">
          <span className="primaryName">{mostLeastPopSongs[1]?.name}</span>
          <span className="primaryArtists">
            {mostLeastPopSongs[1]?.artists.join(', ')}
          </span>
          <span style={{paddingLeft:'20px'}} id='popularity'>{mostLeastPopSongs[1]?.pop}</span>
        </div>
      </div>
    )}
    
  </div>



  <div className="primaryCard4">
    <div className='primaryTitle'>same oldest song?</div>
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



  <div className="primaryCard5">
    <div className='primaryTitle'>same newest song?</div>
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



  <div className="primaryCard4">
    <div className='primaryTitle'>same most popular artist?</div>
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

  <div className="primaryCard4">
    <div className='primaryTitle'>same least popular artist?</div>
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




  <div className="primaryCard4">
    <div className='primaryTitle'>same most popular album?</div>
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


  <div className="primaryCard4">
    <div className='primaryTitle'>same least popular album?</div>
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


  <div className="primaryCard4">
    <div className='primaryTitle'>difference in average song popularity</div>
    {/* {overlappingData.avgSongPop && ( */}
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" >{overlappingData.avgSongPop}</span>
          <div>
          <span style={{color:'#1e90ff'}}>{arrays1.avgSongPop}</span><span style={{color:'#18d860'}}> vs. </span><span style={{color:'#ffdf00'}}>{arrays2.avgSongPop}</span>

          </div>
        </div>
      </div>
    {/* )} */}
    
  </div>


  <div className="primaryCard4">
    <div className='primaryTitle'>difference in song popularity standard deviation</div>
    {overlappingData.songPopStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.songPopStdDev}</span>
         
        </div>
      </div>
    )}
    
  </div>


  <div className="primaryCard4">
  <div className='primaryTitle'>difference in average song age</div>
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




<div className="primaryCard4">
  <div className='primaryTitle'>difference in song age standard deviation</div>
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




<div className="primaryCard6">
  <div className='primaryTitle'>difference in percent songs explicit</div>
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




<div className="primaryCard4">
    <div className='primaryTitle'>difference in average album popularity</div>
    {overlappingData.avgAlbumPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2">{overlappingData.avgAlbumPop}</span>
         
        </div>
      </div>
    )}
    
  </div>



  <div className="primaryCard4">
    <div className='primaryTitle'>difference in album popularity standard deviation</div>
    {overlappingData.albumPopsStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.albumPopsStdDev}</span>
         
        </div>
      </div>
    )}
    
  </div>




  <div className="primaryCard4">
    <div className='primaryTitle'>difference in average artist popularity</div>
    {overlappingData.avgArtistPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2">{overlappingData.avgArtistPop}</span>
         
        </div>
      </div>
    )}
    
  </div>


  <div className="primaryCard4">
    <div className='primaryTitle'>difference in artist popularity standard deviation</div>
    {overlappingData.artistPopStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{overlappingData.artistPopStdDev}</span>
         
        </div>
      </div>
    )}
    
  </div>




  <div className="primaryCard6">
  <div className='primaryTitle'>difference in average artist followers</div>
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



<div className="primaryCard6">
  <div className='primaryTitle'>difference in artist followers standard deviation</div>
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













    </div>  








    <div className="table-container">
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
        </div>


       <Footer/>


            
        </div>
    )
}

export default Compare