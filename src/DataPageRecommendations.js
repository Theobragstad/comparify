import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useLocation} from 'react-router';
import spotifysmall from './img/spotifysmall.png'


const DataPageRecommendations = (props) => {
    const location = useLocation();
    const token = location.state.token;

    const [safeRecommendationSongs, setSafeRecommendationSongs] = useState([]);
    const [exploratoryRecommendationSongs, setExploratoryRecommendationSongs] = useState([]);

    const getSongRecommendations = async (arrayToSet, seed_artists) => {
        const {data} = await axios.get("https://api.spotify.com/v1/recommendations", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        params: {
            limit: 20,
            seed_artists: `${seed_artists}`,
            // seed_genres: '',
            // seed_tracks: '',
            // min_acousticness:'',
            // max_acousticness:'',
            // target_acousticness:'',
            // min_danceability:'',
            // max_danceability:'',
            // target_danceability:'',
            // min_duration_ms:'',
            // max_duration_ms:'',
            // target_duration_ms:'',
            // min_energy:'',
            // max_energy:'',
            // target_energy:'',
            // min_instrumentalness:'',
            // max_instrumentalness:'',
            // target_instrumentalness:'',
            // min_key:'',
            // max_key:'',
            // target_key:'',
            // min_liveness:'',
            // max_liveness:'',
            // target_liveness:'',
            // min_loudness:'',
            // max_loudness:'',
            // target_loudness:'',
            // min_mode:'',
            // max_mode:'',
            // target_mode:'',
            // min_popularity:'',
            // max_popularity:'',
            // target_popularity:'',
            // min_speechiness:'',
            // max_speechiness:'',
            // target_speechiness:'',
            // min_tempo:'',
            // max_tempo:'',
            // target_tempo:'',
            // min_time_signature:'',
            // max_time_signature:'',
            // target_time_signature:'',
            // min_valence:'',
            // max_valence:'',
            // target_valence:''
        }
        });

        const recommendations = data.tracks.map(track => ({
            name: track.name,
            artists: track.artists.map(artist => artist.name),
            img: track.album.images[0]?.url
        }));

        arrayToSet(recommendations);
    };

    useEffect(() => {
        getSongRecommendations(setSafeRecommendationSongs, props.safeArtistIds);
        getSongRecommendations(setExploratoryRecommendationSongs, props.exploratoryArtistIds);
    }, []);

   

  return (
  <div>
    <div style={{marginBottom:'0px', marginTop:'20px',fontWeight:'bold', fontSize:'18px'}}>Safe Playlist<button style={{color:'#1ed760', fontSize:'12px', marginLeft:'20px', border:'none',backgroundColor:'white', cursor:'pointer',fontWeight:'bold'}}>add to <img src={spotifysmall} style={{width:'15px', verticalAlign:'middle'}}></img></button></div>
    <div style={{fontWeight:'bold', fontSize:'12px', marginBottom:'10px'}}>Songs you're likely to enjoy based on your preferences for this period.</div>
    <div className="playlistCard">
        {safeRecommendationSongs.map((song, index) => (
            <div key={index} className="item">
                <img src={song.img} className="primaryImage" />
                <div className="primaryText">
                    <span className="primaryName">{song.name}</span>
                    <span className="primaryArtists">{song.artists.join(', ')}</span>
                </div>
            </div>
        ))}
    </div>

    <div style={{marginBottom:'0px', marginTop:'20px',fontWeight:'bold', fontSize:'18px'}}>Exploratory Playlist<button style={{color:'#1ed760', fontSize:'12px', marginLeft:'20px', border:'none',backgroundColor:'white', cursor:'pointer',fontWeight:'bold'}}>add to <img src={spotifysmall} style={{width:'15px', verticalAlign:'middle'}}></img></button></div>
    <div style={{fontWeight:'bold', fontSize:'12px', marginBottom:'10px'}}>Songs you might not usually listen to. These have different characteristics than your typical preferences for this period.</div>
    <div className="playlistCard">
        {exploratoryRecommendationSongs.map((song, index) => (
            <div key={index} className="item">
                <img src={song.img} className="primaryImage" />
                <div className="primaryText">
                    <span className="primaryName">{song.name}</span>
                    <span className="primaryArtists">{song.artists.join(', ')}</span>
                </div>
            </div>
        ))}
    </div>

  </div>
  );
}
  
export default DataPageRecommendations;