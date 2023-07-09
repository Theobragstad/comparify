import Big from "big.js";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import { Tooltip } from "react-tooltip";
import axios from "axios";
import Footer from "./Footer";
import "./App.css";
import back from "./img/back.png";
import defaultProfile from "./img/defaultProfile.jpeg";
import switchUserImg from "./img/switchUser.png";
import logo from "./img/logo.png"
import downloadBlue from "./img/downloadBlue.png"
import dashboard from "./img/dashboard.png"

function Code() {
  // const pageTitle = `${"hello"}`;
  document.title = "comparify - Get your code";

  const location = useLocation();
  const navigate = useNavigate();

  const [loadingDownload, setLoadingDownload] = useState(false);
  const [loadingView, setLoadingView] = useState(false);
  const [loadingCompare1, setLoadingCompare1] = useState(false);
  const [loadingCompare2, setLoadingCompare2] = useState(false);

  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) {
      return true;
    }
    return new Date().getTime() > parseInt(expirationTime);
  };

  const logout = (error) => {
    if (error === "apiError") {
      // clearCookies();
      setToken("");
      setExpirationTime("");
      window.localStorage.removeItem("token");
      // window.localStorage.removeItem("expirationTime"); //
      navigate("/", { state: { [error]: true } });
    } else {
      // clearCookies();
      setToken("");
      setExpirationTime("");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("expirationTime");
      // navigate("/", { state: { switchUser: true } });
      navigate("/")
    }
  };



  const switchUser = () => {
    const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f";
  // const REDIRECT_URI = "http://localhost:3000/code";
  const REDIRECT_URI = "https://comparify.app/code";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = "user-top-read playlist-modify-public ugc-image-upload user-library-read user-follow-read user-read-currently-playing user-read-playback-position user-read-playback-state user-read-recently-played playlist-read-private";

    window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}&show_dialog=true`;
  };

  const [expirationTime, setExpirationTime] = useState("");
  const [token, setToken] = useState("");

  function simplifyNumber(number) {
    const abbreviations = {
      K: 1000,
      M: 1000000,
      B: 1000000000,
    };

    let simplifiedNumber = number;

    if (number >= 1000) {
      const keys = Object.keys(abbreviations);
      for (let i = keys.length - 1; i >= 0; i--) {
        const abbreviation = keys[i];
        const value = abbreviations[abbreviation];
        if (number >= value) {
          simplifiedNumber = (number / value).toFixed(1) + abbreviation;
          break;
        }
      }
    }

    return simplifiedNumber;
  }

  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [displayName, setDisplayName] = useState("");

  const me = async () => {
    try {
      // throw new Error("Simulated error");

      const { data } = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {},
      });

      let imageUrl =
        data.images.length > 0 ? data.images[0].url : { defaultProfile };
      setProfilePicUrl(imageUrl);
      setDisplayName(data.display_name);
      return [
        "nameIdImgurlGenerationdate[4]",
        data.display_name,
        data.id,
        imageUrl,
        new Date(),
      ];
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const getSongAudioFeatureData = async (songIds) => {
    try {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/audio-features",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: songIds.join(","),
          },
        }
      );

      const audioFeatures = data.audio_features.map((item) => ({
        id: item.id,
        acousticness: item.acousticness,
        danceability: item.danceability,
        duration_ms: item.duration_ms,
        energy: item.energy,
        instrumentalness: item.instrumentalness,
        liveness: item.liveness,
        loudness: item.loudness,
        speechiness: item.speechiness,
        tempo: item.tempo,
        valence: item.valence,
      }));

      const fields = Object.keys(audioFeatures[0]).filter(
        (field) => field !== "id"
      );

      const means = {};
      const stdDevs = {};

      fields.forEach((field) => {
        const values = audioFeatures.map((item) => item[field]);
        const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
        const roundedMean =
          field !== "duration_ms" ? Number(mean.toFixed(2)) : mean;
        const stdDev = Math.sqrt(
          values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
            values.length
        );
        const roundedStdDev =
          field !== "duration_ms" ? Number(stdDev.toFixed(2)) : stdDev;
        means[field] = roundedMean;
        stdDevs[field] = roundedStdDev;
      });

      if ("duration_ms" in means) {
        const durationMean = means["duration_ms"];
        const minutes = Math.floor(durationMean / 60000);
        const seconds = Math.floor((durationMean % 60000) / 1000);
        means["duration_ms"] = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }

      if ("duration_ms" in stdDevs) {
        const durationStdDev = stdDevs["duration_ms"];
        const minutes = Math.floor(durationStdDev / 60000);
        const seconds = Math.floor((durationStdDev % 60000) / 1000);
        stdDevs["duration_ms"] = `${minutes}:${seconds
          .toString()
          .padStart(2, "0")}`;
      }

      const maxAudioFeatureSongIds = {};
      const minAudioFeatureSongIds = {};

      audioFeatures.forEach((item) => {
        Object.keys(item).forEach((field) => {
          if (field === "id") return;

          if (
            !maxAudioFeatureSongIds[field] ||
            item[field] >
              audioFeatures.find(
                (song) => song.id === maxAudioFeatureSongIds[field]
              )[field] ||
            (item[field] ===
              audioFeatures.find(
                (song) => song.id === maxAudioFeatureSongIds[field]
              )[field] &&
              item.id < maxAudioFeatureSongIds[field])
          ) {
            maxAudioFeatureSongIds[field] = item.id;
          }

          if (
            !minAudioFeatureSongIds[field] ||
            item[field] <
              audioFeatures.find(
                (song) => song.id === minAudioFeatureSongIds[field]
              )[field] ||
            (item[field] ===
              audioFeatures.find(
                (song) => song.id === minAudioFeatureSongIds[field]
              )[field] &&
              item.id < minAudioFeatureSongIds[field])
          ) {
            minAudioFeatureSongIds[field] = item.id;
          }
        });
      });

      const highestAudioFeatureSongIdsValues = Object.values(
        maxAudioFeatureSongIds
      );
      const lowestAudioFeatureSongIdsValues = Object.values(
        minAudioFeatureSongIds
      );

      return [
        "audioFeatureMeans[11]",
        Object.values(means),
        "audioFeatureStdDevs[11]",
        Object.values(stdDevs),
        "highestAudioFeatureSongIds[<=11]",
        highestAudioFeatureSongIdsValues,
        "lowestAudioFeatureSongIds[<=11]",
        lowestAudioFeatureSongIdsValues,
      ];
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const meSongs = async (timeRange) => {
    try {
      let songCode = [];

      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            time_range: timeRange,
            limit: 50,
          },
        }
      );

      if (data && data.items && data.items.length > 0) {
        const songIds = data.items.map((item) => item.id);
        songCode.push("songIds[<=50]", songIds);

        const songIdsAndPops = data.items.map((item) => ({
          id: item.id,
          pop: item.popularity,
        }));

        const mostPopSongId = songIdsAndPops.reduce(
          (currentPopularSongId, currentSong) => {
            if (
              !currentPopularSongId ||
              currentSong.pop >
                songIdsAndPops.find(
                  (album) => album.id === currentPopularSongId
                ).pop
            ) {
              return currentSong.id;
            }
            return currentPopularSongId;
          },
          null
        );

        const leastPopSongId = songIdsAndPops.reduce(
          (currentPopularSongId, currentSong) => {
            if (
              !currentPopularSongId ||
              currentSong.pop <
                songIdsAndPops.find(
                  (album) => album.id === currentPopularSongId
                ).pop
            ) {
              return currentSong.id;
            }
            return currentPopularSongId;
          },
          null
        );

        songCode.push(
          "mostLeastPopSongIds[<=2]",
          mostPopSongId,
          leastPopSongId
        );

        const songIdsAndReleaseDates = data.items
          .map((item) => ({
            id: item.id,
            releaseDate: item.album.release_date,
          }))
          .filter((item) => item.releaseDate !== "0000");

        function getDecade(releaseDate) {
          return Math.floor(parseInt(releaseDate) / 10) * 10;
        }

        const countsByDecade = {};

        songIdsAndReleaseDates.forEach((item) => {
          const decade = getDecade(item.releaseDate);
          if (countsByDecade[decade]) {
            countsByDecade[decade]++;
          } else {
            countsByDecade[decade] = 1;
          }
        });

        const totalCount = Object.values(countsByDecade).reduce(
          (sum, count) => sum + count,
          0
        );

        const result = Object.entries(countsByDecade).map(
          ([decade, count]) => ({
            decade: parseInt(decade),
            count,
          })
        );

        const resultWithPercentage = result.map((entry) => ({
          decade: entry.decade,
          count: entry.count,
          percentage: (entry.count / totalCount) * 100,
        }));

        const roundedResult = resultWithPercentage.map((entry) => ({
          decade: entry.decade,
          count: entry.count,
          percentage: entry.percentage.toFixed(2),
        }));

        const resultList = roundedResult.reduce((list, entry) => {
          list.push(entry.decade, entry.percentage);
          return list;
        }, []);

        // console.log(roundedResult);
        songCode.push("decadesAndPcts[]", resultList);

        const sortedSongIdsAndReleaseDates = songIdsAndReleaseDates.sort(
          (a, b) => {
            const dateA = new Date(a.releaseDate);
            const dateB = new Date(b.releaseDate);
            return dateA - dateB;
          }
        );

        const oldestSongId = sortedSongIdsAndReleaseDates[0].id;
        const newestSongId =
          sortedSongIdsAndReleaseDates[sortedSongIdsAndReleaseDates.length - 1]
            .id;

        songCode.push("oldestNewestSongIds[<=2]", oldestSongId, newestSongId);

        const songPops = songIdsAndPops.map((item) => item.pop);
        const sumSongPops = songPops.reduce(
          (accumulator, current) => accumulator + current,
          0
        );
        const avgSongPop = sumSongPops / songPops.length;
        const squaredDifferencesSongPops = songPops.map((pop) =>
          Math.pow(pop - avgSongPop, 2)
        );
        const varianceSongPops =
          squaredDifferencesSongPops.reduce(
            (accumulator, current) => accumulator + current,
            0
          ) / songPops.length;
        const songPopStdDev = Math.sqrt(varianceSongPops);

        songCode.push(
          "avgSongPop[1]",
          avgSongPop.toFixed(2),
          "songPopStdDev[1]",
          songPopStdDev.toFixed(2)
        );

        const today = new Date();
        const totalSongAges = songIdsAndReleaseDates.reduce((sum, item) => {
          const releaseDate = new Date(item.releaseDate);
          const ageInMilliseconds = today - releaseDate;
          return sum + ageInMilliseconds;
        }, 0);

        const averageSongAgeInMilliseconds =
          totalSongAges / songIdsAndReleaseDates.length;
        const averageSongAge = new Date(averageSongAgeInMilliseconds);

        const songAgeYr = averageSongAge.getUTCFullYear() - 1970;
        const songAgeMo = averageSongAge.getUTCMonth();

        const squaredDifferencesSongAges = songIdsAndReleaseDates.map(
          (item) => {
            const releaseDate = new Date(item.releaseDate);
            const ageInMilliseconds = today - releaseDate;
            const difference = ageInMilliseconds - averageSongAgeInMilliseconds;
            return difference * difference;
          }
        );

        const averageSquaredDifferenceSongAges =
          squaredDifferencesSongAges.reduce(
            (sum, difference) => sum + difference,
            0
          ) / songIdsAndReleaseDates.length;

        const songAgeStdDev = Math.sqrt(averageSquaredDifferenceSongAges);
        const songAgeStdDevAsDate = new Date(songAgeStdDev);
        const songAgeStdDevYr = songAgeStdDevAsDate.getUTCFullYear() - 1970;
        const songAgeStdDevMo = songAgeStdDevAsDate.getUTCMonth();

        songCode.push(
          "avgSongAgeYrMo[2]",
          songAgeYr,
          songAgeMo,
          "songAgeStdDevYrMo[2]",
          songAgeStdDevYr,
          songAgeStdDevMo
        );

        const explicitSongBooleans = data.items.map((item) => item.explicit);
        const explicitSongCount = explicitSongBooleans.reduce(
          (count, value) => count + (value ? 1 : 0),
          0
        );
        const pctSongsExpl =
          (explicitSongCount / explicitSongBooleans.length) * 100;
        songCode.push("pctSongsExpl[1]", pctSongsExpl);

        songCode.push((await getSongAudioFeatureData(songIds)).concat());

        songCode.push(await albums(data.items.map((item) => item.album.id)));
      } else {
        songCode.push(
          "songIds[<=50]",
          "No data",
          "mostLeastPopSongIds[<=2]",
          "No data",
          "No data",
          "decadesAndPcts[]",
          "No data",
          "oldestNewestSongIds[<=2]",
          "No data",
          "No data",
          "avgSongPop[1]",
          "-",
          "songPopStdDev[1]",
          "-",
          "avgSongAgeYrMo[2]",
          "-",
          "-",
          "songAgeStdDevYrMo[2]",
          "-",
          "-",
          "pctSongsExpl[1]",
          "-",
          "audioFeatureMeans[11]",
          Array(11).fill("-"),
          "audioFeatureStdDevs[11]",
          Array(11).fill("-"),
          "highestAudioFeatureSongIds[<=11]",
          "No data",
          "lowestAudioFeatureSongIds[<=11]",
          "No data",
          "albumIds[<=10]",
          "No data",
          "mostLeastPopAlbumIds[<=2]",
          "No data",
          "No data",
          "avgAlbumPop[1]",
          "-",
          "albumPopsStdDev[1]",
          "-",
          "topLabelsByAlbums[<=5]",
          "No data"
        );
      }
      return songCode;
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const meArtists = async (timeRange) => {
    try {
      let artistCode = [];
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/top/artists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            time_range: timeRange,
            limit: 50,
          },
        }
      );

      if (data && data.items && data.items.length > 0) {
        const artistIds = data.items.map((item) => item.id);
        artistCode.push("artistIds[<=50]", artistIds);

        const artistIdsAndPops = data.items.map((item) => ({
          id: item.id,
          pop: item.popularity,
        }));

        const mostPopArtistId = artistIdsAndPops.reduce(
          (currentPopularArtistId, currentArtist) => {
            if (
              !currentPopularArtistId ||
              currentArtist.pop >
                artistIdsAndPops.find(
                  (album) => album.id === currentPopularArtistId
                ).pop
            ) {
              return currentArtist.id;
            }
            return currentPopularArtistId;
          },
          null
        );

        const { id: leastPopArtistId } = artistIdsAndPops.reduce(
          (acc, curr) => {
            return curr.pop < acc.pop ? curr : acc;
          }
        );

        artistCode.push(
          "mostLeastPopArtistIds[<=2]",
          mostPopArtistId,
          leastPopArtistId
        );

        const artistPops = artistIdsAndPops.map((item) => item.pop);
        const sumArtistPops = artistPops.reduce(
          (accumulator, current) => accumulator + current,
          0
        );
        const avgArtistPop = sumArtistPops / artistPops.length;
        const squaredDifferencesArtistPops = artistPops.map((pop) =>
          Math.pow(pop - avgArtistPop, 2)
        );
        const varianceArtistPops =
          squaredDifferencesArtistPops.reduce(
            (accumulator, current) => accumulator + current,
            0
          ) / artistPops.length;
        const artistPopStdDev = Math.sqrt(varianceArtistPops);

        artistCode.push(
          "avgArtistPop[1]",
          avgArtistPop.toFixed(2),
          "artistPopStdDev[1]",
          artistPopStdDev.toFixed(2)
        );

        artistCode.push((await artists(artistIds)).concat());

        const genresAssocWithArtists = data.items.map((item) => item.genres);
        const genresAssocWithArtistsFlat = genresAssocWithArtists.flat();
        const genreCounts = {};
        genresAssocWithArtistsFlat.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
        const sortedGenres = Object.keys(genreCounts).sort((a, b) => {
          return genreCounts[b] - genreCounts[a];
        });
        const topGenres = sortedGenres.slice(0, 20);
        artistCode.push("topGenresByArtist[<=20]", topGenres);
      } else {
        artistCode.push(
          "artistIds[<=50]",
          "No data",
          "mostLeastPopArtistIds[<=2]",
          "No data",
          "No data",
          "avgArtistPop[1]",
          "-",
          "artistPopStdDev[1]",
          "-",
          "avgArtistFolls[1]",
          "-",
          "artistFollsStdDev[1]",
          "-",
          "topGenresByArtist[<=20]",
          "No data"
        );
      }

      return artistCode;
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const artists = async (artistIds) => {
    try {
      const { data } = await axios.get("https://api.spotify.com/v1/artists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ids: artistIds.join(","),
        },
      });

      const artistFolls = data.artists.map((artist) =>
        parseInt(artist.followers.total)
      );
      const sumArtistFolls = artistFolls.reduce((accumulator, currentValue) => {
        return new Big(accumulator).plus(currentValue);
      }, new Big(0));
      const avgArtistFolls = sumArtistFolls.div(artistFolls.length);

      const squaredDiffsArtistFolls = artistFolls.map((foll) => {
        const diff = new Big(foll).minus(avgArtistFolls);
        return diff.times(diff);
      });

      const sumSquaredDiffsArtistFolls = squaredDiffsArtistFolls.reduce(
        (accumulator, currentValue) => {
          return new Big(accumulator).plus(currentValue);
        },
        new Big(0)
      );

      const avgSquaredDiffArtistFolls = sumSquaredDiffsArtistFolls.div(
        squaredDiffsArtistFolls.length
      );

      const artistFollsStdDev = avgSquaredDiffArtistFolls.sqrt();

      return [
        "avgArtistFolls[1]",
        simplifyNumber(avgArtistFolls),
        "artistFollsStdDev[1]",
        simplifyNumber(artistFollsStdDev),
      ];
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const albums = async (albumIds) => {
    try {
      let albumCode = [];

      const albumIdsAndPopsLabels = [];

      for (let i = 0; i < albumIds.length; i += 20) {
        const chunk = albumIds.slice(i, i + 20);

        const { data } = await axios.get("https://api.spotify.com/v1/albums", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: chunk.join(","),
          },
        });

        const chunkAlbums = data.albums.map((item) => ({
          id: item.id,
          pop: item.popularity,
          label: item.label,
        }));
        albumIdsAndPopsLabels.push(...chunkAlbums);
      }

      const albumIdCountMap = {};
      albumIdsAndPopsLabels.forEach((album) => {
        const id = album.id;
        albumIdCountMap[id] = albumIdCountMap[id] ? albumIdCountMap[id] + 1 : 1;
      });

      const sortedAlbumIds = Object.keys(albumIdCountMap).sort((a, b) => {
        if (albumIdCountMap[b] === albumIdCountMap[a]) {
          return (
            albumIdsAndPopsLabels.findIndex((album) => album.id === a) -
            albumIdsAndPopsLabels.findIndex((album) => album.id === b)
          );
        } else {
          return albumIdCountMap[b] - albumIdCountMap[a];
        }
      });

      albumCode.push("albumIds[<=10]", sortedAlbumIds.slice(0, 10));

      const { id: mostPopAlbumId } = albumIdsAndPopsLabels.reduce(
        (acc, curr) => {
          return curr.pop > acc.pop ? curr : acc;
        }
      );

      const { id: leastPopAlbumId } = albumIdsAndPopsLabels.reduce(
        (acc, curr) => {
          return curr.pop < acc.pop ? curr : acc;
        }
      );

      albumCode.push(
        "mostLeastPopAlbumIds[<=2]",
        mostPopAlbumId,
        leastPopAlbumId
      );

      const uniqueAlbumIds = [
        ...new Set(albumIdsAndPopsLabels.map((album) => album.id)),
      ];
      const totalAlbumPop = uniqueAlbumIds.reduce((sum, id) => {
        const album = albumIdsAndPopsLabels.find((album) => album.id === id);
        return sum + album.pop;
      }, 0);

      const avgAlbumPop = totalAlbumPop / uniqueAlbumIds.length;

      const squaredDifferencesAlbumPops = uniqueAlbumIds.reduce((sum, id) => {
        const album = albumIdsAndPopsLabels.find((album) => album.id === id);
        const difference = album.pop - avgAlbumPop;
        return sum + difference * difference;
      }, 0);

      const varianceAlbumPops =
        squaredDifferencesAlbumPops / uniqueAlbumIds.length;
      const albumPopsStdDev = Math.sqrt(varianceAlbumPops);

      albumCode.push(
        "avgAlbumPop[1]",
        avgAlbumPop.toFixed(2),
        "albumPopsStdDev[1]",
        albumPopsStdDev.toFixed(2)
      );

      const labelCounts = {};
      albumIdsAndPopsLabels.forEach((album) => {
        const { label } = album;
        labelCounts[label] = (labelCounts[label] || 0) + 1;
      });
      const sortedLabels = Object.keys(labelCounts).sort((a, b) => {
        return labelCounts[b] - labelCounts[a];
      });
      albumCode.push("topLabelsByAlbums[<=5]", sortedLabels.slice(0, 5));

      return albumCode;
    } catch (error) {
      console.error("Error:", error);
      logout("apiError");
    }
  };

  const generateCode = async () => {
    let code = await me();

    const timeRanges = ["short_term", "medium_term", "long_term"];
    for (const timeRange of timeRanges) {
      let songs = await meSongs(timeRange);
      let artists = await meArtists(timeRange);
      code.push(timeRange, songs, artists);
    }
    return code;
  };

  function getCurrentDateTime() {
    const date = new Date();

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const formattedDateTime = `$${month}-${day}-${year} ${hours}.${minutes}.${seconds} ${ampm}`;

    return formattedDateTime;
  }

  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (trigger) {
      setTrigger(true);

      const timer = setTimeout(() => {
        setTrigger(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const downloadCode = async () => {
    setLoadingDownload(true);
    window.scrollTo(0, 0);

    setTrigger(true);

    const blob = new Blob([await generateCode()], { type: "text/plain" });
    setLoadingDownload(false);

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `[comparify code] [${displayName.replace(
      /[<>:"\\|?*]/g,
      ""
    )}] @ ${getCurrentDateTime()}.txt`;
    link.click();
  };

  const toDataPage = async () => {
    if (isTokenExpired()) {
      logout();
    } else {
      setLoadingView(true);

      let code = await me();

      const timeRanges = ["short_term", "medium_term", "long_term"];
      for (const timeRange of timeRanges) {
        let songs = await meSongs(timeRange);
        let artists = await meArtists(timeRange);
        code.push(timeRange, songs, artists);
      }
      setLoadingView(false);

      navigate("/data", { state: { data: code.join(","), token: token } });
    }
  };

  const toComparePage1 = async (number) => {
    setLoadingCompare1(true);

    let code = await me();

    const timeRanges = ["short_term", "medium_term", "long_term"];
    for (const timeRange of timeRanges) {
      let songs = await meSongs(timeRange);
      let artists = await meArtists(timeRange);
      code.push(timeRange, songs, artists);
    }
    setLoadingCompare1(false);

    navigate("/compare", {
      state: { file1: code.join(","), file2: file2, token: token },
    });
  };

  const toComparePage2 = async (number) => {
    setLoadingCompare2(true);

    let code = await me();

    const timeRanges = ["short_term", "medium_term", "long_term"];
    for (const timeRange of timeRanges) {
      let songs = await meSongs(timeRange);
      let artists = await meArtists(timeRange);
      code.push(timeRange, songs, artists);
    }
    setLoadingCompare2(false);

    navigate("/compare", {
      state: { file1: file1TwoComp, file2: file2TwoComp, token: token },
    });
  };

  const [file2, setFile2] = useState("");

  const addFile2 = (event) => {
    if (event.target.files.length === 0) {
      setFile2(null);
    } else {
      const fileReader = new FileReader();
      const { files } = event.target;

      fileReader.readAsText(files[0], "UTF-8");
      fileReader.onload = (e) => {
        const content = e.target.result;
        setFile2(content);
      };
    }
  };

  const [file1TwoComp, setFile1TwoComp] = useState("");
  const [file2TwoComp, setFile2TwoComp] = useState("");

  const addFile1TwoComp = (event) => {
    if (event.target.files.length === 0) {
      setFile1TwoComp(null);
    } else {
      const fileReader = new FileReader();
      const { files } = event.target;

      fileReader.readAsText(files[0], "UTF-8");
      fileReader.onload = (e) => {
        const content = e.target.result;
        setFile1TwoComp(content);
      };
    }
  };

  const addFile2TwoComp = (event) => {
    if (event.target.files.length === 0) {
      setFile2TwoComp(null);
    } else {
      const fileReader = new FileReader();
      const { files } = event.target;

      fileReader.readAsText(files[0], "UTF-8");
      fileReader.onload = (e) => {
        const content = e.target.result;
        setFile2TwoComp(content);
      };
    }
  };

  useEffect(() => {
    if (token) {
      me();
    }
  }, [token]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    let expirationTime = window.localStorage.getItem("expirationTime");

    if ((!token || !expirationTime) && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      let expiresIn = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("expires_in"))
        .split("=")[1];
      expirationTime = new Date().getTime() + parseInt(expiresIn) * 1000;

      window.history.replaceState(
        null,
        null,
        window.location.pathname + window.location.search
      );
      window.location.hash = "";
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("expirationTime", expirationTime);
    }

    setToken(token);
    setExpirationTime(expirationTime);

    if (isTokenExpired()) {
      logout();
    }
  }, [downloadCode, toDataPage, toComparePage1, toComparePage2]);

  function clearCookies() {
    var cookies = document.cookie.split(";");
    console.log(cookies);

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }
  }

  return (
    <div className="codePage">
      <button
        className={"defaultBtn"}
        onClick={()=>navigate('/')}
        title="Log in"
      >
        <img
          src={logo}
          className="appLogo"
          alt="logo"
          style={{
            position: "absolute",
            top: "20px",
            left: "30px",
            width: "60px",
            pointerEvents:'all'
          }}
        />
        <div className="logoDiv"></div>
      </button>
      <h1 className="logoName">comparify</h1>
      <div
        className="betaIcon"
        // onClick={handleClickBETA}
        // style={{ cursor: "pointer" }}
        style={{ marginLeft:'20px' }}
      >
        beta
      </div>
      {location.state?.error && location.state.error === 400 && (
        <div className="errorMessage2">
          code error. make sure the file you uploaded is a valid comparify code.
        </div>
      )}
      {trigger && (
        <div className="errorMessage3">
          remember that your code contains your Spotify display name, ID,
          profile photo, and music streaming data. only share your code with
          people you are comfortable with having that information.
        </div>
      )}
      <div className="cardOverlay">
        <div className="homeBtnDiv">
          <button
            title="Back"
            className="homeBtn"
            onClick={logout}
            data-tooltip-id="codePageTooltip1"
            data-tooltip-content="Home"
          >
            <img
              src={back}
              className="backImgCodePage"
              alt="Home button arrow"
              style={{cursor:'pointer'}}
            ></img>
          </button>

          <button
            title="Switch user"
            className="homeBtn"
            onClick={switchUser}
            data-tooltip-id="codePageTooltip1"
            data-tooltip-content="Switch user"
          >
            <img
              src={switchUserImg}
              className="backImgCodePage"
              alt=""
              style={{cursor:'pointer'}}
            ></img>
          </button>
        </div>
        <div className="profilePicDivCodePage">
          {profilePicUrl && (
            <img
              src={profilePicUrl}
              className="profilePicImgCodePage"
              data-tooltip-id="codePageTooltip1"
              data-tooltip-content={displayName}
              alt={displayName}
            />
          )}
        </div>

        <div className="codeDiv" style={{ display: 'flex', justifyContent: 'center'}}>
        {!loadingDownload ? (
          <button
            onClick={downloadCode}
            className="basicBtn downloadCodeBtnCodePage"
            // data-tooltip-id="codePageTooltip1"
            title = "Download your code to share it"
            disabled={loadingDownload || loadingView || loadingCompare1 || loadingCompare2}
            style={{ display: 'flex', alignItems: 'center', width: 'fit-content', padding: '2px 10px' }}
          >
            <img src={downloadBlue} style={{width:'20px'}}/>  <span style={{ marginLeft: '5px' }}>save your code</span>
          </button>
           ): (
            <>
            <div style={{height: '25px'}}>
              </div>
            <div className="loadingDots" style={{marginTop: '80px'}}>
              <div className="loadingDots--dot"></div>
              <div className="loadingDots--dot"></div>
              <div className="loadingDots--dot"></div>
            </div></>
          )}
        </div>
        <div className="codeDiv " style={{ display: 'flex', justifyContent: 'center' }}>
          {!loadingView ? (
        <button
  className="basicBtn"
  // data-tooltip-id="codePageTooltip1"
  title="View your data by itself"
  disabled={loadingView || loadingDownload || loadingCompare1 || loadingCompare2}
  onClick={() => {
    toDataPage();
  }}
  style={{ display: 'flex', alignItems: 'center', width: 'fit-content', padding: '2px 10px' }}
>
  <img src={dashboard} style={{ width: '20px' }} />
  <span style={{ marginLeft: '5px' }}>view your data</span>
</button>
) : (

          
            <div className="loadingDots" >
              <div className="loadingDots--dot"></div>
              <div className="loadingDots--dot"></div>
              <div className="loadingDots--dot"></div>
            </div>
          )}
        </div>
        {/* <h4 className="grayText">or</h4> */}
        <div className="separator" style={{color:'gray', fontWeight:'bold', marginBottom:'30px'}}>or</div>

        <div>
          <h2 className="gradient compareNameCodePage" style={{fontFamily:'gothamMedium'}}>compare</h2>
        </div>
        <div className="uploadBtn1">
          <input
            data-tooltip-id="codePageTooltip1"
            data-tooltip-content="upload the code for the user you want to compare with"
            type="file"
            accept=".txt"
            onChange={addFile2}
          />
          <span className="codeDiv">
            {!loadingCompare1 && (
              <span
                title="Submit"
                className={!file2 ? "submitBtn disabled": "submitBtn"}
                // disabled={!file2}
                onClick={() => {
                  toComparePage1();
                }}
               
              >
                submit  &#8594;
              </span>
            )}
            {loadingCompare1 && (
              <button
                title="Submit"
                className="submitBtnWhite"
                disabled={!file2}
                onClick={() => {
                  toComparePage1();
                }}
              >
                <div className="loadingDots">
                  <div className="loadingDots--dot"></div>
                  <div className="loadingDots--dot"></div>
                  <div className="loadingDots--dot"></div>
                </div>
              </button>
            )}
          </span>
        </div>
        <div className="uploadBtn2">
          <input
            type="file"
            data-tooltip-id="codePageTooltip1"
            data-tooltip-content="upload the code for the first user you want to compare with"
            accept=".txt"
            onChange={addFile1TwoComp}
          />
          <input
            type="file"
            data-tooltip-id="codePageTooltip1"
            data-tooltip-content="upload the code for the second user you want to compare with"
            accept=".txt"
            onChange={addFile2TwoComp}
            style={{marginLeft:'20px'}}
          />
          {!loadingCompare2 && (
            <span
              className={!file1TwoComp || !file2TwoComp ? "submitBtn disabled" : "submitBtn"}
              // disabled=
              onClick={() => {
                toComparePage2();
              }}
              style={{}}
            >
              submit  &#8594;
            </span>
          )}
          {loadingCompare2 && (
            <button
              className="submitBtnWhite"
              disabled={!file1TwoComp || !file2TwoComp}
              onClick={() => {
                toComparePage2();
              }}
            >
              <span className="loadingDots">
                <div className="loadingDots--dot"></div>
                <div className="loadingDots--dot"></div>
                <div className="loadingDots--dot"></div>
              </span>
            </button>
          )}
        </div>

        <Tooltip id="codePageTooltip1" className="tooltip1"  noArrow/>
      </div>
      <Footer />
    </div>
  );
}

export default Code;
