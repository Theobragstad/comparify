import React, { useState } from "react";

const ComparePageRecommendations = () => {
  return (
    <div>
      <div
        style={{
          marginBottom: "0px",
          marginTop: "20px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Blend Playlist
      </div>
      <div style={{ fontWeight: "bold", fontSize: "11px" }}>
        Songs we think you'd both like.
      </div>

      <div
        style={{
          marginBottom: "0px",
          marginTop: "20px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Non-Blend Playlist
      </div>
      <div style={{ fontWeight: "bold", fontSize: "11px" }}>
        Songs we think one (but not necessarily both) of you'd like. Get to know
        each other's music.
      </div>
    </div>
  );
};

export default ComparePageRecommendations;
