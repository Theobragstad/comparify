import React from 'react';

import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';



import axios from 'axios';

// // class Dashboard extends React.Component {
// //     componentDidMount() {
// //         // console.log("Component has been rendered");
        
// //     }
    
// //     render() {
// //       return (
// //         <div>
// //             <h4>Dashboard</h4>
// //         </div>
// //       )
// //      }
// //    }
    

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
    //   console.log(e.target.files);
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
        mode: [],
        speechiness: [],
        tempo: [],
        time_signature: [],
        valence: []
    };
 
    var arrayStats = {
        mean: function(array) {
            return arrayStats.sum(array) / array.length;
        },
        median: function(array) {
            array.sort(function(a, b) {
                return a - b;
            });
            var mid = array.length / 2;
            return mid % 1 ? array[mid - 0.5] : (array[mid - 1] + array[mid]) / 2;
	    },
        modes: function(array) {
            if (!array.length) return [];
            var modeMap = {},
                maxCount = 0,
                modes = [];

            array.forEach(function(val) {
                if (!modeMap[val]) modeMap[val] = 1;
                else modeMap[val]++;

                if (modeMap[val] > maxCount) {
                    modes = [val];
                    maxCount = modeMap[val];
                }
                else if (modeMap[val] === maxCount) {
                    modes.push(val);
                    maxCount = modeMap[val];
                }
            });
            return modes[0];
	    },
        range: function(array) {
            return arrayStats.max(array) - arrayStats.min(array);
        },
        standardDeviation: function(array) {
		    return Math.sqrt(arrayStats.variance(array));
	    },
        max: function(array) {
            return Math.max.apply(null, array);
        },
        min: function(array) {
            return Math.min.apply(null, array);
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

    const calculateStats = (start, end) => {
        let stats = [];
        for(let array in trackData) {
        //     let thisRowStats = [];
        //     const arrayStatsKeys = Object.keys(arrayStats);
        //     for (let i = 0; i < arrayStatsKeys.length; i++) {
        //         const stat = arrayStatsKeys[i];
        //         if (i < arrayStatsKeys.length - 4) {
        //             thisRowStats.push(arrayStats[stat](trackData[array]));
        //         }
        //     }
            let thisRowStats = [];
            const arrayData = trackData[array].slice(start, end + 1); 
            const arrayStatsKeys = Object.keys(arrayStats);

            for (let i = 0; i < arrayStatsKeys.length; i++) {
                const stat = arrayStatsKeys[i];
                if (i < arrayStatsKeys.length - 4) {
                    thisRowStats.push(arrayStats[stat](arrayData));
                }
            }
            stats.push(thisRowStats);
        }

        //console.log(stats);  
        return stats;
    }



    // const [tracks, setTracks] = useState([]);
    // const [stats, setStats] = useState([]);


    const getTopTracksAndStats = async (time_ranges) => {
        // WE NEED TO AUTO REDUCE LIMIT IF ERROR
        const allIds = [];
        
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




    //         let limit = 50; // Initial limit

    // while (limit > 0) {
    //     try {
    //         const { data } = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             },
    //             params: {
    //                 time_range: time_range,
    //                 limit: limit
    //             }
    //         });

    //         const ids = data.items.map(item => item.id);
    //         allIds.push(...ids);

    //         break; // Exit the loop if a response is received

    //     } catch (error) {
    //         // Reduce the limit and retry the request
    //         limit--;

    //         if (limit === 0) {
    //             console.error("Error. This account does not have enough listening data to generate a code.");
    //             // Handle the error condition appropriately
    //             // return;
    //             break;
    //         }
    //     }
    // }
        }

        // const audioFeaturesResponse = await axios.get("https://api.spotify.com/v1/audio-features", {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     },
        //     params: {
        //         ids: allIds.join(",")
        //     }
        // });

        // const audioFeatures = audioFeaturesResponse.data.audio_features;
    

        // for (const feature in trackData) {
        //     trackData[feature] = audioFeatures.map(track => track[feature]);
        // }

        const batchSize = 100; // Maximum number of songs per request


// Split the song IDs into batches
const batches = [];
for (let i = 0; i < allIds.length; i += batchSize) {
  batches.push(allIds.slice(i, i + batchSize));
}

// Process each batch of song IDs
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

  for (const feature in trackData) {
    trackData[feature] = [...(trackData[feature] || []), ...audioFeatures.map(track => track[feature])];
  }
}
    

        let statsST = calculateStats(0,49);
        let statsMT = calculateStats(50,99);
        let statsLT = calculateStats(100,149);
        
        
    


        const artists = [];
        
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

            const artistIds = data.items.map(item => item.id);
            artists.push(...artistIds);
        }

        // console.log(artists);

        
        return [allIds, statsST, statsMT, statsLT];
        // return allIds;
    };






    
    // const [code, setCode] = useState("");

    const generateCode = async () => {
        const timeRanges = ['short_term', 'medium_term', 'long_term'];
        let tracks = await getTopTracksAndStats(timeRanges);
        // setCode("heeee");
        createTextFile(tracks);
    };
  
    const createTextFile = (codeText) => {
        const blob = new Blob([codeText], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "comparifyCode.txt";
        link.click();
    };

   











    return (
        <div>
            <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
            <h4>download your code:</h4>
            <button onClick={generateCode} className="codeBtn">
                    download
            </button>
            {/* {token &&
                <React.Fragment>
                    <Link to="/login">
                        <button onClick={logout}>Logout</button>
                    </Link>
                    <br></br>
                    <br></br>
                    <button onClick={getTopTracks}>Show top tracks</button>
                    {renderTopTracks()}
                </React.Fragment>
            } */}
        
        <div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
            <h4>or upload a code to compare now:</h4>
            <input type="file" onChange={handleUpload}/>
            <button className="submitBtn" disabled={files.length !== 1}>compare</button>
        </div>


        <button className="submitBtn" onClick={calculateStats}>stats</button>
            
        </div>

       
    )
}

export default Getcode



// import React, { useState } from "react";

// const Text = () => {
//   const [text, setText] = useState("");

//   const handleChange = (e) => {
//     setText(e.target.value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const blob = new Blob([text], { type: "text/plain" });
//     const link = document.createElement("a");
//     link.href = window.URL.createObjectURL(blob);
//     link.download = "my-file.txt";
//     link.click();
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={text}
//         onChange={handleChange}
//       />
//       <button onClick={handleSubmit}>Download</button>
//     </div>
//   );
// };

// export default Text;
