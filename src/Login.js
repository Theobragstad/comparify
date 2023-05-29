import React from 'react';

import {useEffect, useState, useRef} from 'react';
import {Link} from 'react-router-dom';

import axios from 'axios';


function Login() {
    const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f"
    const REDIRECT_URI = "http://localhost:3000/getcode" 
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPES = "user-top-read user-follow-read"

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

    const [searchKey, setSearchKey] = useState("")
    const [artists, setArtists] = useState([])

    const searchArtists = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/search", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                q: searchKey,
                type: "artist"
            }
        })
    
        setArtists(data.artists.items)
    }

    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.id}>
                {artist.images.length ? <img width={"100%"} src={artist.images[0].url} alt=""/> : <div>No Image</div>}
                {artist.name}
            </div>
        ))
    }


    const [tracks, setTracks] = useState([])

    const getTopTracks = async (e) => {
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                time_range: "medium_term",
                limit: 10
            }
        })
    
        setTracks(data.items)
    }

    const renderTopTracks = () => {
        // localStorage.setItem("token1", token);
        return tracks.map(track => (
            <div align="left" key={track.id}>
                <img src={track.album.images[0].url} style={{width: 50}}></img>
                {track.artists[0].name}-{track.name}
            </div>
        ))
    }

    // const [file, setFile] = useState();
    // const [numFiles, setNumFiles] = useState(0);


    // const handleChange = (e) => {
    //     setFile(e.target.files[0]);
    //     setNumFiles(numFiles + 1);
    // }

    // const getNumFiles = () => {
    //     return numFiles;
    //   }

    const [files, setFiles] = useState([]);

    const handleUpload = (e) => {
      setFiles([...files, e.target.files]);
    //   console.log(e.target.files);
    
    };
      

    return (
        <div>
            {/* <Link to="/text"> */}
                {/* <div style={{"padding-top":100}}>
                    <div className="getCodeButton">
                        <button className="pushableGetCodeButton">
                            <span className="frontGetCodeButton">
                                Get code
                            </span>
                        </button>
                    </div>
                </div> */}



                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>
                <div style={{"paddingTop":300}}>

                <button className="codeBtn">
                    get code
                </button>
                </div>
                </a>

            {/* </Link> */}

            {/* <Link to="/getcode">
            <button className="codeBtn">
                    get code
                </button>
            </Link> */}
  
            <h4 className="">or</h4>
            <div>
      <input type="file" onChange={handleUpload}/>
      <input type="file" onChange={handleUpload} />
      <button className="submitBtn" disabled={files.length !== 2}>compare</button>
    </div>
            {/* <div>
                <input type="file" onChange={handleChange} />
                <button onClick={() => {
                    console.log(file);
                    console.log(getNumFiles());
                }}>Upload
                </button>
            </div>
            <div>
                <input type="file" onChange={handleChange} />
                <button onClick={() => {
                    console.log(file);
                    console.log(getNumFiles())
                }}>Upload
                </button>
            </div> */}

            {/* <div className="login-buttons">
                {(true) ?
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>
                    <div className="login-button-active-1">
                        <button className="pushable-one">
                            <span className="front-one"></span>
                        </button>
                    </div>
                </a> 
                : 
                <div className="login-button-inactive">
                    <button className="pushable-one">
                        <span className="front-one"></span>
                    </button>
                </div>}
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>
                    <div className="login-button-active-2">
                        <button className="pushable-two">
                            <span className="front-two"></span>
                        </button>
                    </div>
                </a>
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>
                    <div className="login-button-active-3">
                        <button className="pushable-three">
                            <span className="front-three"></span>
                        </button>
                    </div>
                </a>
                <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>
                    <div className="login-button-active-4">
                        <button className="pushable-four">
                            <span className="front-four"></span>
                        </button>
                    </div>
                </a>
            </div> */}
            
            

            {/* {token &&
                <React.Fragment>
                    <button onClick={logout}>Logout</button>
                    <br></br>
                    <br></br>
                    <button onClick={getTopTracks}>Show top tracks</button>
                    {renderTopTracks()}
                </React.Fragment>
            } */}

            
            {/* <br></br>
            <br></br>
            <form onSubmit={searchArtists}>
                <input type="text" onChange={e => setSearchKey(e.target.value)}/>
                <button type={"submit"}>Search</button>
            </form>
            {renderArtists()} */}
        </div>
    )
}

export default Login