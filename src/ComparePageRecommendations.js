import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router";
import spotifysmall from "./img/spotifysmall.png";
import PlaylistCoverGenerator from "./PlaylistCoverGenerator";
import { getPlaylistCoverImageURL } from "./PlaylistCoverGenerator";
import check from "./img/check.png";

const ComparePageRecommendations = (props) => {
  const location = useLocation();
  const token = location.state.token;

  useEffect(() => {}, []);

  const [addingBlendPlaylist, setAddingBlendPlaylist] = useState(false);
  const [addedBlendPlaylist, setAddedBlendPlaylist] = useState(false);

  const [addingNonblendPlaylist, setAddingNonblendPlaylist] = useState(false);
  const [addedNonblendPlaylist, setAddedNonblendPlaylist] = useState(false);

  const [loadingBlendPlaylist, setLoadingBlendPlaylist] = useState(true);
  const [loadingNonblendPlaylist, setLoadingNonblendPlaylist] = useState(true);

  const [blendSongs, setBlendSongs] = useState([]);
  const [nonblendSongs, setNonblendSongs] = useState([]);

  const getBlendSongs = async (
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
    setLoadingBlendPlaylist(true);
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
          target_liveness: target_liveness,
          target_loudness: target_loudness,
          target_popularity: target_popularity,
          target_speechiness: target_speechiness,
          target_tempo: target_tempo,
          target_valence: target_valence,
        },
      }
    );

    const recommendations = data.tracks.map((track) => ({
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      img: track.album.images[0]?.url,
      uri: track.uri,
    }));

    setBlendSongs(
      recommendations.filter(
        (item) =>
          !props.onlyUser1TopSongs.includes(item) &&
          !props.onlyUser2TopSongs.includes(item)
      )
    );

    setLoadingBlendPlaylist(false);
  };

  const getUser1Songs = async () => {
    if(props.onlyUser1TopArtists.length === 0 && props.onlyUser1TopGenres.length === 0 && props.onlyUser1TopSongs.length === 0) {
      return [];
    }

    let seedArtists = props.onlyUser1TopArtists
      .slice(0, Math.min(10, props.onlyUser1TopArtists.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    if (seedArtists.length === 0) {
      seedArtists = props.user1AllTopArtists
      .slice(0, Math.min(10, props.user1AllTopArtists.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    }

    let seedGenres = props.onlyUser1TopGenres
      .slice(0, Math.min(10, props.onlyUser1TopGenres.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 1);
    if (seedGenres.length === 0) {
      seedGenres = props.user1AllTopGenres
      .slice(0, Math.min(10, props.user1AllTopGenres.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 1);
    }

    let seedTracks = props.onlyUser1TopSongs
      .slice(0, Math.min(10, props.onlyUser1TopSongs.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    if (seedTracks.length === 0) {
      seedTracks = props.user1AllTopSongs
      .slice(0, Math.min(10, props.user1AllTopSongs.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    }


    if(seedArtists.length === 0 || seedGenres.length === 0 || seedTracks.length === 0) {
      return [];
    }

    const { data } = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 25,
          seed_artists: seedArtists.join(","),
          seed_genres: seedGenres.join(","),
          seed_tracks: seedTracks.join(","),
          // target_acousticness: target_acousticness,
          // target_danceability: target_danceability,
          // target_duration_ms: target_duration_ms,
          // target_energy: target_energy,
          // target_instrumentalness: target_instrumentalness,
          // target_liveness: target_liveness,
          // target_loudness: target_loudness,
          // target_popularity: target_popularity,
          // target_speechiness: target_speechiness,
          // target_tempo: target_tempo,
          // target_valence: target_valence,
        },
      }
    );

    return data.tracks.map((track) => ({
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      img: track.album.images[0]?.url,
      uri: track.uri,
    }));
  };

  const getUser2Songs = async () => {
    if(props.onlyUser2TopArtists.length === 0 && props.onlyUser2TopGenres.length === 0 && props.onlyUser2TopSongs.length === 0) {
      return [];
    }

    let seedArtists = props.onlyUser2TopArtists
      .slice(0, Math.min(10, props.onlyUser2TopArtists.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    if (seedArtists.length === 0) {
      seedArtists = props.user2AllTopArtists
      .slice(0, Math.min(10, props.user2AllTopArtists.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    }

    let seedGenres = props.onlyUser2TopGenres
      .slice(0, Math.min(10, props.onlyUser2TopGenres.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 1);
    if (seedGenres.length === 0) {
      seedGenres = props.user2AllTopGenres
      .slice(0, Math.min(10, props.user2AllTopGenres.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 1);
    }

    let seedTracks = props.onlyUser2TopSongs
      .slice(0, Math.min(10, props.onlyUser2TopSongs.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    if (seedTracks.length === 0) {
      seedTracks = props.user2AllTopSongs
      .slice(0, Math.min(10, props.user2AllTopSongs.length))
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    }


    if(seedArtists.length === 0 || seedGenres.length === 0 || seedTracks.length === 0) {
      return [];
    }

    const { data } = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 25,
          seed_artists: seedArtists.join(","),
          seed_genres: seedGenres.join(","),
          seed_tracks: seedTracks.join(","),
          // target_acousticness: target_acousticness,
          // target_danceability: target_danceability,
          // target_duration_ms: target_duration_ms,
          // target_energy: target_energy,
          // target_instrumentalness: target_instrumentalness,
          // target_liveness: target_liveness,
          // target_loudness: target_loudness,
          // target_popularity: target_popularity,
          // target_speechiness: target_speechiness,
          // target_tempo: target_tempo,
          // target_valence: target_valence,
        },
      }
    );

    return data.tracks.map((track) => ({
      name: track.name,
      artists: track.artists.map((artist) => artist.name),
      img: track.album.images[0]?.url,
      uri: track.uri,
    }));
  };

  const getNonblendSongs = async () => {
    setLoadingNonblendPlaylist(true);
    const recommendations1 = await getUser1Songs();
    const recommendations2 = await getUser2Songs();
    const recommendations = recommendations1.concat(recommendations2);
    console.log(recommendations)
   
    setNonblendSongs(

      recommendations.length > 0 ? recommendations.filter(
        (item) =>
          !props.onlyUser1TopSongs.includes(item) &&
          !props.onlyUser2TopSongs.includes(item)
      ) : []
    );

    setLoadingNonblendPlaylist(false);
  };

  const addPlaylist = async (
    playlistName,
    playlistDescription,
    playlistType
  ) => {
    if (playlistType === "blend") {
      setAddingBlendPlaylist(true);
    } else if (playlistType === "nonblend") {
      setAddingNonblendPlaylist(true);
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

    await addSongsToPlaylist(data.id, playlistType);
    await setPlaylistImage(data.id, playlistType);
  };

  const addSongsToPlaylist = async (playlistId, playlistType) => {
    if (playlistType === "blend" || playlistType === "nonblend") {
      let uris = blendSongs.map((item) => item.uri);
      if (playlistType === "nonblend") {
        uris = nonblendSongs.map((item) => item.uri);
      }
      // let uris = [`spotify:track:3fVnlF4pGqWI9flVENcT28`];
      const { data } = await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  };

  const setPlaylistImage = async (playlistId, playlistType) => {
    try {
      if (playlistType === "blend" || playlistType === "nonblend") {
        let url = await getPlaylistCoverImageURL(playlistType);
        url = url.substring(url.indexOf(",") + 1);
        await axios.put(
          `https://api.spotify.com/v1/playlists/${playlistId}/images`,
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(url);
      }
    } catch (error) {
      console.error(error);
    }
    if (playlistType === "blend") {
      setAddingBlendPlaylist(false);
      setAddedBlendPlaylist(true);
    } else if (playlistType === "nonblend") {
      setAddingNonblendPlaylist(false);
      setAddedNonblendPlaylist(true);
    }
  };

  useEffect(() => {
    getBlendSongs(
      props.blendArtistIds,
      props.blendGenres,
      props.blendTrackIds,
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
    getNonblendSongs();
  }, []);

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
        {loadingBlendPlaylist || addingBlendPlaylist ? (
          <div className="loadingDotsGreen">
            <div className="loadingDotsGreen--dot"></div>
            <div className="loadingDotsGreen--dot"></div>
            <div className="loadingDotsGreen--dot"></div>
          </div>
        ) : (
          <>
            {addedBlendPlaylist ? (
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
                    `comparify blend for ${props.display_name1} + ${props.display_name2} (${props.selectedTimeRange})`,
                    `Songs we think you'd both like based on this period!`,
                    "blend"
                  )
                }
                disabled={blendSongs.length === 0}
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
        display_name1={props.display_name1}
        display_name2={props.display_name2}
        display_name={null}
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
        Songs we think you'd both like based on this period!
      </div>

      <div className="playlistCard">
        {loadingBlendPlaylist ? (
          <div className="loadingDots">
            <div className="loadingDots--dot"></div>
            <div className="loadingDots--dot"></div>
            <div className="loadingDots--dot"></div>
          </div>
        ) : (
          <div>
            {blendSongs.length === 0 ? (
              <div className="emptyContainer">
                <span>Could not find enough recommendations.</span>
              </div>
            ) : (
              blendSongs.map((song, index) => (
                <div key={index} className="item">
                  <img src={song.img} className="primaryImage" />
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
        Non-Blend Playlist
        {loadingNonblendPlaylist ? (
          <div className="loadingDotsGreen">
            <div className="loadingDotsGreen--dot"></div>
            <div className="loadingDotsGreen--dot"></div>
            <div className="loadingDotsGreen--dot"></div>
          </div>
        ) : (
          <>
            {addedNonblendPlaylist || addingNonblendPlaylist ? (
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
                    `comparify non-blend for ${props.display_name1} + ${props.display_name2} (${props.selectedTimeRange})`,
                    `Half and half. Songs we think one (but not necessarily both) of you'd like based on
                this period. Get to know each other's music tastes!`,
                    "nonblend"
                  )
                }
                disabled={nonblendSongs.length === 0}
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
        Half and half. Songs we think one (but not necessarily both) of you'd
        like based on this period. Get to know each other's music tastes!
      </div>

      <div className="playlistCard">
        {loadingNonblendPlaylist ? (
          <div className="loadingDots">
            <div className="loadingDots--dot"></div>
            <div className="loadingDots--dot"></div>
            <div className="loadingDots--dot"></div>
          </div>
        ) : (
          <div>
            {nonblendSongs.length === 0 ? (
              <div className="emptyContainer">
                <span>Could not find enough recommendations.</span>
              </div>
            ) : (
              nonblendSongs.map((song, index) => (
                <div key={index} className="item">
                  <img src={song.img} className="primaryImage" />
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

export default ComparePageRecommendations;
