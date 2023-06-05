import Big from 'big.js';
import React from 'react';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';


const [userNameAndId, setUserNameAndId] = useState([]);







/*
userNameAndId[2]:

ST
songIds[<= 50]:
mostLeastPopSongIds[<= 2]:
oldestNewestSongIds[<= 2]:
highestAudioFeatureSongIds[<= 11]:
lowestAudioFeatureSongIds[<= 11]:

artistIds[<= 50]:
mostLeastPopArtistIds[<= 2]:

albumIds[<= 10]:
mostLeastPopAlbumIds[<= 2]:

genres[<= 20]:
labels[<= 5]:

audioFeatureMeans[11]:
audioFeatureStdDevs[11]:

avgSongPop[1]
avgSongAge[1]
songAgeStdDev[1]
pctSongsExpl[1]

avgArtistPop[1]
avgArtistFolls[1]

avgAlbumPop[1]



MT
songIds[<= 50]:
mostLeastPopSongIds[<= 2]:
oldestNewestSongIds[<= 2]:
highestAudioFeatureSongIds[<= 11]:
lowestAudioFeatureSongIds[<= 11]:

artistIds[<= 50]:
mostLeastPopArtistIds[<= 2]:

albumIds[<= 10]:
mostLeastPopAlbumIds[<= 2]:

genres[<= 20]:
labels[<= 5]:

audioFeatureMeans[11]:
audioFeatureStdDevs[11]:

avgSongPop[1]
avgSongAge[1]
songAgeStdDev[1]
pctSongsExpl[1]

avgArtistPop[1]
avgArtistFolls[1]

avgAlbumPop[1]

LT
songIds[<= 50]:
mostLeastPopSongIds[<= 2]:
oldestNewestSongIds[<= 2]:
highestAudioFeatureSongIds[<= 11]:
lowestAudioFeatureSongIds[<= 11]:

artistIds[<= 50]:
mostLeastPopArtistIds[<= 2]:

albumIds[<= 10]:
mostLeastPopAlbumIds[<= 2]:

genres[<= 20]:
labels[<= 5]:

audioFeatureMeans[11]:
audioFeatureStdDevs[11]:

avgSongPop[1]
avgSongAge[1]
songAgeStdDev[1]
pctSongsExpl[1]

avgArtistPop[1]
avgArtistFolls[1]

avgAlbumPop[1]
*/


function Code() {
    const [songIds, setSongIds] = useState([]);
    const [mostLeastPopSongIds, setMostLeastPopSongIds] = useState([]);
    const [oldestNewestSongIds, setOldestNewestSongIds] = useState([]);
    const [highestAudioFeatureSongIds, setHighestAudioFeatureSongIds] = useState([]);
    const [lowestAudioFeatureSongIds, setLowestAudioFeatureSongIds] = useState([]);
    const [avgSongPop, setAvgSongPop] = useState('');
    const [avgSongAge, setAvgSongAge] = useState('');
    const [songAgeStdDev, setSongAgeStdDev] = useState('');
    const [pctSongsExpl, setPctSongsExpl] = useState('');
    const [audioFeatureMeans, setAudioFeatureMeans] = useState([]);
    const [audioFeatureStdDevs, setAudioFeatureStdDevs] = useState([]);



    const [artistIds, setArtistIds] = useState([]);
    const [mostLeastPopArtistIds, setMostLeastPopArtistIds] = useState([]);
    const [avgArtistPop, setAvgArtistPop] = useState('');
    const [avgArtistFolls, setAvgArtistFolls] = useState('');

    const [albumIds, setAlbumIds] = useState([]);
    const [mostLeastPopAlbumIds, setMostLeastPopAlbumIds] = useState([]);
    const [avgAlbumPop, setAvgAlbumPop] = useState('');

    const [genres, setGenres] = useState([]);

    const [labels, setLabels] = useState([]);

    

    

    

    


    
    const [files, setFiles] = useState([]);

    const navigate = useNavigate();
    

    let songFeatures = {
        acousticness: [],
        danceability: [],
        duration_ms: [],
        energy: [],
        instrumentalness: [],
        key: [],
        liveness: [],
        loudness: [],
        speechiness: [],
        tempo: [],
        valence: []
    };


    const [token, setToken] = useState('');
    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem('token');
    
        if (!token && hash) {
            token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
            window.location.hash = '';
            window.localStorage.setItem('token', token);
        }
    
        setToken(token);
    }, []);


    const handleUpload = (e) => {
      setFiles([...files, e.target.files]);
    };


    const arrayStatsCalculator = {
        mean: function(array) {
            return arrayStatsCalculator.sum(array) / array.length;
        },
       
        standardDeviation: function(array) {
		    return Math.sqrt(arrayStatsCalculator.variance(array));
	    },
        variance: function(array) {
            var mean = arrayStatsCalculator.mean(array);
            return arrayStatsCalculator.mean(array.map(function(num) {
                return Math.pow(num - mean, 2);
            }));
        },
        sum: function(array) {
            var num = 0;
            for (var i = 0, l = array.length; i < l; i++) num += array[i];
            return num;
        }
    };

    const msToMinSec = (ms) => {
        const durationMinutes = Math.floor(ms / 60000);
        const durationSeconds = ((ms % 60000) / 1000).toFixed(0);
        return`${durationMinutes}:${durationSeconds.padStart(2, '0')}`;
    };

    const calculateArrayStats = (start, end) => {
        let stats = [];
        for(let array in songFeatures) {
            const arrayData = songFeatures[array].slice(start, end + 1); 
            if(array == 'duration_ms') {
                stats.push([msToMinSec(arrayStatsCalculator.mean(arrayData)), msToMinSec(arrayStatsCalculator.standardDeviation(arrayData))]);
            }
            else {
            stats.push([arrayStatsCalculator.mean(arrayData), arrayStatsCalculator.standardDeviation(arrayData)]);
            }
        }
        return stats;
    };

    const msToYears = (ms) => {
        const msInYear = 365.25 * 24 * 60 * 60 * 1000; 
        const years = ms / msInYear;
        const roundedYears = Math.round(years * 100) / 100;
        return roundedYears;
    };




    const getUserNameAndId = async () => {
        const {data} = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {

            }
        });
        
        return ['userNameAndId[2]', data.data.display_name, data.data.id];
    };

    const getSongs = async (timeRange) => {
        let songCode = [];
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                time_range: timeRange,
                limit: 50
            }
        });
        
    };

    const getArtists = async (timeRange) => {
        
    };

    const getAlbums = async (timeRange) => {
        
    };

    const getGenres = async (timeRange) => {
        
    };

    const getLabels = async (timeRange) => {
        
    };

    


    



  
    

    const generateCode = async () => {
        let code = await getUserNameAndId();

        // const timeRanges = ['short_term', 'medium_term', 'long_term'];
        // const timeRanges = ['short_term'];
        // for (const timeRange of timeRanges) {
        //     let songs = await getSongs(timeRange);
        //     let artists = await getArtists(timeRange);
        //     let albums = await getAlbums(timeRange);
        //     let genres = await getGenres(timeRange);
        //     let labels = await getLabels(timeRange);
        //     code.push(timeRange + ':', songs, artists, albums, genres, labels);
        // };

        return code;
    };

    const downloadCode = async () => {
        const blob = new Blob([await generateCode()], {type: 'text/plain'});
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'code.txt';
        link.click();
    };

    const toDataPage= async () => {
        const timeRanges = ['short_term', 'medium_term', 'long_term'];
        let code = await getTopItems(timeRanges);
        navigate('/data', {state: {data: code.join(',')}});
    };

    return (
        <div>
            <button onClick={downloadCode} className="basicBtn">Download your code</button>
            <div> 
                <a onClick={()=>{toDataPage()}}><button className='basicBtn'>View your data</button></a>
            </div>
            <div>
                <h4 style={{color:'#aaaaaa'}}>or</h4>
                <h2>compare</h2>
                <input type="file" onChange={handleUpload}/>
                <button className="submitBtn" disabled={files.length !== 1}>submit</button>
            </div>
            <Footer/>
        </div>
    )
}

export default Code;