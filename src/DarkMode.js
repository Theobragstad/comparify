

import { useState } from "react";
import Cookies from 'js-cookie';

export const useDarkMode = () => {
  const [darkModeOn, setDarkModeOn] = useState(Cookies.get('darkModeOn') === 'true');

 

  return {
    darkModeOn,
    setDarkModeOn
  };
};
