import React, {useEffect, useState, useRef} from 'react';
import Footer from './Footer';


function Login() {
    const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f";
    // const REDIRECT_URI = "http://localhost:3000/getcode";
    const REDIRECT_URI = "http://localhost:3000/code";

    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPES = "user-top-read";

    const [token, setToken] = useState("");
    const [files, setFiles] = useState([]);


    useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
            window.location.hash = "";
            window.localStorage.setItem("token", token);
        }

        setToken(token);
    }, []);

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
    };

    const handleUpload = (e) => {
        setFiles([...files, e.target.files]);    
    };

    return (
        <div>
            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>
                <button className="getCodeBtn">Get code</button>
            </a>
            <h4 style={{color:'#aaaaaa'}}>or</h4>
            <h2>compare</h2>
            <div>
                <input type="file" onChange={handleUpload}/>
                <input type="file" onChange={handleUpload}/>
                <button className="submitBtn" disabled={files.length !== 2}>submit</button>
            </div>
            <Footer/>
        </div>
    )
}

export default Login;