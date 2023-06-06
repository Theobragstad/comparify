import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router';
import logo from './img/logo.png';
import missingImage from './img/missingImage.png';
import Footer from './Footer';
import './Data.css';




function Data() {
    const [divColors, setDivColors] = useState([]);
    const location = useLocation();
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

   const avgSongPop = array[155];
   const avgSongAgeArray = array[159].split('-');
  
   const pctExplicit = array[163];

   const avgArtistPop = array[333];
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

   const avgArtistFollowers = simplifyNumber(parseInt(array[337]));

   const avgAlbumPop = array[380];
   const songReleaseDateStandardDeviation = array[820];
   const [mostLeastPopularSongs, setMostLeastPopularSongs] = useState([]);
   const [mostLeastPopularArtists, setMostLeastPopularArtists] = useState([]);
   const [mostLeastPopularAlbums, setMostLeastPopularAlbums] = useState([]);
   const [minMaxAudioFeatureSongs, setMinMaxAudioFeatureSongs] = useState([]);
   const [oldestSong, setOldestSong] = useState([]);
   const [newestSong, setNewestSong] = useState([]);
   const stats = array.slice(651, 673);
   console.log(stats);
   const features = ['acousticness','danceability','duration','energy','instrumentalness','key','liveness','loudness','speechiness','tempo','valence'];
   
   const getLeastMostPopularSong = async (time_range) => {
    const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
       headers: {
           Authorization: `Bearer ${token}`
       },
       params: {
           ids: array.slice(167,169).join(',')
       }
   });
   const songData = data.tracks.map(track => ({
       name: track.name,
       artists: track.artists.map(artist => artist.name),
       img: track.album.images[0]?.url || missingImage
   }));
   setMostLeastPopularSongs(songData);
}

const getLeastMostPopularArtist = async (time_range) => {
   const { data } = await axios.get("https://api.spotify.com/v1/artists", {
       headers: {
           Authorization: `Bearer ${token}`
       },
       params: {
           ids: [array[341], array[345]].join(',')
       }
   });
   const artistData = data.artists.map(artist => ({
       name: artist.name,
       img: artist.images[0]?.url || missingImage
   }));
   setMostLeastPopularArtists(artistData);
}

const getLeastMostPopularAlbum = async (time_range) => {
const { data } = await axios.get("https://api.spotify.com/v1/albums", {
       headers: {
           Authorization: `Bearer ${token}`
       },
       params: {
           ids: [array[384], array[388]].join(',')
       }
   });
   const albumData = data.albums.map(album => ({
       name: album.name,
       artists: album.artists.map(artist => artist.name),
       img: album.images[0]?.url || missingImage
   }));
   setMostLeastPopularAlbums(albumData);
}

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
                img: track.album.images[0]?.url || missingImage
            }));
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
                img: artist.images[0]?.url || missingImage
            }));
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
                img: album.images[0]?.url || missingImage
            }));
            setAlbums(albumData);

        }


        const getMostLeastPopular = async (time_range) => {
            await getLeastMostPopularSong();
            await getLeastMostPopularArtist();
            await getLeastMostPopularAlbum();
        }

        const getOldestNewestSongs = async (time_range) => {
            const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    ids: [array[174], array[178]].join(',')
                }
            });
            const songData = data.tracks.map(track => ({
                name: track.name,
                artists: track.artists.map(artist => artist.name),
                img: track.album.images[0]?.url || missingImage
            }));
            setOldestSong(songData[0]);
            setNewestSong(songData[1]);
        }

        const getMinMaxAudioFeatureSongs = async (time_range) => {
            const indices = [721,722,730,731, 739,740, 748,749,757,758,766,767,775,776,784,785,793,794,802,803,811,812];
            const ids = indices.map(index => array[index]);
        
            
            const { data } = await axios.get("https://api.spotify.com/v1/tracks", {
               headers: {
                   Authorization: `Bearer ${token}`
               },
               params: {
                   ids: ids.join(',')
               }
           });
           const songData = data.tracks.map(track => ({
            name: track.name,
            artists: track.artists.map(artist => artist.name),
            img: track.album.images[0]?.url || missingImage
        }));
           setMinMaxAudioFeatureSongs(songData);
        }
    
    
        getSongs(); 
        getArtists(); 
        getAlbums();
        getMostLeastPopular();
        getOldestNewestSongs();
        //getMinMaxAudioFeatureSongs();
      }, []);



   
    

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
  <div className="songCard2">
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
  <div className="songCard2">
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


<div className="statContainer1">
  <div className="statTitle1">average song popularity</div>
  <div className="statCard1">
  <div className="statContent1">
     {avgSongPop}
    </div>
  </div>
</div>


<div className="statContainer2">
  <div className="statTitle2">average song age</div>
  <div className="statCard2">
  <div className="statContent2">
       
  {avgSongAgeArray[0]} year{avgSongAgeArray[0] !== '1' && 's'},
  <br />
  {avgSongAgeArray[1]} month{avgSongAgeArray[1] !== '1' && 's'}
    </div>
  </div>
</div>





<div className="statContainer3">
  <div className="statTitle3">percent explicit songs</div>
  <div className="statCard3">
  <div className="statContent3">
       
 {pctExplicit} %
    </div>
  </div>
</div>

<div className="statContainer1">
  <div className="statTitle1">average song popularity</div>
  <div className="statCard1">
  <div className="statContent1">
{avgArtistPop}       
    </div>
  </div>
</div>

<div className="statContainer1">
  <div className="statTitle1">average album popularity</div>
  <div className="statCard1">
  <div className="statContent1">
{avgAlbumPop}       
    </div>
  </div>
</div>



<div className="statContainer4">
  <div className="statTitle4">average artist followers</div>
  <div className="statCard4">
  <div className="statContent4">
{avgArtistFollowers}       
    </div>
  </div>
</div>



<div className="statContainer5">
  <div className="statTitle5">song age standard deviation</div>
  <div className="statCard5">
  <div className="statContent5">
       
{songReleaseDateStandardDeviation} years
    </div>
  </div>
</div>





<div className="songContainer">
  <div className="songTitle">most popular song</div>
  <div className="songCard1">
  <div className="songContent">
  {mostLeastPopularSongs.map((song, index) => {
  if (index === 0) {
    return (
      <div key={index} className="songItem">
        <img src={song.img} className="songImage" />
        <div className="songText">
          <span className="songName">{song.name}</span>
          <span className="songArtists">&emsp;{song.artists.join(', ')}</span>
        </div>
      </div>
    );
  } else {
    return null; 
  }
})}
    </div>
  </div>
</div>


<div className="songContainer">
  <div className="songTitle">least popular song</div>
  <div className="songCard1">
  <div className="songContent">
  {mostLeastPopularSongs.map((song, index) => {
  if (index === 1) {
    return (
      <div key={index} className="songItem">
        <img src={song.img} className="songImage" />
        <div className="songText">
          <span className="songName">{song.name}</span>
          <span className="songArtists">&emsp;{song.artists.join(', ')}</span>
        </div>
      </div>
    );
  } else {
    return null; 
  }
})}
    </div>
  </div>
</div>

<div className="songContainer">
  <div className="songTitle">most popular artist</div>
  <div className="songCard1">
  <div className="songContent">
  {mostLeastPopularArtists.map((artist, index) => {
  if (index === 0) {
    return (
        <div key={index} className="songItem">
        <img src={artist.img} className="songImage" />
        <div className="songText">
          <span className="songName">{artist.name}</span>
        </div>
      </div>
    );
  } else {
    return null; 
  }
})}
    </div>
  </div>
</div>


<div className="songContainer">
  <div className="songTitle">least popular artist</div>
  <div className="songCard1">
  <div className="songContent">
  {mostLeastPopularArtists.map((artist, index) => {
  if (index === 1) {
    return (
        <div key={index} className="songItem">
        <img src={artist.img} className="songImage" />
        <div className="songText">
          <span className="songName">{artist.name}</span>
        </div>
      </div>
    );
  } else {
    return null; 
  }
})}
    </div>
  </div>
</div>




<div className="songContainer">
  <div className="songTitle">most popular album</div>
  <div className="songCard1">
  <div className="songContent">
  {mostLeastPopularAlbums.map((album, index) => {
  if (index === 0) {
    return (
       
<div key={index} className="songItem">
          <img src={album.img} className="songImage" />
          <div className="songText">
            <span className="songName">{album.name}</span>
            <span className="songArtists">&emsp;{album.artists.join(', ')}</span>
          </div>
        </div>
    );
  } else {
    return null; 
  }
})}
    </div>
  </div>
</div>




<div className="songContainer">
  <div className="songTitle">least popular album</div>
  <div className="songCard1">
  <div className="songContent">
  {mostLeastPopularAlbums.map((album, index) => {
  if (index === 1) {
    return (
       
<div key={index} className="songItem">
          <img src={album.img} className="songImage" />
          <div className="songText">
            <span className="songName">{album.name}</span>
            <span className="songArtists">&emsp;{album.artists.join(', ')}</span>
          </div>
        </div>
    );
  } else {
    return null; 
  }
})}
    </div>
  </div>
</div>



<div className="songContainer">
  <div className="songTitle">oldest song</div>
  <div className="songCard1">
  <div className="songContent">
      <div className="songItem">
        <img src={oldestSong.img} className="songImage" />
        <div className="songText">
          <span className="songName">{oldestSong.name}</span>
          {oldestSong.artists && (
            <span className="songArtists">&emsp;{oldestSong.artists.join(', ')}</span>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

<div className="songContainer">
  <div className="songTitle">newest song</div>
  <div className="songCard1">
  <div className="songContent">
      <div className="songItem">
        <img src={newestSong.img} className="songImage" />
        <div className="songText">
          <span className="songName">{newestSong.name}</span>
          {newestSong.artists && (
            <span className="songArtists">&emsp;{newestSong.artists.join(', ')}</span>
          )}
        </div>
      </div>
    </div>
  </div>
</div>




<table>
  <tbody>
    <tr>
      <td></td>
      <td className='stat2'  >mean</td>
      <td className='stat2'>standard deviation</td>
      <td className='stat2'>highest</td>
      <td className='stat2'>lowest</td>
    </tr>
    {stats.map((value, index) => {
          if (index % 2 === 0) {
            const featureIndex = Math.floor(index / 2);
            const mean = value;
            const stdDev = stats[index + 1];
            const shouldRound = features[featureIndex] !== 'duration';
            const roundedMean = shouldRound ? parseFloat(mean).toFixed(2) : mean;
            const roundedStdDev = shouldRound ? parseFloat(stdDev).toFixed(2) : stdDev;

            const maxSong = minMaxAudioFeatureSongs[featureIndex * 2];
            const minSong = minMaxAudioFeatureSongs[featureIndex * 2 + 1];
            
            return (
              <tr key={index}>
                <td className='stat1'><div className='buttonCell'>{features[featureIndex]}</div></td>

                <td className='dataPt'>{roundedMean}</td>
                <td className='dataPt'>{roundedStdDev}</td>
               
                <td className='dataPt '>
                {maxSong && (
  <div className="songText2">
    <img src={maxSong.img} alt={maxSong.name} className="songImage" />
    <span className="songName">{maxSong.name}</span>
    {maxSong.artists && (
      <span className="songArtists">&emsp;{maxSong.artists.join(', ')}</span>
    )}
  </div>
)}
             
            </td>
                <td className='dataPt'>
                {minSong && (
  <div className="songText2">
    <img src={minSong.img} alt={minSong.name} className="songImage" />
    <span className="songName">{minSong.name}</span>
    {minSong.artists && (
      <span className="songArtists">&emsp;{minSong.artists.join(', ')}</span>
    )}
  </div>
)}
             
            </td>
              </tr>
            );
          }
          return null;
        })}
  </tbody>
</table>






<div className='songCard'>
{array.map((item, index) => (
          <li key={index}>{item}</li>
        ))}    

</div>





         
            
            
        </div>
    )
}

export default Data