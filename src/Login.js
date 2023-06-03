import React, {useEffect, useState, useRef} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import Footer from './Footer';


function Login() {
    const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f";
    const REDIRECT_URI = "http://localhost:3000/code";

    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPES = "user-top-read";

    const [token, setToken] = useState("");

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



    const navigate = useNavigate();
    const toComparePage = async () => {
        navigate('/compare', {state: {file1: file1, file2: file2}});
    };

    const [file1, setFile1] = useState("");
    

    const addFile1 = event => {
        const fileReader = new FileReader();
        const {files} = event.target;

        fileReader.readAsText(files[0], "UTF-8");
        fileReader.onload = e => {
            const content = e.target.result;
            // console.log(content);
            setFile1(content);
        };
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

    // console.log(file1);
    // console.log(file2);

    return (
        <div>

            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>
                <button className="getCodeBtn">get your code</button>
            </a>
            <h4 style={{color:'#aaaaaa'}}>or</h4>
            <h2>compare</h2>
            <div>
                <input type="file" accept=".txt" onChange={addFile1}/>
                <input type="file" accept=".txt" onChange={addFile2}/>
                <a onClick={()=>{toComparePage()}}><button className="submitBtn" disabled={!file1  || !file2}>submit</button></a>

            </div>
            
            <Footer/>
        </div>
    )
}

export default Login;