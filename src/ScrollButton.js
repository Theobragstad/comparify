import React, { useState, useEffect } from "react";
import downBtn from "./img/downBtn.png";
import upBtn from "./img/upBtn.png";

const ScrollButton = () => {
  const [scrollDirection, setScrollDirection] = useState("down");
  const [isHovered, setIsHovered] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [recentClick, setRecentClick] = useState(false);
  let clickTimeout;

  const handleButtonClick = () => {
    if (scrollDirection === "down") {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    setRecentClick(true);
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => {
      setRecentClick(false);
    }, 5000);
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scrollThreshold = scrollHeight / 2;

    if (scrollTop < scrollThreshold) {
      setScrollDirection("down");
    } else {
      setScrollDirection("up");
    }

    setIsScrolling(true);
  };

  useEffect(() => {
    let scrollTimeout;

    const handleScrollTimeout = () => {
      setIsScrolling(false);
    };

    window.addEventListener("scroll", handleScroll);

    if (isScrolling && !recentClick) {
      scrollTimeout = setTimeout(handleScrollTimeout, 2000);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [isScrolling, recentClick]);

  useEffect(() => {
    setShowButton(isScrolling);
  }, [isScrolling]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="scrollBtn"
      onClick={handleButtonClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showButton ? (
        scrollDirection === "down" ? (
          <img src={downBtn} style={{ width: "30px" }} title="Go to bottom" />
        ) : (
          <img src={upBtn} style={{ width: "30px" }} title="Go to top" />
        )
      ) : null}
    </div>
  );
};

export default ScrollButton;
