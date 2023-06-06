import Big from 'big.js';
import React from 'react';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';
import './Data.css';
import './App.css';
import loading from './img/loading.gif'
import { Tooltip as ReactTooltip } from 'react-tooltip'



function Code() {
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [loadingView, setLoadingView] = useState(false);
    const [loadingCompare1, setLoadingCompare1] = useState(false);
    const [loadingCompare2, setLoadingCompare2] = useState(false);


    const [files, setFiles] = useState([]);

    const navigate = useNavigate();


    ////////////


    const isTokenExpired = () => {
        const expirationTime = localStorage.getItem("expirationTime");
        if (!expirationTime) {
          return true;
        }
        return new Date().getTime() > parseInt(expirationTime);
      };
    
      const logout = () => {
    
        setToken("");
        setExpirationTime("");
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("expirationTime");
        navigate('/');
        
      };

    const [expirationTime, setExpirationTime] = useState("");///









    /////////////

    const [token, setToken] = useState('');
   

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


        songCode.push('avgSongAgeYrMo[2]', songAgeYr, songAgeMo, 'songAgeStdDevYrMo[2]', songAgeStdDevYr, songAgeStdDevMo);



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

        // const leastPopArtistId = artistIdsAndPops.reduce((currentPopularArtistId, currentArtist) => {
        //     if (!currentPopularArtistId || currentArtist.pop < artistIdsAndPops.find(album => album.id === currentPopularArtistId).pop) {
        //         return currentArtist.id;
        //     }
        //     return currentPopularArtistId;
        // }, null);

        const {id: leastPopArtistId} = artistIdsAndPops.reduce((acc, curr) => {
            return curr.pop < acc.pop ? curr : acc;
        });

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
        setLoadingDownload(true);
        const blob = new Blob([await generateCode()], {type: 'text/plain'});
        setLoadingDownload(false);

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'code.txt';
        link.click();
    };

    const toDataPage = async () => {
        if (isTokenExpired()) {
            logout();
          }
        else {
        setLoadingView(true);

        let code = await me();

        const timeRanges = ['short_term', 'medium_term', 'long_term'];
        for (const timeRange of timeRanges) {
            let songs = await meSongs(timeRange);
            let artists = await meArtists(timeRange);
            code.push(timeRange, songs, artists);
        };
        setLoadingView(false);

        navigate('/data', {state: {data: code.join(','), token: token}});
    }
    };

    const toComparePage1 = async (number) => {
        setLoadingCompare1(true);
        

        let code = await me();

        const timeRanges = ['short_term', 'medium_term', 'long_term'];
        for (const timeRange of timeRanges) {
            let songs = await meSongs(timeRange);
            let artists = await meArtists(timeRange);
            code.push(timeRange, songs, artists);
        };
        setLoadingCompare1(false);

        navigate('/compare', {state: {file1: code.join(','), file2: file2, token: token}});
    };





    const toComparePage2 = async (number) => {
        setLoadingCompare2(true);
        

        let code = await me();

        const timeRanges = ['short_term', 'medium_term', 'long_term'];
        for (const timeRange of timeRanges) {
            let songs = await meSongs(timeRange);
            let artists = await meArtists(timeRange);
            code.push(timeRange, songs, artists);
        };
        setLoadingCompare2(false);

        navigate('/compare', {state: {file1: file1TwoComp, file2: file2TwoComp, token: token}});
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



    const [file1TwoComp, setFile1TwoComp] = useState("");
    const [file2TwoComp, setFile2TwoComp] = useState("");
    

    const addFile1TwoComp = event => {
        const fileReader = new FileReader();
        const {files} = event.target;

        fileReader.readAsText(files[0], "UTF-8");
        fileReader.onload = e => {
            const content = e.target.result;
            // console.log(content);
            setFile1TwoComp(content);
        };
    };

    const addFile2TwoComp = event => {
        const fileReader = new FileReader();
        const {files} = event.target;

        fileReader.readAsText(files[0], "UTF-8");
        fileReader.onload = e => {
            const content = e.target.result;
            // console.log(content);
            setFile2TwoComp(content);
        };
    };


    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem('token');
        let expirationTime = window.localStorage.getItem("expirationTime");//
    
        if ((!token || !expirationTime) && hash) {
            token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
            let expiresIn = hash.substring(1).split("&").find(elem => elem.startsWith("expires_in")).split("=")[1];//
            expirationTime = new Date().getTime() + parseInt(expiresIn) * 1000; // 
            window.location.hash = '';
            window.localStorage.setItem('token', token);
            window.localStorage.setItem("expirationTime", expirationTime); //
        }
    
        setToken(token);
        setExpirationTime(expirationTime); //  

        if (isTokenExpired()) {
            logout();
          }
    }, [downloadCode, toDataPage, toComparePage1, toComparePage2]);

    return (
        <div>
        <div className='cardOverlay'>
           
            <div className='codeDiv'>
                <button onClick={downloadCode} className="basicBtn" title="Download your code" style={{marginTop:'10vh'}} disabled={loadingDownload}>download your code</button>
                {loadingDownload &&
                    <div className="loadingDots">
                        <div className="loadingDots--dot"></div>
                        <div className="loadingDots--dot"></div>
                        <div className="loadingDots--dot"></div>
                    </div>
                }
            </div>




            <div className='codeDiv '>
                {/* <div className='gradientWrapper'> */}
            <a onClick={()=>{toDataPage()}}><button className='basicBtn' title="View your data" disabled={loadingView} >view your data</button></a>
            {/* </div> */}
                {loadingView &&
                    <div className="loadingDots">
                        <div className="loadingDots--dot"></div>
                        <div className="loadingDots--dot"></div>
                        <div className="loadingDots--dot"></div>
                    </div>
                }
            </div>
            <h4 style={{color:'#aaaaaa'}}>or</h4>
            <div >
               <h2 className="gradient" style={{paddingBottom:'5vh'}}>compare</h2>
               </div>
            <div style={{textAlign:'left',marginLeft:'6vw'}}>
               

            

               
                <input id="uploadOneTooltip" type="file" accept=".txt" onChange={addFile2}/>
                <span className='codeDiv'>
                {/* <a onClick={()=>{toComparePage1()}}><button title="Submit" className="submitBtn" disabled={!file2}>submit</button></a> */}
                {!loadingCompare1 &&
                <a onClick={()=>{toComparePage1()}}><button title="Submit" className="submitBtn" disabled={!file2}>submit</button></a>
                    
                }
                {loadingCompare1 &&
                <a onClick={()=>{toComparePage1()}}><button title="Submit" className="submitBtnWhite" disabled={!file2}>
                <div className="loadingDots">
                <div className="loadingDots--dot"></div>
                <div className="loadingDots--dot"></div>
                <div className="loadingDots--dot"></div>
            </div></button></a>
                
                }
            </span>
            </div>
            {/* <h4 style={{color:'#aaaaaa',paddingTop:'10vh'}}>or</h4> */}
            <div style={{justifyContent: 'center', alignItems: 'center', textAlign: 'left', marginLeft: '6vw', paddingTop: '10vh'}}>
            
                <input type="file" id='uploadTwoTooltip1' accept=".txt" onChange={addFile1TwoComp}/>
                <input type="file" id='uploadTwoTooltip2' accept=".txt" onChange={addFile2TwoComp}/>
                {!loadingCompare2 &&
                <a onClick={()=>{toComparePage2()}}><button className="submitBtn" disabled={!file1TwoComp  || !file2TwoComp}>submit</button></a>

                }
                {loadingCompare2 &&
                <a onClick={()=>{toComparePage2()}}><button className="submitBtnWhite" disabled={!file1TwoComp  || !file2TwoComp}>
                    <span className="loadingDots">
                        <div className="loadingDots--dot"></div>
                        <div className="loadingDots--dot"></div>
                        <div className="loadingDots--dot"></div>
                    </span>
                    </button></a>

                }

                {/* {true &&
                    <div className="loadingDots">
                        <div className="loadingDots--dot"></div>
                        <div className="loadingDots--dot"></div>
                        <div className="loadingDots--dot"></div>
                    </div>
                } */}
            </div>
            <ReactTooltip
        anchorSelect="#uploadOneTooltip"
        html={"upload the code for the user you want to compare with"}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2'}}
        clickable={'true'}>
      </ReactTooltip>

      <ReactTooltip
        anchorSelect="#uploadTwoTooltip1"
        html={"upload the code for the first user you want to compare with"}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2'}}
        clickable={'true'}>
      </ReactTooltip>

      <ReactTooltip
        anchorSelect="#uploadTwoTooltip2"
        html={"upload the code for the second user you want to compare with"}
        style={{backgroundColor:'#656565',color:'white',fontSize:12,pointerEvents: 'auto !important',fontWeight:'bold',borderRadius:'25px',zIndex:'2'}}
        clickable={'true'}>
      </ReactTooltip>
      

      </div>
      <Footer/>
    </div>
      

    )
}

export default Code;