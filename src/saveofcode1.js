import Big from 'big.js';
import React from 'react';
import {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';



function Getcode() {
    const [token, setToken] = useState("")
    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")
    
        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
    
            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }
    
        setToken(token)
    
    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const [files, setFiles] = useState([]);

    const handleUpload = (e) => {
      setFiles([...files, e.target.files]);
    };

   
  
    var trackData = {
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
 
    var arrayStats = {
        mean: function(array) {
            return arrayStats.sum(array) / array.length;
        },
       
        standardDeviation: function(array) {
		    return Math.sqrt(arrayStats.variance(array));
	    },
        
        variance: function(array) {
            var mean = arrayStats.mean(array);
            return arrayStats.mean(array.map(function(num) {
                return Math.pow(num - mean, 2);
            }));
        },
        sum: function(array) {
            var num = 0;
            for (var i = 0, l = array.length; i < l; i++) num += array[i];
            return num;
        },
    };
    arrayStats.average = arrayStats.mean;



    const msToMinSec = (ms) => {
        const durationMinutes = Math.floor(ms / 60000);
        const durationSeconds = ((ms % 60000) / 1000).toFixed(0);
        return`${durationMinutes}:${durationSeconds.padStart(2, '0')}`;
    }

    const calculateStats = (start, end) => {
        let stats = [];
        for(let array in trackData) {
            const arrayData = trackData[array].slice(start, end + 1); 
            if(array == 'duration_ms') {
                stats.push([msToMinSec(arrayStats.mean(arrayData)), msToMinSec(arrayStats.standardDeviation(arrayData))]);
            }
            else {
            stats.push([arrayStats.mean(arrayData), arrayStats.standardDeviation(arrayData)]);
            }
        }

        return stats;
    }

    function convertMillisecondsToYears(milliseconds) {
        const millisecondsInYear = 365.25 * 24 * 60 * 60 * 1000; 
      
        const years = milliseconds / millisecondsInYear;
      
        const roundedYears = Math.round(years * 100) / 100;
      
        return roundedYears;
      }



    const getTopItems = async (time_ranges) => {
        const allIds = [];
        const allAlbumIds = [];
        const avgTrackPopularities = [];
        const pctExplicit = [];
        const avgSongAges = [];
        const mostListenedToLabels = [];
        const avgAlbumPopularities = [];
        const maxMinTrackPops = [];
        const allOldestTrackIds = [];
        const allNewestTrackIds = [];
        const mostPopAlbums = [];
        const leastPopAlbums = [];
        const songReleaseDateStandardDeviations = [];


        
        for (const time_range of time_ranges) {
            const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    time_range: time_range,
                    limit: 50
                }
            });

            


            const ids = data.items.map(item => item.id);
            allIds.push(...ids);



            const popularities = data.items.map(item => item.popularity);

            const sum = popularities.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const mean = sum / popularities.length;
            avgTrackPopularities.push(mean);

       
            const songPops = data.items.map(item => ({
                id: item.id,
                pop: item.popularity
              }))
              const mostPopSong = songPops.reduce((currentPopularSongId, currentSong) => {
                if (!currentPopularSongId || currentSong.pop > songPops.find(album => album.id === currentPopularSongId).pop) {
                  return currentSong.id;
                }
                return currentPopularSongId;
              }, null);

              const leastPopSong = songPops.reduce((currentPopularSongId, currentSong) => {
                if (!currentPopularSongId || currentSong.pop < songPops.find(album => album.id === currentPopularSongId).pop) {
                  return currentSong.id;
                }
                return currentPopularSongId;
              }, null);

            
            maxMinTrackPops.push([mostPopSong, leastPopSong]);




            const explicitBooleans = data.items.map(item => item.explicit);
            const countTrue = explicitBooleans.reduce((count, value) => count + (value ? 1 : 0), 0);
            const percentTrue = (countTrue / explicitBooleans.length) * 100;
            pctExplicit.push(percentTrue);

     



            const albumIds = data.items.map(item => item.album.id);
            const idCount = {};

            albumIds.forEach(albumId => {
                idCount[albumId] = (idCount[albumId] || 0) + 1;
            });

            const uniqueAlbumIds = Array.from(new Set(albumIds));
            const sortedAlbumIds = uniqueAlbumIds.sort((a, b) => idCount[b] - idCount[a]);

            const newAlbumIds = sortedAlbumIds.length === 1 ? albumIds : albumIds.filter(albumId => !allAlbumIds.includes(albumId));

            const cleanedAlbumIds = sortedAlbumIds.length > 10 ? sortedAlbumIds.slice(0, 10) : newAlbumIds.slice(0, 10);

            allAlbumIds.push(...cleanedAlbumIds);


 
            const labelData = await axios.get("https://api.spotify.com/v1/albums", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    ids: cleanedAlbumIds.join(",")
                }
            });



            const albumPops = labelData.data.albums.map(album => ({
                id: album.id,
                pop: album.popularity
              }))
              const mostPopularAlbum = albumPops.reduce((currentPopularAlbumId, currentAlbum) => {
                if (!currentPopularAlbumId || currentAlbum.pop > albumPops.find(album => album.id === currentPopularAlbumId).pop) {
                  return currentAlbum.id;
                }
                return currentPopularAlbumId;
              }, null);

              const leastPopularAlbum = albumPops.reduce((currentPopularAlbumId, currentAlbum) => {
                if (!currentPopularAlbumId || currentAlbum.pop < albumPops.find(album => album.id === currentPopularAlbumId).pop) {
                  return currentAlbum.id;
                }
                return currentPopularAlbumId;
              }, null);

            mostPopAlbums.push(mostPopularAlbum);
            leastPopAlbums.push(leastPopularAlbum);

            const albumPopSum = albumPops.reduce((sum, album) => sum + album.pop, 0);
            const albumPopMean = albumPopSum / albumPops.length;
            avgAlbumPopularities.push(albumPopMean);




            const labels = labelData.data.albums.map(album => album.label);
            const labelCounts = labels.reduce((counts, label) => {
                counts[label] = (counts[label] || 0) + 1;
                return counts;
              }, {});
              
              const sortedLabels = Object.keys(labelCounts).sort((a, b) => labelCounts[b] - labelCounts[a]);
              
              const mostFrequentLabels = sortedLabels.slice(0, 5);
              
              mostListenedToLabels.push(...mostFrequentLabels);

            const releaseYearsData = await axios.get("https://api.spotify.com/v1/tracks", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    ids: ids.join(",")
                }
            });

            const releaseDates = releaseYearsData.data.tracks.map(track => ({
                id: track.id,
                releaseDate: track.album.release_date
              })).filter(track => track.releaseDate !== '0000');



              const timestamps = releaseDates.map(date => Date.parse(date.releaseDate));

const meann = timestamps.reduce((sum, timestamp) => sum + timestamp, 0) / timestamps.length;

const sumSquaredDiff = timestamps.reduce((sum, timestamp) => sum + Math.pow(timestamp - meann, 2), 0);

const variance = sumSquaredDiff / timestamps.length;

const standardDeviation = Math.sqrt(variance);
songReleaseDateStandardDeviations.push(convertMillisecondsToYears(standardDeviation));



console.log("Standard Deviation:", standardDeviation);
              
              
              const today = new Date().toISOString().split('T')[0];
              
              let oldestDate = null;
              let newestDate = null;
              let oldestIds = [];
              let newestIds = [];
              
              releaseDates.forEach(track => {
                const { id, releaseDate } = track;
              
                if (oldestDate === null || releaseDate < oldestDate) {
                  oldestDate = releaseDate;
                  oldestIds = [id];
                } else if (releaseDate === oldestDate) {
                  oldestIds.push(id);
                }
              
                if (newestDate === null || releaseDate > newestDate) {
                  newestDate = releaseDate;
                  newestIds = [id];
                } else if (releaseDate === newestDate) {
                  newestIds.push(id);
                }
              });

              const earliestOldestTrack = releaseYearsData.data.tracks.find(track => track.id === oldestIds[0]);
                const earliestNewestTrack = releaseYearsData.data.tracks.find(track => track.id === newestIds[0]);

              allOldestTrackIds.push(earliestOldestTrack.id);
              allNewestTrackIds.push(earliestNewestTrack.id);
              
      
              

              
            const releaseYears = releaseYearsData.data.tracks.map(track => parseInt(track.album.release_date.split("-")[0])).filter(year => year !== 0);
            
            const sumReleaseYears = releaseYears.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const meanReleaseYear = sumReleaseYears / releaseYears.length;
           
            const currentDate = new Date();


            const releaseYear = Math.floor(meanReleaseYear);
            const releaseMonth = Math.floor((meanReleaseYear - releaseYear) * 12);

            let ageInYears = currentDate.getFullYear() - releaseYear;
            let ageInMonths = currentDate.getMonth() + 1 - releaseMonth;

            if (ageInMonths < 0) {
            ageInYears--;
            ageInMonths += 12;
            }

            avgSongAges.push(ageInYears + '-' + ageInMonths)


        }

   

        const batchSize = 100;
const allAudioFeatureData = [];

const batches = [];
for (let i = 0; i < allIds.length; i += batchSize) {
  batches.push(allIds.slice(i, i + batchSize));
}

for (const batch of batches) {
  const audioFeaturesResponse = await axios.get("https://api.spotify.com/v1/audio-features", {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      ids: batch.join(",")
    }
  });

  const audioFeatures = audioFeaturesResponse.data.audio_features;
  allAudioFeatureData.push(...audioFeatures);












  for (const feature in trackData) {
    trackData[feature] = [...(trackData[feature] || []), ...audioFeatures.map(track => track[feature])];
  }
}






function analyzeAudioFeatures(data, chunkSize) {
    const resultArrays = [];
  
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      chunks.push(chunk);
    }
  
    chunks.forEach(chunk => {
      const result = {};
  
      chunk.forEach(feature => {
        Object.keys(feature).forEach(property => {
          if (typeof feature[property] === 'number' &&
          property !== 'mode' &&
          property !== 'time_signature') {
            if (property === 'duration_ms') {
                const durationMinutes = Math.floor(feature[property] / 60000);
                const durationSeconds = ((feature[property] % 60000) / 1000).toFixed(0);
                feature['duration_min_sec'] = `${durationMinutes}:${durationSeconds.padStart(2, '0')}`;
                delete feature[property];
                property = 'duration_min_sec'; 
              }
    
              if (!result[property]) {
                result[property] = {
                  minSongId: feature.id,
                  minVal: feature[property],
                  maxSongId: feature.id,
                  maxVal: feature[property],
                };
              } else {
                if (feature[property] < result[property].minVal) {
                  result[property].minSongId = feature.id;
                  result[property].minVal = feature[property];
                } else if (feature[property] === result[property].minVal) {
                  const currentMinId = parseInt(result[property].minSongId.split(':')[2]);
                  const newMinId = parseInt(feature.id.split(':')[2]);
                  if (newMinId < currentMinId) {
                    result[property].minSongId = feature.id;
                  }
                }
    
                if (feature[property] > result[property].maxVal) {
                  result[property].maxSongId = feature.id;
                  result[property].maxVal = feature[property];
                } else if (feature[property] === result[property].maxVal) {
                  const currentMaxId = parseInt(result[property].maxSongId.split(':')[2]);
                  const newMaxId = parseInt(feature.id.split(':')[2]);
                  if (newMaxId < currentMaxId) {
                    result[property].maxSongId = feature.id;
                  }
                }
              }
            }
          });
        });
  
      resultArrays.push(result);
    });
  
    return resultArrays;
  }

  const chunkSize = 50;
  const resultArrays = analyzeAudioFeatures(allAudioFeatureData, chunkSize);
  


const minMaxAudioFeatures = [];
resultArrays.forEach((result, index) => {
  Object.entries(result)
    .sort(([featureA], [featureB]) => featureA.localeCompare(featureB)) 
    .forEach(([feature, values]) => {
      minMaxAudioFeatures.push([feature, values.maxSongId, values.minSongId]);
    });
});

minMaxAudioFeatures.sort(([featureA], [featureB]) => featureA.localeCompare(featureB));


        let statsST = calculateStats(0,49);
        let statsMT = calculateStats(50,99);
        let statsLT = calculateStats(100,149);
        
        
    


        const artists = [];
        const avgArtistPopularities = [];
        const allGenres = [];
        const avgArtistFollowers = [];
        const mostPopArtists = [];
        const leastPopArtists = [];
        
        
        for (const time_range of time_ranges) {
            const { data } = await axios.get("https://api.spotify.com/v1/me/top/artists", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    time_range: time_range,
                    limit: 50
                }
            });

            const artistPops = data.items.map(item => ({
                id: item.id,
                pop: item.popularity
              }))
              const mostPopularArtist = artistPops.reduce((currentPopularArtistId, currentArtist) => {
                if (!currentPopularArtistId || currentArtist.pop > artistPops.find(artist => artist.id === currentPopularArtistId).pop) {
                  return currentArtist.id;
                }
                return currentPopularArtistId;
              }, null);

              const leastPopularArtist = artistPops.reduce((currentLeastPopularArtistId, currentArtist) => {
                if (!currentLeastPopularArtistId || currentArtist.pop < artistPops.find(artist => artist.id === currentLeastPopularArtistId).pop) {
                  return currentArtist.id;
                }
                return currentLeastPopularArtistId;
              }, null);
            mostPopArtists.push(mostPopularArtist);
            leastPopArtists.push(leastPopularArtist);

            

            const artistIds = data.items.map(item => item.id);
            artists.push(...artistIds);

            const genres = data.items.map(item => item.genres);
            const uniqueGenres = [...new Set(genres.flat())];
            allGenres.push(uniqueGenres.length, ...uniqueGenres);


            const artistPopularities = data.items.map(item => item.popularity);
            const sum = artistPopularities.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const mean = sum / artistPopularities.length;
            avgArtistPopularities.push(mean);



            const followersData = await axios.get("https://api.spotify.com/v1/artists", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    ids: artistIds.join(",")
                }
            });

            const artistFollowers = followersData.data.artists.map(artist => parseInt(artist.followers.total));
           
            const artistFollowersSum = artistFollowers.reduce((accumulator, currentValue) => {
                return new Big(accumulator).plus(currentValue);
              }, new Big(0));
              
              const meanArtistFollowers = artistFollowersSum.div(artistFollowers.length);
              
            avgArtistFollowers.push(meanArtistFollowers);
        }

       

        const userData = await axios.get("https://api.spotify.com/v1/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {

                }
        });
        const userInfo = [userData.data.display_name, userData.data.id];




        function combineArrays(labels, ...arrays) {
            const combinedArray = labels.map((label, index) => [label, arrays[index]]);
            return combinedArray;
          }
          
          
          const labels = ['userInfo',
          'songIds','avgSongPops','avgSongAges', 'pctExplicit', 'maxMinSongPops', 'oldestSongIds', 'newestSongIds',
            'artistIds', 'avgArtistPops', 'avgArtistFollowers','mostPopArtists','leastPopArtists',
            'albumIds','avgAlbumPops','mostPopAlbums','leastPopAlbums',
            'genreIds',
            'labelNames',
                'statsST','statsMT','statsLT','minMaxAudioFeatureSongIds', 'songReleaseDateStandardDeviations'];
          
          const combinedArray = combineArrays(labels, userInfo, 
            allIds,  avgTrackPopularities, avgSongAges,pctExplicit, maxMinTrackPops, allOldestTrackIds, allNewestTrackIds, 
            artists, avgArtistPopularities, avgArtistFollowers, mostPopArtists, leastPopArtists,
            allAlbumIds, avgAlbumPopularities, mostPopAlbums, leastPopAlbums, 
            allGenres, 
            mostListenedToLabels, 
            statsST, statsMT, statsLT, minMaxAudioFeatures, songReleaseDateStandardDeviations);
       

            
            

            
            
            
            


            



            
        


        
       
        return combinedArray;
    };





    

    const generateCode = async () => {
        const timeRanges = ['short_term', 'medium_term', 'long_term'];
        let code = await getTopItems(timeRanges);
        createTextFile(code);
    };
  
    const createTextFile = (codeText) => {
        const blob = new Blob([codeText], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "code.txt";
        link.click();
    };

   
  
 const navigate = useNavigate();

    const toDataPage= async ()=>{
        const timeRanges = ['short_term', 'medium_term', 'long_term'];
        let code = await getTopItems(timeRanges);
        console.log(code)

  navigate('/data',{state:{data: code.join(',')}});
    }
  return (
    <div>
      <button onClick={generateCode} className="downloadCodeBtn">Download your code</button>
      <div> 
        <a onClick={()=>{toDataPage()}}><button className='viewBtn'>View your data</button></a>
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

export default Getcode;