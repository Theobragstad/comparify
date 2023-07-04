import React, { useEffect, useState } from 'react';
import html2canvas from "html2canvas";

// import logo from "./img/logo.png";
import logo from "./img/logoAlt.png";




// export const getPlaylistCoverImageURL = ()=> {
//     const div = document.getElementById("imgDiv");
//     if (div) {
//       html2canvas(div, {}).then((canvas) => {
//         const image = canvas.toDataURL("image/jpeg");
//         console.log(image);
//         return image;
//         // var fileName =
//         //   "image.jpeg";
//         //   var anchorElement = document.createElement("a");
//         //   anchorElement.href = image;
//         //   anchorElement.download = fileName;
      
//         //   anchorElement.click();
//       });
//     }
//   }

export const getPlaylistCoverImageURL = async (type) => {
    try {
        let id = (type === "safe") ? "safeCover" : "exploratoryCover"
      const div = document.getElementById(id);
      if (div) {
        const canvas = await html2canvas(div, {});
        const image = canvas.toDataURL("image/jpeg");
        return image;
      }
    } catch (error) {
      console.error(error);
    }
  };

const PlaylistCoverGenerator = (props) => {


  const [fontSize, setFontSize] = useState(24);
  const display_name = props.display_name;

  useEffect(() => {
    const calculateFontSize = () => {
      const containerWidth = 130; // Width of the container for the name
      const nameLength = display_name.length;
      let adjustedFontSize = Math.max(24 - (nameLength - 8), 14); // Adjust this expression to control the font size range
      setFontSize(adjustedFontSize);
    };

    calculateFontSize();
  }, [display_name]);

  const getFormattedName = () => {
    if (display_name.length > 30) {
      return display_name.substring(0, 30) + "...'s"; // Cut off name after 35 characters and add ellipsis
    }
    return display_name + "'s";
  };



  

  return (
    <>
    <div style={{width: "0", height: "0", overflow: "hidden"}}>
    <div id="safeCover" style={{ width: '300px', height: '300px', backgroundColor: 'white', textAlign: 'center', position: 'relative' }}  onClick={getPlaylistCoverImageURL}>
      <div style={{ position: 'relative', top: '15%' }}>
        <img src={logo} style={{ height: '65px' }} alt="Logo" />
      </div>
      <div style={{ fontWeight: 'bold', position: 'absolute', top: '50%', bottom: '50%', left: '50%', transform: 'translateX(-50%)', maxWidth: '130px', wordWrap: 'break-word' }}>
        <span style={{ fontSize: `${fontSize}px` }}>{getFormattedName()}</span><br></br><span style={{ fontSize: '16px' }}>mix</span>
      </div>
      <div className="timeRange" style={{ position: 'absolute', bottom: '10%', transform: 'translateX(-50%)', left: '50%' }}>
        <span>{props.selectedTimeRange}</span>
      </div>
    </div>
    </div>

     <div style={{width: "0", height: "0", overflow: "hidden"}}>
    <div id="exploratoryCover" style={{ width: '300px', height: '300px', backgroundColor: 'white', textAlign: 'center', position: 'relative' }}  onClick={getPlaylistCoverImageURL}>
      <div style={{ position: 'relative', top: '15%' }}>
        <img src={logo} style={{ height: '65px' }} alt="Logo" />
      </div>
      <div style={{ fontWeight: 'bold', position: 'absolute', top: '50%', bottom: '50%', left: '50%', transform: 'translateX(-50%)', maxWidth: '130px', wordWrap: 'break-word' }}>
        <span style={{ fontSize: `${fontSize}px` }}>{getFormattedName()}</span><br></br><span style={{ fontSize: '14px' }}>exploratory mix</span>
      </div>
      <div className="timeRange" style={{ position: 'absolute', bottom: '10%', transform: 'translateX(-50%)', left: '50%' }}>
        <span>{props.selectedTimeRange}</span>
      </div>
    </div>
    </div>
    </>


  );
};

export default PlaylistCoverGenerator;
