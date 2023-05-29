import React from 'react';

import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';


// import axios from 'axios';

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
    

// function Dashboard() {
    
//     const [token, setToken] = useState("")
//     useEffect(() => {
//         const hash = window.location.hash
//         let token = window.localStorage.getItem("token")
    
//         if (!token && hash) {
//             token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
    
//             window.location.hash = ""
//             window.localStorage.setItem("token", token)
//         }
    
//         setToken(token)
    
//     }, [])

//     const logout = () => {
//         setToken("")
//         window.localStorage.removeItem("token")
//     }

//     const [tracks, setTracks] = useState([])

//     const getTopTracks = async (e) => {
//         e.preventDefault()
//         const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             },
//             params: {
//                 time_range: "medium_term",
//                 limit: 10
//             }
//         })
    
//         setTracks(data.items)
//     }

//     const renderTopTracks = () => {
        
//         return tracks.map(track => (
//             <div align="left" key={track.id}>
//                 <img src={track.album.images[0].url} style={{width: 50}}></img>
//                 {track.artists[0].name}-{track.name}
//             </div>
//         ))
//     }
    
//     return (
//         <div>
//             <h4>Dashboard</h4>
//             {token &&
//                 <React.Fragment>
//                     <Link to="/login">
//                         <button onClick={logout}>Logout</button>
//                     </Link>
//                     <br></br>
//                     <br></br>
//                     <button onClick={getTopTracks}>Show top tracks</button>
//                     {renderTopTracks()}
//                 </React.Fragment>
//             }
            
            
//         </div>
//     )
// }

// export default Dashboard



// import React, { useState } from "react";

const Text = () => {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "my-file.txt";
    link.click();
  };

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={handleChange}
      />
      <button onClick={handleSubmit}>Download</button>
    </div>
  );
};

export default Text;
