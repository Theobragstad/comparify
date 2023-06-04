import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router';
import logo from './img/logo.png';
import missingImage from './img/missingImage.png';
import './Data.css';


function Data() {
  const [selectedButton, setSelectedButton] = useState(1);
  const [selectedTimeRange, setSelectedTimeRange] = useState('short_term');
  const timeRanges = ['short_term', 'medium_term', 'long_term'];

  const selectButton = (index) => {
    setSelectedButton(index);
    setSelectedTimeRange(timeRanges[index - 1]);
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
    getTopSongs(arrays.songIds);
    getHighestAudioFeatureSongs(arrays.highestAudioFeatureSongIds);
    getLowestAudioFeatureSongs(arrays.lowestAudioFeatureSongIds);
    getMostLeastPopSongs(arrays.mostLeastPopSongIds);
    getOldestNewestSongs(arrays.oldestNewestSongIds);
    getTopAlbums(arrays.albumIds);
    getMostLeastPopAlbums(arrays.mostLeastPopAlbumIds);
    getTopArtists(arrays.artistIds);
    getMostLeastPopArtists(arrays.artistIds);
  }, [selectedTimeRange]);

  return (
    <div>
      <img src={logo} style={{width:80,paddingTop:'20px'}}></img>
      <h4>comparify Data for {userNameAndId[0]}</h4>
      <div className="navBtnContainer">
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
              {topSongs.map((song, index) => (
                <div key={index} className="songItem">
                  <img src={song.img} className="songImage"/>
                  <div className="songText">
                    <span className="songName">{song.name}</span>
                    <span className="songArtists">&emsp;{song.artists.join(', ')}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="songContainer">
        <div className="songTitle">top artists</div>
          <div className="songCard">
            <div className="songContent">
              {topArtists.map((artist, index) => (
                <div key={index} className="songItem">
                  <img src={artist.img} className="songImage" />
                  <div className="songText">
                    <span className="songName">{artist.name}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="songContainer">
        <div className="songTitle">top albums</div>
          <div className="songCard">
            <div className="songContent">
              {topAlbums.map((album, index) => (
                <div key={index} className="songItem">
                  <img src={album.img} className="songImage" />
                  <div className="songText">
                    <span className="songName">{album.name}</span>
                    <span className="songArtists">&emsp;{album.artists.join(', ')}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Data