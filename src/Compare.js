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


    

    const userNameAndId1 = file1.slice(1, 3);
    const userNameAndId2 = file2.slice(1, 3);

    


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
    if (Array.isArray(arrays1[key])) {
      entryCount1 += arrays1[key].length;
    } else {
      entryCount1++;
    }
  }

  for (const key in arrays2) {
    if (Array.isArray(arrays2[key])) {
      entryCount2 += arrays2[key].length;
    } else {
      entryCount2++;
    }
  }

  const minCount = Math.min(entryCount1, entryCount2);

console.log(arrays1);
console.log(arrays2);



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
      overlappingData[field] = Math.abs(arrays1[field] - arrays2[field]);
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
          overlappingArray.push(Math.abs(parseFloat(array1[i]) - parseFloat(array2[i])));
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

console.log(overlappingData);


function calculateSimilarity(number1, number2) {
  if (number1 === number2) {
    return 1; 
  }

  var absoluteDifference = Math.abs(number1 - number2);
  var maxValue = Math.max(number1, number2);
  var minValue = Math.min(number1, number2);
  var normalizedDifference = absoluteDifference / (maxValue - minValue);
  var similarity = 1 - normalizedDifference;
  return similarity;
}

function quantifyDateSimilarity(date1, date2) {
  const yearDifference = Math.abs(parseInt(date1[0]) - parseInt(date2[0]));
  const monthDifference = Math.abs(parseInt(date1[1]) - parseInt(date2[1]));
  
  const maxYears = 5;
  const maxMonths = 0;
  
  if (yearDifference > maxYears || (yearDifference === maxYears && monthDifference > maxMonths)) {
    return 0;
  }
  
  const similarity = 1 - (yearDifference + monthDifference) / (maxYears * 12 + maxMonths);
  
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

const upperThresholds = {
  avgSongPop: 15,
  songPopStdDev: 10,
  pctSongsExpl: 25,
  avgAlbumPop: 10,
  albumPopsStdDev: 10,
  avgArtistPop: 15,
  artistPopStdDev: 10,
  avgArtistFolls: 100000,
  artistFollsStdDev: 100000
};


const audioFeatureMeansThresholds = [0.25, 0.25, -1, 0.25, .25, 0.25, -1, 0.25, 25, 0.25];
const audioFeatureStdDevsThresholds = [0.1, 0.1, -1, 0.1, 0.1, 0.1, -1, 0.1, 10, 0.1];

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
      similarities[field] = calculateSimilarity(parseFloat(arrays1[field]), parseFloat(arrays2[field]), parseFloat(upperThresholds[field]));
    } else if (field === 'avgSongAgeYrMo' || field === 'songAgeStdDevYrMo') {
      similarities[field] = quantifyDateSimilarity(arrays1[field], arrays2[field]);
    } else if (field === 'avgArtistFolls' || field === 'artistFollsStdDev') {
      ///
      similarities[field] = '';
    } else if (field === 'audioFeatureMeans') {
      const array1 = arrays1[field];
      const array2 = arrays2[field];

      const similarityArray = [];
      for (let i = 0; i < array1.length; i++) {
        if (i !== 2 && i !== 6) { 
          similarityArray.push(calculateSimilarity(parseFloat(array1[i]), parseFloat(array2[i]), parseFloat(audioFeatureMeansThresholds[i])));
        } else {
          // 
          similarityArray.push("");
        }
      }
      similarities[field] = similarityArray;
    } else if (field === 'audioFeatureStdDevs') {
      const array1 = arrays1[field];
      const array2 = arrays2[field];

      const similarityArray = [];
      for (let i = 0; i < array1.length; i++) {
        if (i !== 2 && i !== 6) { 
          similarityArray.push(calculateSimilarity(parseFloat(array1[i]), parseFloat(array2[i]), parseFloat(audioFeatureStdDevsThresholds[i])));
        } else {
          // 
          similarityArray.push("");
        }
      }
      similarities[field] = similarityArray;
    }
  }
}

console.log(similarities);







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

const similarityPct = similaritiesCount / minCount * 100;
console.log(similaritiesCount);
console.log(minCount);
console.log(similarityPct);





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

      var fileName = 'Your comparify Result with ' + userNameAndId2[0].replace(/\./g, '') + '.png';
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
  getMostLeastPopArtists(overlappingData.artistIds);
}, [selectedTimeRange]);

  


    return (
      
        <div>

          <img src={logo} style={{width:80,paddingTop:'20px'}}></img>
          <h3>comparify Results</h3>
          <h4><span style={{color:'#1e90ff'}}>{userNameAndId1[0]}</span> <span style={{color:'#18d860'}}>vs.</span> <span style={{color:'#FFDF00'}}>{userNameAndId2[0]}</span></h4>
          {/* <h2>{similarityPct.toFixed(3)}% <span style={{fontSize:'16px'}}>similar</span></h2> */}
          <h2>
    <span
      style={{
        background:
          'linear-gradient(to right, #1e90ff 0%, #1e90ff 33%, #18d860 33%, #18d860 66%, #FFDF00 66%, #FFDF00 100%)',
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
                                <h4><span style={{color:'#1e90ff'}}>{userNameAndId1[0]}</span> <span style={{color:'#18d860'}}>vs.</span> <span style={{color:'#FFDF00'}}>{userNameAndId2[0]}</span></h4>
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
    <button className="leftNavBtn"><img src={back} style={{width:'13px'}}></img></button>
  </div>
            <div className="navBtnOverlay">
              <button className={`navBtn ${selectedButton === 1 ? 'selected' : ''}`} onClick={() => selectButton(1)}>last month</button>
              <button className={`navBtn ${selectedButton === 2 ? 'selected' : ''}`} onClick={() => selectButton(2)}>last 6 months</button>
              <button className={`navBtn ${selectedButton === 3 ? 'selected' : ''}`} onClick={() => selectButton(3)}>all time</button>
            </div>
          </div>

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
        </div>



            
        </div>
    )
}

export default Compare