import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation} from 'react-router';
import logo from './img/logo.png';
import missingImage from './img/missingImage.png';
import './Data.css';
import back from './img/back.png';
import gptBtn from './img/gptBtn.png';
import html2canvas from 'html2canvas';

import Footer from './Footer'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import download from './img/download.png';

import Modal from 'react-modal';


const { Configuration, OpenAIApi } = require("openai");




function Data() {
  Modal.setAppElement('#root')


  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });

  delete configuration.baseOptions.headers['User-Agent'];

  const openai = new OpenAIApi(configuration);
  // const [prompt, setPrompt] = useState("");
  const [apiResponse, setApiResponse] = useState("");


  const handleGptSumbit = async () => {
    console.log(process.env.REACT_APP_OPENAI_API_KEY);
    try {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: 'Hello, how are you today?',
        temperature: 0.5,
        max_tokens: 4000,
      });
      // console.log("response", result.data.choices[0].text);
      setApiResponse(result.data.choices[0].text);
    } catch(error) {
      console.log(error);
      setApiResponse("Something is going wrong, Please try again.");
    }
  };



  function handleConvertToImage() {
    const div = document.getElementById("imgDiv");
    if (div) {
      html2canvas(div, {}).then((canvas) => {
        
        const image = canvas.toDataURL("image/png");
        // console.log(image, "image");
  
        var fileName = 'Your ChatGPT creative music analysis.png';
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

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    handleGptSumbit();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  const customStyles = {
    overlay: {
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
      zIndex: 9999,
      width: '400px',
      height: 'fit-content',
      margin: 'auto',
      borderRadius: '10px',
      outline: 'none',
      padding: '20px'
    }
  };









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

  const location = useLocation();
  const token = location.state.token;
  const allData = location.state.data.split(',');
  const userNameAndId = allData.slice(1, 3);

  const dataStartIndex = allData.indexOf(selectedTimeRange) + 1;
  const dataEndIndex = (selectedTimeRange === 'long_term') ? allData.length - 1 : allData.indexOf(timeRanges[timeRanges.indexOf(selectedTimeRange) + 1]) - 1;

  const data = allData.slice(dataStartIndex, dataEndIndex + 1);

  const labels = ['songIds[<=50]', 'mostLeastPopSongIds[<=2]', 'oldestNewestSongIds[<=2]',
                  'avgSongPop[1]', 'songPopStdDev[1]', 'avgSongAgeYrMo[2]',
                  'songAgeStdDevYrMo[2]', 'pctSongsExpl[1]', 'audioFeatureMeans[11]',
                  'audioFeatureStdDevs[11]', 'highestAudioFeatureSongIds[<=11]',
                  'lowestAudioFeatureSongIds[<=11]', 'albumIds[<=10]', 'mostLeastPopAlbumIds[<=2]',
                  'avgAlbumPop[1]', 'albumPopsStdDev[1]', 'topLabelsByAlbums[<=5]',
                  'artistIds[<=50]', 'mostLeastPopArtistIds[<=2]', 'avgArtistPop[1]',
                  'artistPopStdDev[1]', 'avgArtistFolls[1]', 'artistFollsStdDev[1]', 'topGenresByArtist[<=20]'];
  
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
    topGenresByArtist: []
  };

  for(let i = 0; i < labels.length - 1; i++) {
    const startIndex = data.indexOf(labels[i]) + 1;
    const endIndex = data.indexOf(labels[i + 1]);

    const key = labels[i].substring(0, labels[i].indexOf('['));
    arrays[key] = data.slice(startIndex, endIndex);
  }

  arrays.topGenresByArtist = data.slice(data.indexOf('topGenresByArtist[<=20]') + 1);

 

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
        img: track.album.images[0]?.url || missingImage,
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

      // console.log(mostLeastPopArtistsData);
      
      setMostLeastPopArtists(mostLeastPopArtistsData);
    }
    else {
      setMostLeastPopArtists(['Not enough data to compute']);
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
 
  useEffect(() => {
    if (isTokenExpired()) {
      logout();
    }
    getTopSongs(arrays.songIds);
    getHighestAudioFeatureSongs(arrays.highestAudioFeatureSongIds);
    getLowestAudioFeatureSongs(arrays.lowestAudioFeatureSongIds);
    getMostLeastPopSongs(arrays.mostLeastPopSongIds);
    getOldestNewestSongs(arrays.oldestNewestSongIds);
    getTopAlbums(arrays.albumIds);
    getMostLeastPopAlbums(arrays.mostLeastPopAlbumIds);
    getTopArtists(arrays.artistIds);
    getMostLeastPopArtists(arrays.mostLeastPopArtistIds);

   
  }, [selectedTimeRange]);


  const navigate = useNavigate();
  // const [token, setToken] = useState('');

  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) {
      return true;
    }
    return new Date().getTime() > parseInt(expirationTime);
  };

  const logout = () => {

    // setToken("");
    setExpirationTime("");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("expirationTime");
    navigate('/');
    
  };

const [expirationTime, setExpirationTime] = useState("");



const features = ['acousticness','danceability','duration','energy','instrumentalness','liveness','loudness','speechiness','tempo','valence'];


  return (
    <div>
      <img className='dataPageLogo' src={logo}></img>
      <h4>comparify Data for <span style={{color:'#1e90ff'}}>{userNameAndId[0]}</span><span>&emsp;<img id='gptTooltip' onClick={openModal} src={gptBtn} style={{width:'15px',cursor:'pointer'}}></img></span></h4>
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




      <div className="card-row">
  
      <div className="primaryCard1">
        <div className='primaryTitle'>top songs</div>
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
        <div className='primaryTitle'>top artists</div>
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
        <div className='primaryTitle'>top albums</div>
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
        <div className='primaryTitle'>top genres</div>
          {arrays.topGenresByArtist.map((genre, index) => (
            <div key={index} className="item">
              <div className="primaryText">
                <span className="primaryName">{genre}</span>
              </div>
            </div>
          ))}
        </div>


        <div className="primaryCard3" id='topLabels'>
        <div className='primaryTitle'>top labels</div>
          {arrays.topLabelsByAlbums.map((label, index) => (
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
    <div className='primaryTitle'>most popular song</div>
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
    <div className='primaryTitle'>least popular song</div>
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


  <div className="primaryCard5">
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

  

  <div className="primaryCard4">
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

  <div className="primaryCard4">
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


  <div className="primaryCard4">
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


  <div className="primaryCard4">
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





<div className="primaryCard4">
    <div className='primaryTitle'>average song popularity</div>
    {arrays.avgSongPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" >{arrays.avgSongPop}</span>
         
        </div>
      </div>
    )}
    
  </div>

  <div className="primaryCard4">
    <div className='primaryTitle'>song popularity standard deviation</div>
    {arrays.songPopStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{arrays.songPopStdDev}</span>
         
        </div>
      </div>
    )}
    
  </div>


  <div className="primaryCard4">
  <div className='primaryTitle'>average song age</div>
  {arrays.avgSongAgeYrMo && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {`${arrays.avgSongAgeYrMo[0] === 1 ? '1 year' : `${arrays.avgSongAgeYrMo[0]} years`}, ${arrays.avgSongAgeYrMo[1] === 1 ? '1 month' : `${arrays.avgSongAgeYrMo[1]} months`}`}
        </span>
      </div>
    </div>
  )}
</div>




<div className="primaryCard4">
  <div className='primaryTitle'>song age standard deviation</div>
  {arrays.songAgeStdDevYrMo && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2" id='stdDev'>
          {`${arrays.songAgeStdDevYrMo[0] === 1 ? '1 year' : `${arrays.songAgeStdDevYrMo[0]} years`}, ${arrays.songAgeStdDevYrMo[1] === 1 ? '1 month' : `${arrays.songAgeStdDevYrMo[1]} months`}`}
        </span>
      </div>
    </div>
  )}
</div>




<div className="primaryCard6">
  <div className='primaryTitle'>percent songs explicit</div>
  {arrays.pctSongsExpl && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {arrays.pctSongsExpl}%
        </span>
      </div>
    </div>
  )}
</div>




<div className="primaryCard4">
    <div className='primaryTitle'>average album popularity</div>
    {arrays.avgAlbumPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2">{arrays.avgAlbumPop}</span>
         
        </div>
      </div>
    )}
    
  </div>



  <div className="primaryCard4">
    <div className='primaryTitle'>album popularity standard deviation</div>
    {arrays.albumPopsStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{arrays.albumPopsStdDev}</span>
         
        </div>
      </div>
    )}
    
  </div>



  <div className="primaryCard4">
    <div className='primaryTitle'>average artist popularity</div>
    {arrays.avgArtistPop && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2">{arrays.avgArtistPop}</span>
         
        </div>
      </div>
    )}
    
  </div>


  <div className="primaryCard4">
    <div className='primaryTitle'>artist popularity standard deviation</div>
    {arrays.artistPopStdDev && (
      <div className="item">
        <div className="primaryText">
          <span className="primaryName2" id='stdDev'>{arrays.artistPopStdDev}</span>
         
        </div>
      </div>
    )}
    
  </div>



  <div className="primaryCard6">
  <div className='primaryTitle'>average artist followers</div>
  {arrays.avgArtistFolls && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2">
          {arrays.avgArtistFolls}
        </span>
      </div>
    </div>
  )}
</div>



<div className="primaryCard6">
  <div className='primaryTitle'>artist followers standard deviation</div>
  {arrays.artistFollsStdDev && (
    <div className="item">
      <div className="primaryText">
        <span className="primaryName2" id='stdDev'>
          {arrays.artistFollsStdDev}
        </span>
      </div>
    </div>
  )}
</div>
   
  </div>



<div className='audioFeaturesHeader'>audio features</div>
       
  <div className="table-container">
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th className='gradient'>average</th>
                    <th className='gradient' id='stdDev'>standard deviation</th>
                    <th className='gradient'>song with highest value</th>
                    <th className='gradient'>song with lowest value</th>
                </tr>
            </thead>
            <tbody>
                
    
{features.map((feature, index) => {
            const highestSong = highestAudioFeatureSongs[index];
            const lowestSong = lowestAudioFeatureSongs[index];

            return (
              <tr key={feature}>
                <td className='gradient' id={feature}>{feature}</td>
                <td><div className='cellOutline'>{arrays.audioFeatureMeans[index]}</div></td>
                <td><div className='cellOutline'>{arrays.audioFeatureStdDevs[index]}</div></td>
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


       <ReactTooltip
        anchorSelect="#topAlbums"
        html={"based on frequency of occurences in top songs."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>


      <ReactTooltip
        anchorSelect="#topGenres"
        html={"based on frequency of occurences in top artists."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>


      <ReactTooltip
        anchorSelect="#topLabels"
        html={"based on frequency of occurences in top songs."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>


      <ReactTooltip
        anchorSelect="#popularity"
        html={"0-100. assigned by Spotify."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>


      <ReactTooltip
        anchorSelect="#stdDev"
        html={"a larger value indicates more variability, while a smaller value indicates less, on average."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>











      <ReactTooltip
        anchorSelect="#acousticness"
        html={"A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>
      <ReactTooltip
        anchorSelect="#danceability"
        html={"Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity. A value of 0.0 is least danceable and 1.0 is most danceable."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>
      <ReactTooltip
        anchorSelect="#energy"
        html={"Energy is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>
      <ReactTooltip
        anchorSelect="#instrumentalness"
        html={`Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0.`}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>
      <ReactTooltip
        anchorSelect="#liveness"
        html={"Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>
      <ReactTooltip
        anchorSelect="#loudness"
        html={"The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>
      <ReactTooltip
        anchorSelect="#speechiness"
        html={"Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>
      <ReactTooltip
        anchorSelect="#tempo"
        html={"The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>
      <ReactTooltip
        anchorSelect="#valence"
        html={"A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'200px'}}
        clickable={'true'}>
      </ReactTooltip>




      <ReactTooltip
        anchorSelect="#gptTooltip"
        html={"See what ChatGPT thinks of your music taste"}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2',wordBreak:'break-word',width:'100px'}}
        clickable={'true'}>
      </ReactTooltip>
    </div>






      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Popup Window"
        style={customStyles} 
        id="imgDiv"
      >
        <h2 className='gptModalTitle'>ChatGPT creative analysis of <span style={{color:'#1e90ff'}}>{userNameAndId[0]}</span>'s music preferences</h2>
        <span className="timeRange">{selectedTimeRangeClean}</span>
          <div className='gptHaikusDiv'>
                           
            <h4>Three Haikus</h4>
            {apiResponse && (
                          <div className='gptContent'>
                          {apiResponse}
                            </div>
                        )}
            
          </div>
          <div className='gptWordsDiv'>
            <h4>Words</h4>
            {apiResponse && (
                          <div className='gptContent'>
                          {apiResponse}
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

export default Data