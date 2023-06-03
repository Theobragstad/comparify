import Big from 'big.js';
import React from 'react';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';


function Code() {
    const [files, setFiles] = useState([]);

    const navigate = useNavigate();

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



    const me = async () => {
        const {data} = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {

            }
        });
        
        return ['userNameAndId[2]', data.display_name, data.id];
    };

    const getSongAudioFeatureData = async (songIds) => {
        const {data} = await axios.get("https://api.spotify.com/v1/audio-features", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                ids: songIds.join(",")
            }
        });

        const audioFeatures = data.audio_features.map(item => ({
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
            valence: item.valence
        }));

        const fields = Object.keys(audioFeatures[0]).filter(field => field !== 'id');

        const means = {};
        const stdDevs = {};

        fields.forEach(field => {
            const values = audioFeatures.map(item => item[field]);
            const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
            const roundedMean = field !== 'duration_ms' ? Number(mean.toFixed(2)) : mean;
            const stdDev = Math.sqrt(values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length);
            const roundedStdDev = field !== 'duration_ms' ? Number(stdDev.toFixed(2)) : stdDev;
            means[field] = roundedMean;
            stdDevs[field] = roundedStdDev;
        });

        if ('duration_ms' in means) {
            const durationMean = means['duration_ms'];
            const minutes = Math.floor(durationMean / 60000); 
            const seconds = Math.floor((durationMean % 60000) / 1000);
            means['duration_ms'] = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        if ('duration_ms' in stdDevs) {
            const durationStdDev = stdDevs['duration_ms'];
            const minutes = Math.floor(durationStdDev / 60000); 
            const seconds = Math.floor((durationStdDev % 60000) / 1000);
            stdDevs['duration_ms'] = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        const maxAudioFeatureSongIds = {};
        const minAudioFeatureSongIds = {};

        audioFeatures.forEach(item => {
        Object.keys(item).forEach(field => {
            if (field === 'id') return;

            if (!maxAudioFeatureSongIds[field] || item[field] > audioFeatures.find(song => song.id === maxAudioFeatureSongIds[field])[field] || (item[field] === audioFeatures.find(song => song.id === maxAudioFeatureSongIds[field])[field] && item.id < maxAudioFeatureSongIds[field])) {
            maxAudioFeatureSongIds[field] = item.id;
            }

            if (!minAudioFeatureSongIds[field] || item[field] < audioFeatures.find(song => song.id === minAudioFeatureSongIds[field])[field] || (item[field] === audioFeatures.find(song => song.id === minAudioFeatureSongIds[field])[field] && item.id < minAudioFeatureSongIds[field])) {
            minAudioFeatureSongIds[field] = item.id;
            }
        });
        });

        const highestAudioFeatureSongIdsValues = Object.values(maxAudioFeatureSongIds);
        const lowestAudioFeatureSongIdsValues = Object.values(minAudioFeatureSongIds);

        return ['audioFeatureMeans[11]', Object.values(means), 'audioFeatureStdDevs[11]', Object.values(stdDevs), 'highestAudioFeatureSongIds[<=11]', highestAudioFeatureSongIdsValues, 'lowestAudioFeatureSongIds[<=11]', lowestAudioFeatureSongIdsValues];
    };

    const meSongs = async (timeRange) => {
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

        const songIds = data.items.map(item => item.id);
        songCode.push('songIds[<=50]', songIds);

        const songIdsAndPops = data.items.map(item => ({
            id: item.id,
            pop: item.popularity
        }));

        const mostPopSongId = songIdsAndPops.reduce((currentPopularSongId, currentSong) => {
            if (!currentPopularSongId || currentSong.pop > songIdsAndPops.find(album => album.id === currentPopularSongId).pop) {
              return currentSong.id;
            }
            return currentPopularSongId;
        }, null);

        const leastPopSongId = songIdsAndPops.reduce((currentPopularSongId, currentSong) => {
            if (!currentPopularSongId || currentSong.pop < songIdsAndPops.find(album => album.id === currentPopularSongId).pop) {
                return currentSong.id;
            }
            return currentPopularSongId;
        }, null);

        songCode.push('mostLeastPopSongIds[<=2]', mostPopSongId, leastPopSongId);


        const songIdsAndReleaseDates = data.items.map(item => ({
            id: item.id,
            releaseDate: item.album.release_date
        })).filter(item => item.releaseDate !== '0000');


        const sortedSongIdsAndReleaseDates = songIdsAndReleaseDates.sort((a, b) => {
            const dateA = new Date(a.releaseDate);
            const dateB = new Date(b.releaseDate);
            return dateA - dateB;
        });
          
        const oldestSongId = sortedSongIdsAndReleaseDates[0].id;
        const newestSongId = sortedSongIdsAndReleaseDates[sortedSongIdsAndReleaseDates.length - 1].id;
          
        songCode.push('oldestNewestSongIds[<=2]', oldestSongId, newestSongId);


        const songPops = songIdsAndPops.map(item => item.pop);
        const sumSongPops = songPops.reduce((accumulator, current) => accumulator + current, 0);
        const avgSongPop = (sumSongPops / songPops.length);
        const squaredDifferencesSongPops = songPops.map(pop => Math.pow(pop - avgSongPop, 2));
        const varianceSongPops = squaredDifferencesSongPops.reduce((accumulator, current) => accumulator + current, 0) / songPops.length;
        const songPopStdDev = Math.sqrt(varianceSongPops);

        songCode.push('avgSongPop[1]', avgSongPop.toFixed(2), 'songPopStdDev[1]', songPopStdDev.toFixed(2));


        const today = new Date();
        const totalSongAges = songIdsAndReleaseDates.reduce((sum, item) => {
            const releaseDate = new Date(item.releaseDate);
            const ageInMilliseconds = today - releaseDate;
            return sum + ageInMilliseconds;
        }, 0);

        const averageSongAgeInMilliseconds = totalSongAges / songIdsAndReleaseDates.length;
        const averageSongAge = new Date(averageSongAgeInMilliseconds);

        const songAgeYr = averageSongAge.getUTCFullYear() - 1970;
        const songAgeMo = averageSongAge.getUTCMonth();

        const squaredDifferencesSongAges = songIdsAndReleaseDates.map(item => {
            const releaseDate = new Date(item.releaseDate);
            const ageInMilliseconds = today - releaseDate;
            const difference = ageInMilliseconds - averageSongAgeInMilliseconds;
            return difference * difference;
        });
        
        const averageSquaredDifferenceSongAges = squaredDifferencesSongAges.reduce((sum, difference) => sum + difference, 0) / songIdsAndReleaseDates.length;
        
        const songAgeStdDev = Math.sqrt(averageSquaredDifferenceSongAges);
        const songAgeStdDevAsDate = new Date(songAgeStdDev);
        const songAgeStdDevYr = songAgeStdDevAsDate.getUTCFullYear() - 1970;
        const songAgeStdDevMo = songAgeStdDevAsDate.getUTCMonth();


        songCode.push('avgSongAgeYrMo[2]', songAgeYr, songAgeMo, 'songAgeStdDev[1]', songAgeStdDevYr, songAgeStdDevMo);



        const explicitSongBooleans = data.items.map(item => item.explicit);
        const explicitSongCount = explicitSongBooleans.reduce((count, value) => count + (value ? 1 : 0), 0);
        const pctSongsExpl = (explicitSongCount / explicitSongBooleans.length) * 100;
        songCode.push('pctSongsExpl[1]', pctSongsExpl);
        

        songCode.push((await getSongAudioFeatureData(songIds)).concat());

        songCode.push(await albums(data.items.map(item => item.album.id)));

        return songCode;
    };

    const meArtists = async (timeRange) => {
        let artistCode = [];
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/artists", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                time_range: timeRange,
                limit: 50
            }
        });

        const artistIds = data.items.map(item => item.id);
        artistCode.push('artistIds[<=50]', artistIds);


        const artistIdsAndPops = data.items.map(item => ({
            id: item.id,
            pop: item.popularity
        }));
        
        const mostPopArtistId = artistIdsAndPops.reduce((currentPopularArtistId, currentArtist) => {
            if (!currentPopularArtistId || currentArtist.pop > artistIdsAndPops.find(album => album.id === currentPopularArtistId).pop) {
              return currentArtist.id;
            }
            return currentPopularArtistId;
        }, null);

        const leastPopArtistId = artistIdsAndPops.reduce((currentPopularArtistId, currentArtist) => {
            if (!currentPopularArtistId || currentArtist.pop < artistIdsAndPops.find(album => album.id === currentPopularArtistId).pop) {
                return currentArtist.id;
            }
            return currentPopularArtistId;
        }, null);

        artistCode.push('mostLeastPopArtistIds[<=2]', mostPopArtistId, leastPopArtistId);

        
        const artistPops = artistIdsAndPops.map(item => item.pop);
        const sumArtistPops = artistPops.reduce((accumulator, current) => accumulator + current, 0);
        const avgArtistPop = (sumArtistPops / artistPops.length);
        const squaredDifferencesArtistPops = artistPops.map(pop => Math.pow(pop - avgArtistPop, 2));
        const varianceArtistPops = squaredDifferencesArtistPops.reduce((accumulator, current) => accumulator + current, 0) / artistPops.length;
        const artistPopStdDev = Math.sqrt(varianceArtistPops);

        artistCode.push('avgArtistPop[1]', avgArtistPop.toFixed(2), 'artistPopStdDev[1]', artistPopStdDev.toFixed(2));

        artistCode.push((await artists(artistIds)).concat());


        const genresAssocWithArtists = data.items.map(item => item.genres);
        const genresAssocWithArtistsFlat = genresAssocWithArtists.flat();
        const genreCounts = {};
        genresAssocWithArtistsFlat.forEach(genre => {
            genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
        const sortedGenres = Object.keys(genreCounts).sort((a, b) => {
            return genreCounts[b] - genreCounts[a];
        });
        const topGenres = sortedGenres.slice(0, 20);
        artistCode.push('topGenresByArtist[<=20]', topGenres);



        return artistCode;
    };

    const artists = async (artistIds) => {
        const {data} = await axios.get("https://api.spotify.com/v1/artists", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                ids: artistIds.join(',')
            }
        });

        const artistFolls = data.artists.map(artist => parseInt(artist.followers.total));
        const sumArtistFolls = artistFolls.reduce((accumulator, currentValue) => {
            return new Big(accumulator).plus(currentValue);
        }, new Big(0));
        const avgArtistFolls = sumArtistFolls.div(artistFolls.length);

        const squaredDiffsArtistFolls = artistFolls.map(foll => {
            const diff = new Big(foll).minus(avgArtistFolls);
            return diff.times(diff);
        });
          
        const sumSquaredDiffsArtistFolls = squaredDiffsArtistFolls.reduce((accumulator, currentValue) => {
            return new Big(accumulator).plus(currentValue);
        }, new Big(0));
        
        const avgSquaredDiffArtistFolls = sumSquaredDiffsArtistFolls.div(squaredDiffsArtistFolls.length);
          
        const artistFollsStdDev = avgSquaredDiffArtistFolls.sqrt();

        return ['avgArtistFolls[1]', simplifyNumber(avgArtistFolls), 'artistFollsStdDev[1]', simplifyNumber(artistFollsStdDev)];
    };


    const albums = async (albumIds) => {
        let albumCode = [];

        const albumIdsAndPopsLabels = [];

        for (let i = 0; i < albumIds.length; i += 20) {
            const chunk = albumIds.slice(i, i + 20);
        
            const { data } = await axios.get("https://api.spotify.com/v1/albums", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              params: {
                ids: chunk.join(","),
              },
            });
        
            const chunkAlbums = data.albums.map((item) => ({
              id: item.id,
              pop: item.popularity,
              label: item.label,
            }));
            albumIdsAndPopsLabels.push(...chunkAlbums);
        }
       
        const albumIdCountMap = {};
            albumIdsAndPopsLabels.forEach(album => {
            const id = album.id;
            albumIdCountMap[id] = albumIdCountMap[id] ? albumIdCountMap[id] + 1 : 1;
        });

        const sortedAlbumIds = Object.keys(albumIdCountMap).sort((a, b) => {
            if (albumIdCountMap[b] === albumIdCountMap[a]) {
                return albumIdsAndPopsLabels.findIndex(album => album.id === a) - albumIdsAndPopsLabels.findIndex(album => album.id === b);
            } else {
                return albumIdCountMap[b] - albumIdCountMap[a];
            }
        });

        albumCode.push('albumIds[<=10]', sortedAlbumIds.slice(0, 10));



        const {id: mostPopAlbumId} = albumIdsAndPopsLabels.reduce((acc, curr) => {
            return curr.pop > acc.pop ? curr : acc;
        });

        const {id: leastPopAlbumId} = albumIdsAndPopsLabels.reduce((acc, curr) => {
            return curr.pop < acc.pop ? curr : acc;
        });
          
        

        albumCode.push('mostLeastPopAlbumIds[<=2]', mostPopAlbumId, leastPopAlbumId);


        const uniqueAlbumIds = [...new Set(albumIdsAndPopsLabels.map(album => album.id))];
        const totalAlbumPop = uniqueAlbumIds.reduce((sum, id) => {
            const album = albumIdsAndPopsLabels.find(album => album.id === id);
            return sum + album.pop;
        }, 0);

        const avgAlbumPop = totalAlbumPop / uniqueAlbumIds.length;

        const squaredDifferencesAlbumPops = uniqueAlbumIds.reduce((sum, id) => {
            const album = albumIdsAndPopsLabels.find(album => album.id === id);
            const difference = album.pop - avgAlbumPop;
            return sum + (difference * difference);
        }, 0);
        
        const varianceAlbumPops = squaredDifferencesAlbumPops / uniqueAlbumIds.length;
        const albumPopsStdDev = Math.sqrt(varianceAlbumPops);

        albumCode.push('avgAlbumPop[1]', avgAlbumPop.toFixed(2), 'albumPopsStdDev[1]', albumPopsStdDev.toFixed(2));


        const labelCounts = {};
        albumIdsAndPopsLabels.forEach(album => {
            const {label} = album;
            labelCounts[label] = (labelCounts[label] || 0) + 1;
        });
        const sortedLabels = Object.keys(labelCounts).sort((a, b) => {
            return labelCounts[b] - labelCounts[a];
        });
        albumCode.push('topLabelsByAlbums[<=5]', sortedLabels.slice(0, 5));


        return albumCode;
    };


    const generateCode = async () => {
        let code = await me();

        const timeRanges = ['short_term', 'medium_term', 'long_term'];
        for (const timeRange of timeRanges) {
            let songs = await meSongs(timeRange);
            let artists = await meArtists(timeRange);
            code.push(timeRange, songs, artists);
        };
        return code;
    };

    const downloadCode = async () => {
        const blob = new Blob([await generateCode()], {type: 'text/plain'});
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'code.txt';
        link.click();
    };

    const toDataPage = async () => {
        let code = await me();

        const timeRanges = ['short_term', 'medium_term', 'long_term'];
        for (const timeRange of timeRanges) {
            let songs = await meSongs(timeRange);
            let artists = await meArtists(timeRange);
            code.push(timeRange, songs, artists);
        };
        navigate('/data', {state: {data: code.join(','), token: token}});
    };

    const toComparePage = async () => {
        let code = await me();

        const timeRanges = ['short_term', 'medium_term', 'long_term'];
        for (const timeRange of timeRanges) {
            let songs = await meSongs(timeRange);
            let artists = await meArtists(timeRange);
            code.push(timeRange, songs, artists);
        };
        navigate('/compare', {state: {file1: code.join(','), file2: file2}});
    };

    const [file2, setFile2] = useState("");
    

    const addFile2 = event => {
        const fileReader = new FileReader();
        const {files} = event.target;

        fileReader.readAsText(files[0], "UTF-8");
        fileReader.onload = e => {
            const content = e.target.result;
            // console.log(content);
            setFile2(content);
        };
    };

    return (
        <div>
            <button onClick={downloadCode} className="basicBtn" style={{marginTop:'10%'}}>download your code</button>
            <div> 
                <a onClick={()=>{toDataPage()}}><button className='basicBtn'>view your data</button></a>
            </div>
            <div>
                <h4 style={{color:'#aaaaaa'}}>or</h4>
                <h2>compare</h2>
                <input type="file"accept=".txt"  onChange={addFile2}/>
                <a onClick={()=>{toComparePage()}}><button className="submitBtn" disabled={!file2}>submit</button></a>
            </div>
            <Footer/>
        </div>
    )
}

export default Code;