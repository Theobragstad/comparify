useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    let expirationTime = window.localStorage.getItem("expirationTime");


    

    // if (!token && hash) {
      if ((!token || !expirationTime) && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];
        let expiresIn = hash.substring(1).split("&").find(elem => elem.startsWith("expires_in")).split("=")[1];//
        expirationTime = new Date().getTime() + parseInt(expiresIn) * 1000; // 

        window.location.hash = "";
        window.localStorage.setItem("token", token); 
        
        window.localStorage.setItem("expirationTime", expirationTime); //
    }

    setToken(token);  
    setExpirationTime(expirationTime); //    

    // if (isTokenExpired()) {
    //   logout();
    // }
    
}, []);