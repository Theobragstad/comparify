import React, { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import logo from "./img/logo.png";

export const getPlaylistCoverImageURL = async (type) => {
  try {
    let id =
      type === "safe"
        ? "safeCover"
        : type === "exploratory"
        ? "exploratoryCover"
        : type === "blend"
        ? "blendCover"
        : "nonblendCover";
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
  const display_name = props.display_name;
  const display_name1 = props.display_name1 ? props.display_name1 : null;
  const display_name2 = props.display_name2 ? props.display_name2 : null;

  const [fontSize, setFontSize] = useState(24);

  useEffect(() => {
    const calculateFontSize = () => {
      const nameLength = display_name
        ? display_name.length
        : display_name1 && display_name2
        ? display_name1.length + display_name2.length
        : 0;

      let adjustedFontSize = Math.max(24 - (nameLength - 8), 14);

      if (!display_name) {
        adjustedFontSize = Math.max(20 - (nameLength - 8), 14);
      }
      setFontSize(adjustedFontSize);
    };

    calculateFontSize();
  }, [display_name, display_name1, display_name2]);

  const getFormattedName = () => {
    if (display_name) {
      if (display_name.length > 30) {
        return display_name.substring(0, 30) + "...'s";
      }
      return display_name + "'s";
    }
    return null;
  };

  const getFormattedNames = () => {
    if (display_name1 && display_name2) {
      if (display_name1.length + display_name2.length > 30) {
        return [display_name1.substring(0, 15), display_name2.substring(0, 15)];
      }
      return [display_name1, display_name2];
    }
    return [null, null];
  };

  return (
    <>
      <div style={{ width: "0", height: "0", overflow: "hidden" }}>
        <div
          id="safeCover"
          style={{
            width: "300px",
            height: "300px",
            backgroundColor: "white",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", top: "15%" }}>
            <img src={logo} style={{ height: "65px" }} alt="Logo" />
          </div>
          <div
            style={{
              fontWeight: "bold",
              position: "absolute",
              top: "50%",
              bottom: "50%",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "130px",
              wordWrap: "break-word",
            }}
          >
            <span style={{ fontSize: `${fontSize}px` }}>
              {getFormattedName()}
            </span>
            <br></br>
            <span style={{ fontSize: "16px" }}>mix</span>
          </div>
          <div
            className="timeRange"
            style={{
              position: "absolute",
              bottom: "10%",
              transform: "translateX(-50%)",
              left: "50%",
            }}
          >
            <span>{props.selectedTimeRange}</span>
          </div>
        </div>
      </div>

      <div style={{ width: "0", height: "0", overflow: "hidden" }}>
        <div
          id="exploratoryCover"
          style={{
            width: "300px",
            height: "300px",
            backgroundColor: "white",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", top: "15%" }}>
            <img src={logo} style={{ height: "65px" }} alt="Logo" />
          </div>
          <div
            style={{
              fontWeight: "bold",
              position: "absolute",
              top: "50%",
              bottom: "50%",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "130px",
              wordWrap: "break-word",
            }}
          >
            <span style={{ fontSize: `${fontSize}px` }}>
              {getFormattedName()}
            </span>
            <br></br>
            <span style={{ fontSize: "14px" }}>exploratory mix</span>
          </div>
          <div
            className="timeRange"
            style={{
              position: "absolute",
              bottom: "10%",
              transform: "translateX(-50%)",
              left: "50%",
            }}
          >
            <span>{props.selectedTimeRange}</span>
          </div>
        </div>
      </div>

      <div style={{ width: "0", height: "0", overflow: "hidden" }}>
        <div
          id="blendCover"
          style={{
            width: "300px",
            height: "300px",
            backgroundColor: "white",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", top: "15%" }}>
            <img src={logo} style={{ height: "65px" }} alt="Logo" />
          </div>
          <div
            style={{
              fontWeight: "bold",
              position: "absolute",
              top: "50%",
              bottom: "50%",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "130px",
              wordWrap: "break-word",
            }}
          >
            <span style={{ fontSize: `${fontSize}px` }}>
              <span style={{ color: "#1e90ff" }}>{getFormattedNames()[0]}</span>
              <span style={{ color: "#18d860", whiteSpace: "pre-wrap" }}>
                {" "}
                {"\n"}+{"\n"}
              </span>
              <span style={{ color: "#ffdf00" }}>{getFormattedNames()[1]}</span>
            </span>
            <br></br>
            <span style={{ fontSize: "14px" }}>blend</span>
          </div>
          <div
            className="timeRange"
            style={{
              position: "absolute",
              bottom: "10%",
              transform: "translateX(-50%)",
              left: "50%",
            }}
          >
            <span>{props.selectedTimeRange}</span>
          </div>
        </div>
      </div>

      <div style={{ width: "0", height: "0", overflow: "hidden" }}>
        <div
          id="nonblendCover"
          style={{
            width: "300px",
            height: "300px",
            backgroundColor: "white",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", top: "15%" }}>
            <img src={logo} style={{ height: "65px" }} alt="Logo" />
          </div>
          <div
            style={{
              fontWeight: "bold",
              position: "absolute",
              top: "50%",
              bottom: "50%",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "130px",
              wordWrap: "break-word",
            }}
          >
            <span style={{ fontSize: `${fontSize}px` }}>
              <span style={{ color: "#1e90ff" }}>{getFormattedNames[0]}</span>

              <span style={{ color: "#18d860", whiteSpace: "pre-wrap" }}>
                {" "}
                {"\n"}+{"\n"}
              </span>

              <span style={{ color: "#ffdf00" }}>{getFormattedNames[1]}</span>
            </span>
            <br></br>
            <span style={{ fontSize: "14px" }}>non-blend</span>
          </div>
          <div
            className="timeRange"
            style={{
              position: "absolute",
              bottom: "10%",
              transform: "translateX(-50%)",
              left: "50%",
            }}
          >
            <span>{props.selectedTimeRange}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaylistCoverGenerator;
