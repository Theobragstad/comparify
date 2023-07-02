import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";
import spotifysmall from "./img/spotifysmall.png";
import PlaylistCoverGenerator from "./PlaylistCoverGenerator";
import { getPlaylistCoverImageURL } from "./PlaylistCoverGenerator";
import check from "./img/check.png";

const DataPageRecommendations = (props) => {
  const location = useLocation();
  const token = location.state.token;

  const [safeRecommendationSongs, setSafeRecommendationSongs] = useState([]);
  const [
    exploratoryHighRecommendationSongs,
    setExploratoryHighRecommendationSongs,
  ] = useState([]);

  const [
    exploratoryLowRecommendationSongs,
    setExploratoryLowRecommendationSongs,
  ] = useState([]);

  const getSongRecommendations = async (
    arrayToSet,
    seed_artists,
    seed_genres,
    seed_tracks,
    target_acousticness,
    target_danceability,
    target_duration_ms,
    target_energy,
    target_instrumentalness,
    target_liveness,
    target_loudness,
    target_popularity,
    target_speechiness,
    target_tempo,
    target_valence
  ) => {
    setLoadingSafePlaylist(true);

    console.log(target_popularity);
    const { data } = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 50,
          seed_artists: seed_artists.join(","),
          seed_genres: seed_genres.join(","),
          seed_tracks: seed_tracks.join(","),
          target_acousticness: target_acousticness,
          target_danceability: target_danceability,
          target_duration_ms: target_duration_ms,
          target_energy: target_energy,
          target_instrumentalness: target_instrumentalness,
          // target_key:'',
          target_liveness: target_liveness,
          target_loudness: target_loudness,
          // target_mode:'',
          target_popularity: target_popularity,
          target_speechiness: target_speechiness,
          target_tempo: target_tempo,
          // target_time_signature:'',
          target_valence: target_valence,
        },
      }
    );

    const recommendations = data.tracks.map((track) => ({
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      img: track.album.images[0]?.url,
      uri: track.uri,
      mp3: track.preview_url,
      id: track.id
    }));


    arrayToSet(
      // recommendations.filter((item) => !props.allTopSongIds.includes(item))
      // recommendations.filter(item => !props.allTopSongIds.some(id => id === item.id))
      recommendations.filter(item => !props.allTopSongIds.includes(item.id))
    );
    // console.log(recommendations)
    // console.log(recommendations.filter(item => !props.allTopSongIds.includes(item)))
    setLoadingSafePlaylist(false);
  };

  const getReasonableMinDurationMS = (targetValue) => {
    if (targetValue >= 300000) {
      return 300000;
    }
    return targetValue + 30000;
  };

  const getReasonableMaxDurationMS = (targetValue) => {
    if (targetValue <= 90000 || targetValue - 30000 <= 90000) {
      return 90000;
    }
    return targetValue - 30000;
  };

  const getReasonableMinLoudness = (targetValue) => {
    if (targetValue === -60) {
      return -10;
    } else if (targetValue >= 0) {
      return -60;
    } else if (targetValue >= -5) {
      return -5;
    }

    return targetValue + (-1 * targetValue) / 2;
  };

  const getReasonableMin = (targetValue) => {
    const min = (1 - targetValue) / 2 + targetValue;
    if (targetValue >= 0.75 || min >= 0.75) {
      return 0.75;
    }
    return min;
  };

  const getReasonableMax = (targetValue) => {
    const max = targetValue / 2;
    if (targetValue <= 0.1 || max <= 0.1) {
      return 0.1;
    }
    return max;
  };

  // const getExploratoryHighRecommendations = async (seed_artists, seed_genres,
  //   seed_tracks, target_acousticness, target_danceability, target_duration_ms, target_energy,
  //   target_instrumentalness,target_liveness,target_loudness,target_popularity,target_speechiness,
  //   target_tempo, target_valence) => {

  //     const inputParams = [
  //       target_acousticness,
  //       target_danceability,
  //       // target_duration_ms,
  //       target_energy,
  //       target_instrumentalness,
  //       target_liveness,
  //       // target_loudness,
  //       // target_popularity,
  //       target_speechiness,
  //       // target_tempo,
  //       target_valence
  //   ];

  //   const mins = inputParams.map(param => getReasonableMin(parseFloat(param)).toFixed(2));

  //   const { data } = await axios.get(
  //     "https://api.spotify.com/v1/recommendations",
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       params: {
  //         limit: 25,
  //         seed_artists: seed_artists.join(","),
  //         seed_genres: seed_genres.join(","),
  //         seed_tracks: seed_tracks.join(","),
  //         min_acousticness:mins[0] ,
  //         // min_danceability:mins[1],
  //         // min_energy:mins[2],
  //         // min_instrumentalness:mins[3],
  //         // min_liveness:mins[4],
  //         // min_speechiness:mins[5],
  //         // min_valence:mins[6],
  //       },
  //     }
  //   );

  //   const highRecommendations = data.tracks.map((track) => ({
  //     name: track.name,
  //     artists: track.artists.map((artist) => artist.name),
  //     img: track.album.images[0]?.url,
  //   }));

  //   setExploratoryHighRecommendationSongs(highRecommendations.filter(item => !props.allTopSongIds.includes(item)))

  // };
  const getExploratoryHighRecommendations = async (
    seed_artists,
    seed_genres,
    seed_tracks,
    target_acousticness,
    target_danceability,
    target_duration_ms,
    target_energy,
    target_instrumentalness,
    target_liveness,
    target_loudness,
    target_popularity,
    target_speechiness,
    target_tempo,
    target_valence
  ) => {
    setLoadingExploratoryPlaylist(true);

    const inputParams = [
      target_acousticness,
      target_danceability,
      target_energy,
      target_instrumentalness,
      target_liveness,
      target_speechiness,
      target_valence,
    ];

    const paramNames = [
      "min_acousticness",
      "min_danceability",
      "min_energy",
      "min_instrumentalness",
      "min_liveness",
      "min_speechiness",
      "min_valence",
    ];

    const mins = inputParams.map((param) =>
      getReasonableMin(parseFloat(param)).toFixed(2)
    );

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 25,
        seed_artists: seed_artists.join(","),
        seed_genres: seed_genres.join(","),
        seed_tracks: seed_tracks.join(","),
      },
    };

    let numParams = inputParams.length;

    while (numParams > 0) {
      const currentParams = inputParams.slice(0, numParams);
      const currentMins = mins.slice(0, numParams);

      currentParams.forEach((param, index) => {
        axiosConfig.params[paramNames[index]] = currentMins[index];
      });

      const { data } = await axios.get(
        "https://api.spotify.com/v1/recommendations",
        axiosConfig
      );

      if (data.tracks.length >= 10) {
        const highRecommendations = data.tracks.map((track) => ({
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          img: track.album.images[0]?.url,
          uri: track.uri,
          mp3: track.preview_url,
        }));

        setExploratoryHighRecommendationSongs(
          highRecommendations.filter(
            (item) => !props.allTopSongIds.includes(item)
          )
        );
        // console.log(`Used ${numParams} parameters to find ${data.tracks.length} high recommendations, with config: `, axiosConfig);

        return; // Exit the function if at least one item is found
      }

      numParams--;
      currentParams.forEach((param, index) => {
        delete axiosConfig.params[paramNames[index]];
      });
    }

    // Handle the case where no combination of parameters returns at least 10 items
    // console.log("Could not find enough recommendations with the given parameters.");
  };

  const getExploratoryLowRecommendations = async (
    seed_artists,
    seed_genres,
    seed_tracks,
    target_acousticness,
    target_danceability,
    target_duration_ms,
    target_energy,
    target_instrumentalness,
    target_liveness,
    target_loudness,
    target_popularity,
    target_speechiness,
    target_tempo,
    target_valence
  ) => {
    const inputParams = [
      target_acousticness,
      target_danceability,
      // target_duration_ms,
      target_energy,
      target_instrumentalness,
      target_liveness,
      // target_loudness,
      // target_popularity,
      target_speechiness,
      // target_tempo,
      target_valence,
    ];

    const paramNames = [
      "max_acousticness",
      "max_danceability",
      "max_energy",
      "max_instrumentalness",
      "max_liveness",
      "max_speechiness",
      "max_valence",
    ];

    const maxes = inputParams.map((param) =>
      getReasonableMax(parseFloat(param)).toFixed(2)
    );

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        limit: 25,
        seed_artists: seed_artists.join(","),
        seed_genres: seed_genres.join(","),
        seed_tracks: seed_tracks.join(","),
      },
    };

    let numParams = inputParams.length;

    while (numParams > 0) {
      const currentParams = inputParams.slice(0, numParams);
      const currentMaxes = maxes.slice(0, numParams);

      currentParams.forEach((param, index) => {
        axiosConfig.params[paramNames[index]] = currentMaxes[index];
      });

      const { data } = await axios.get(
        "https://api.spotify.com/v1/recommendations",
        axiosConfig
      );

      if (data.tracks.length >= 10) {
        const lowRecommendations = data.tracks.map((track) => ({
          name: track.name,
          artists: track.artists.map((artist) => artist.name),
          img: track.album.images[0]?.url,
          uri: track.uri,
          mp3: track.preview_url,
        }));

        setExploratoryLowRecommendationSongs(
          lowRecommendations.filter(
            (item) => !props.allTopSongIds.includes(item)
          )
        );
        // console.log(`Used ${numParams} parameters to find ${data.tracks.length} low recommendations, with config: `, axiosConfig);
        setLoadingExploratoryPlaylist(false);

        return;
      }

      numParams--;
      currentParams.forEach((param, index) => {
        delete axiosConfig.params[paramNames[index]];
      });
    }

    // console.log("Could not find enough recommendations with the given parameters.");
  };

  useEffect(() => {
    getSongRecommendations(
      setSafeRecommendationSongs,
      props.safeArtistIds,
      props.safeGenres,
      props.safeTrackIds,
      props.target_acousticness,
      props.target_danceability,
      props.target_duration_ms,
      props.target_energy,
      props.target_instrumentalness,
      props.target_liveness,
      props.target_loudness,
      props.target_popularity,
      props.target_speechiness,
      props.target_tempo,
      props.target_valence
    );

    getExploratoryHighRecommendations(
      props.exploratoryArtistIds,
      props.exploratoryGenres,
      props.exploratoryTrackIds,
      props.target_acousticness,
      props.target_danceability,
      props.target_duration_ms,
      props.target_energy,
      props.target_instrumentalness,
      props.target_liveness,
      props.target_loudness,
      props.target_popularity,
      props.target_speechiness,
      props.target_tempo,
      props.target_valence
    );

    getExploratoryLowRecommendations(
      props.exploratoryArtistIds,
      props.exploratoryGenres,
      props.exploratoryTrackIds,
      props.target_acousticness,
      props.target_danceability,
      props.target_duration_ms,
      props.target_energy,
      props.target_instrumentalness,
      props.target_liveness,
      props.target_loudness,
      props.target_popularity,
      props.target_speechiness,
      props.target_tempo,
      props.target_valence
    );
  }, []);

  const [addingSafePlaylist, setAddingSafePlaylist] = useState(false);
  const [addedSafePlaylist, setAddedSafePlaylist] = useState(false);

  const [addingExploratoryPlaylist, setAddingExploratoryPlaylist] =
    useState(false);

  const [addedExploratoryPlaylist, setAddedExploratoryPlaylist] =
    useState(false);

  const addPlaylist = async (playlistName, playlistDescription, type) => {
    if (type === "safe") {
      setAddingSafePlaylist(true);
    } else if (type === "exploratory") {
      setAddingExploratoryPlaylist(true);
    }
    const { data } = await axios.post(
      `https://api.spotify.com/v1/users/${props.user_id}/playlists`,
      {
        name: playlistName,
        description: `${playlistDescription} Generated using comparify.app`,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await addSongsToPlaylist(data.id, type);
    await setPlaylistImage(data.id, type);
  };

  // const addSongsToPlaylist = async (playlist_id) => {
  //   console.log(safeRecommendationSongs.map(item => item.uri))
  //   const { data } = await axios.post(
  //     `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
  //     {uris: ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]
  //   }  ,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   );

  // };

  const addSongsToPlaylist = async (playlist_id, type) => {
    if (type === "safe" || type === "exploratory") {
      let uris = safeRecommendationSongs.map((item) => item.uri);
      if (type === "exploratory") {
        uris = exploratoryHighRecommendationSongs
          .concat(exploratoryLowRecommendationSongs)
          .map((item) => item.uri);
      }
      const { data } = await axios.post(
        `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        { uris },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  };

  // const setPlaylistImage = async (playlist_id) => {
  //   console.log(playlist_id);
  //   try {
  //     const response = await axios.get(
  //       `https://api.spotify.com/v1/playlists/${playlist_id}/images`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     console.log(response.data); // Access the response data

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const setPlaylistImage = async (playlist_id, type) => {
    try {
      if (type === "safe" || type === "exploratory") {
        let url = await getPlaylistCoverImageURL(type);
        url = url.substring(url.indexOf(",") + 1);
        await axios.put(
          `https://api.spotify.com/v1/playlists/${playlist_id}/images`,
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
    if (type === "safe") {
      setAddingSafePlaylist(false);
      setAddedSafePlaylist(true);
    } else if (type === "exploratory") {
      setAddingExploratoryPlaylist(false);
      setAddedExploratoryPlaylist(true);
    }
  };

  const [loadingSafePlaylist, setLoadingSafePlaylist] = useState(true);
  const [loadingExploratoryPlaylist, setLoadingExploratoryPlaylist] =
    useState(true);


















    const [isPlaying, setIsPlaying] = useState({});



  const togglePlayback = (id) => {
    const thisElement = document.getElementById(id);
    const audioElements = document.querySelectorAll("audio");
    const updatedIsPlaying = { ...isPlaying };
  
    audioElements.forEach((audioElement, i) => {
      if (audioElement !== thisElement) {
        audioElement.pause();
        updatedIsPlaying[audioElement.id] = false;
      } else {
        if (audioElement.paused) {
          audioElements.forEach((el, j) => {
            if (el !== thisElement) {
              el.pause();
              updatedIsPlaying[el.id] = false;
            }
          });
  
          updatedIsPlaying[id] = true;
          audioElement.play().catch((error) => {
            console.log(error);
          });
        } else {
          audioElement.pause();
          updatedIsPlaying[id] = false;
        }
      }
    });
  
    setIsPlaying(updatedIsPlaying);
  };
  

  const resetAllAudio = () => {
    const audioElements = document.querySelectorAll("audio");
    const updatedIsPlaying = Array.from(isPlaying);

    audioElements.forEach((audioElement, i) => {
      audioElement.pause();
      audioElement.currentTime = 0;
      updatedIsPlaying[i] = false;
    });

    setIsPlaying(updatedIsPlaying);
  };

  useEffect(() => {
    const audioElements = document.querySelectorAll("audio");
    const updatedIsPlaying = Array.from(isPlaying);

    const handleAudioEnded = (index) => {
      updatedIsPlaying[index] = false;
      setIsPlaying(updatedIsPlaying);
    };

    audioElements.forEach((audioElement, i) => {
      audioElement.addEventListener("ended", () => handleAudioEnded(i));
    });

    return () => {
      audioElements.forEach((audioElement, i) => {
        audioElement.removeEventListener("ended", () => handleAudioEnded(i));
      });
    };
  }, [isPlaying]);

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
        Safe Playlist
        {loadingSafePlaylist || addingSafePlaylist ? (
          <div className="loadingDotsGreen">
            <div className="loadingDotsGreen--dot"></div>
            <div className="loadingDotsGreen--dot"></div>
            <div className="loadingDotsGreen--dot"></div>
          </div>
        ) : (
          <>
            {addedSafePlaylist ? (
              // Additional conditional content
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  marginLeft: "2vw",
                  color: "#18d860",
                }}
              >
                Added <img src={check} style={{ width: "10px" }}></img>
              </span>
            ) : (
              // Default content
              <button
                title="Add to your Spotify library"
                className="addToSpotifyBtn"
                onClick={() =>
                  addPlaylist(
                    `comparify mix (${props.selectedTimeRange})`,
                    `Songs you're likely to enjoy based on your preferences for this period!`,
                    "safe"
                  )
                }
                disabled={safeRecommendationSongs.length === 0}
              >
                add to{" "}
                <img
                  src={spotifysmall}
                  style={{ width: "15px", verticalAlign: "middle" }}
                  alt="Spotify"
                />
              </button>
            )}
          </>
        )}
      </div>

      <PlaylistCoverGenerator
        selectedTimeRange={props.selectedTimeRange}
        display_name={props.display_name}
      />

      <div
        style={{
          fontWeight: "bold",
          fontSize: "12px",
          marginBottom: "10px",
          marginTop: "10px",
          maxWidth: "450px",
          marginLeft: "auto",
          color: "gray",
          marginRight: "auto",
        }}
      >
        Songs you're likely to enjoy based on your preferences for this period.
      </div>

      <div className="playlistCard">
        {loadingSafePlaylist ? (
          <div className="loadingDots">
            <div className="loadingDots--dot"></div>
            <div className="loadingDots--dot"></div>
            <div className="loadingDots--dot"></div>
          </div>
        ) : (
          <div>
            {safeRecommendationSongs.length === 0 ? (
              <div className="emptyContainer">
                <span>Could not find enough recommendations.</span>
              </div>
            ) : (
              safeRecommendationSongs.map((song, index) => (
                <div key={index} className="item">
                   <div
                              class={`primaryImage`}
                              onClick={() => togglePlayback(`safe-suggested-audio-${index}`)}
                              >
                              <audio id={`safe-suggested-audio-${index}`}  src={song?.mp3}></audio>

                              <img src={song?.img} className="primaryImage" />

                              {song?.mp3 && (
                              <div
                              className={isPlaying[`safe-suggested-audio-${index}`] ? "paused" : "playing"}
                              ></div>
                              )}
                              </div>
                  {/* <img src={song.img} className="primaryImage" /> */}
                  <div className="primaryText">
                    <span className="primaryName">{song.name}</span>
                    <span className="primaryArtists">
                      {song.artists.join(", ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div
        style={{
          marginBottom: "0px",
          marginTop: "20px",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Exploratory Playlist
        {loadingExploratoryPlaylist ? (
          <div className="loadingDotsGreen">
            <div className="loadingDotsGreen--dot"></div>
            <div className="loadingDotsGreen--dot"></div>
            <div className="loadingDotsGreen--dot"></div>
          </div>
        ) : (
          <>
            {addedExploratoryPlaylist || addingExploratoryPlaylist ? (
              // Additional conditional content
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "10px",
                  marginLeft: "2vw",
                  color: "#18d860",
                }}
              >
                Added <img src={check} style={{ width: "10px" }}></img>
              </span>
            ) : (
              <button
                title="Add to your Spotify library"
                className="addToSpotifyBtn"
                onClick={() =>
                  addPlaylist(
                    `exploratory comparify mix (${props.selectedTimeRange})`,
                    `Songs you might not usually listen to! These have different characteristics than your typical preferences for this period.`,
                    "exploratory"
                  )
                }
                disabled={
                  exploratoryHighRecommendationSongs.concat(
                    exploratoryLowRecommendationSongs
                  ).length === 0
                }
              >
                add to{" "}
                <img
                  src={spotifysmall}
                  style={{ width: "15px", verticalAlign: "middle" }}
                ></img>
              </button>
            )}
          </>
        )}
      </div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "12px",
          marginBottom: "10px",
          marginTop: "10px",
          maxWidth: "450px",
          marginLeft: "auto",
          color: "gray",
          marginRight: "auto",
        }}
      >
        Songs you might not usually listen to. These have different
        characteristics than your typical preferences for this period.
      </div>

      <div className="playlistCard">
        {loadingExploratoryPlaylist ? (
          <div className="loadingDots">
            <div className="loadingDots--dot"></div>
            <div className="loadingDots--dot"></div>
            <div className="loadingDots--dot"></div>
          </div>
        ) : (
          <div>
            {exploratoryHighRecommendationSongs.concat(
              exploratoryLowRecommendationSongs
            ).length === 0 ? (
              <div className="emptyContainer">
                <span>Could not find enough recommendations.</span>
              </div>
            ) : (
              exploratoryHighRecommendationSongs
                .concat(exploratoryLowRecommendationSongs)
                .map((song, index) => (
                  <div key={index} className="item">

                              <div
                              class={`primaryImage`}
                              onClick={() => togglePlayback(`expl-suggested-audio-${index}`)}
                              >
                              <audio id={`expl-suggested-audio-${index}`}  src={song?.mp3}></audio>

                              <img src={song?.img} className="primaryImage" />

                              {song?.mp3 && (
                              <div
                              className={isPlaying[`expl-suggested-audio-${index}`] ? "paused" : "playing"}
                              ></div>
                              )}
                              </div>


                    {/* <img src={song.img} className="primaryImage" /> */}
                    <div className="primaryText">
                      <span className="primaryName">{song.name}</span>
                      <span className="primaryArtists">
                        {song.artists.join(", ")}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPageRecommendations;
