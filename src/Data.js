import React from 'react';
import logo from './logo.png';
import noImg from './img/noImg.png';
import Footer from './Footer';

import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';


import axios from 'axios';
import './Data.css';


import { useLocation } from "react-router";




function Data(props) {
    const location = useLocation();
// console.log(props, " props");
// console.log(location, " useLocation Hook");
    const data = location.state?.data;
    const array = location.state.data.split(',');
    const token = location.state.token;


   const [selectedButton, setSelectedButton] = useState(1);

   const selectButton = (index) => {
     setSelectedButton(index);
   };


   const [songs, setSongs] = useState([]);
   const [artists, setArtists] = useState([]);
   const [albums, setAlbums] = useState([]);

   let genreLimit = 20;
   if(parseInt(array[392]) < genreLimit) {
    genreLimit = parseInt(array[392]);
   }
   const genres = array.slice(393, 393+genreLimit)

   const labels = array.slice(633, 638)



   
//    console.log('hello')
//    console.log(array.slice(54,104))

    useEffect(() => {
        const getSongs = async (time_range) => {
            const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    ids: array.slice(4,54).join(',')
                }
            });
            const songData = data.tracks.map(track => ({
                name: track.name,
                artists: track.artists.map(artist => artist.name),
                img: track.album.images[0]?.url || noImg
            }));
            console.log(songData);
            setSongs(songData);

        }

        const getArtists = async (time_range) => {
            const { data } = await axios.get("https://api.spotify.com/v1/artists", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    ids: array.slice(182,232).join(',')
                }
            });
            const artistData = data.artists.map(artist => ({
                name: artist.name,
                img: artist.images[0]?.url || noImg
            }));
            console.log(artistData);
            setArtists(artistData);

        }

        const getAlbums = async (time_range) => {
            const { data } = await axios.get("https://api.spotify.com/v1/albums", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    ids: array.slice(349,359).join(',')
                }
            });
            const albumData = data.albums.map(album => ({
                name: album.name,
                artists: album.artists.map(artist => artist.name),
                img: album.images[0]?.url || noImg
            }));
            console.log(albumData);
            setAlbums(albumData);

        }
    
    
        getSongs(); 
        getArtists(); 
        getAlbums();
      }, []);

    //   console.log(songs)


    return (
        <div>
            <img src={logo} style={{width:80,paddingTop:'20px'}}></img>
            <h4>comparify Data for {array[1]}</h4>
            <div className="navBtnContainer">
                <div className="navBtnOverlay">
                    <button
                    className={`navBtn ${selectedButton === 1 ? 'selected' : ''}`}
                    onClick={() => selectButton(1)}
                    >
                    last month
                    </button>
                    <button
                    className={`navBtn ${selectedButton === 2 ? 'selected' : ''}`}
                    onClick={() => selectButton(2)}
                    >
                    last 6 months
                    </button>
                    <button
                    className={`navBtn ${selectedButton === 3 ? 'selected' : ''}`}
                    onClick={() => selectButton(3)}
                    >
                    all time
                    </button>
                </div>
            </div>





            <div className="songContainer">
  <div className="songTitle">top songs</div>
  <div className="songCard">
  <div className="songContent">
      {songs.map((song, index) => (
        <div key={index} className="songItem">
          <img src={song.img} className="songImage" />
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
      {artists.map((artist, index) => (
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
      {albums.map((album, index) => (
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

<div className="songContainer">
  <div className="songTitle">top genres</div>
  <div className="songCard">
  <div className="songContent">
      {genres.map((genre, index) => (
        <div key={index} className="songItem">
          <div className="songText">
            <span className="songName">{genre}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

<div className="songContainer">
  <div className="songTitle">top labels</div>
  <div className="songCard">
  <div className="songContent">
      {labels.map((label, index) => (
        <div key={index} className="songItem">
          <div className="songText">
            <span className="songName">{label}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

{array.map((item, index) => (
          <li key={index}>{item}</li>
        ))}    



<Footer/>



         
            
            
        </div>
    )
}

export default Data