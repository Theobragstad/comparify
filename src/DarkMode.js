//  const [darkModeOn, setDarkModeOn] = useState(Cookies.get('darkModeOn') === 'true');




// useEffect(() => {
//   // Perform actions when darkModeOn changes
//   // This code will run whenever darkModeOn changes
//   console.log('darkModeOn changed:', darkModeOn);

//   // Update other variables or trigger rerendering logic here
//   // ...

// }, [darkModeOn]);

// import { useState } from "react";
// import Cookies from 'js-cookie';


// export const useDarkMode = () => {
// const [darkModeOn, setDarkModeOn] = useState(Cookies.get('darkModeOn') === 'true');

  

//   return {
//     darkModeOn,
//     setDarkModeOn
//   };
// };


import { useState } from "react";
import Cookies from 'js-cookie';

export const useDarkMode = () => {
  const [darkModeOn, setDarkModeOn] = useState(Cookies.get('darkModeOn') === 'true');

 

  return {
    darkModeOn,
    setDarkModeOn
  };
};
