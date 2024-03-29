import Big from "big.js";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router";
import { Tooltip } from "react-tooltip";
import axios from "axios";
import Footer from "./Footer";
import "./App.css";
import back from "./img/back.png";
import defaultProfile from "./img/defaultProfile.jpeg";
import switchUserImg from "./img/switchUser.png";
// import logo from "./img/logo.png"
import downloadBlue from "./img/downloadBlue.png";
import dashboard from "./img/dashboard.png";
import fullLogo from "./img/fullLogo.png";
import uploadYellow from "./img/uploadYellow.png";
import uploadBlue from "./img/uploadBlue.png";
import arrow from "./img/rightArrow.png";
// import bg from "./img/bg.png"
import Spline from "@splinetool/react-spline";

function Code() {
  // const pageTitle = `${"hello"}`;
  // document.title = "comparify | Dashboard";

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
    setToken("");
    setExpirationTime("");
    window.localStorage.removeItem("token");
    if (error === "apiError") {
      // window.localStorage.removeItem("expirationTime"); //
      navigate("/", { state: { [error]: true } });
    } else {
      window.localStorage.removeItem("expirationTime");
      navigate("/");
    }
  };

  const switchUser = () => {
    const CLIENT_ID = "7dd115970ec147b189b17b258f7e9a6f";
    // const REDIRECT_URI = "http://localhost:3000/dashboard";
    const REDIRECT_URI = "https://comparify.app/dashboard";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPES =
      "user-top-read playlist-modify-public ugc-image-upload user-library-read user-follow-read user-read-currently-playing user-read-playback-position user-read-playback-state user-read-recently-played playlist-read-private";

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
        songCode.push("pctSongsExpl[1]", pctSongsExpl.toFixed(2));

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
        // const topGenres = sortedGenres.slice(0,5);

        const totalGenres = sortedGenres.length;

        const topGenres = [];
        let totalPercentage = 0;
        const topGenresCount = Math.min(5, totalGenres);

        for (let i = 0; i < topGenresCount; i++) {
          const genre = sortedGenres[i];
          const percentage = (
            (genreCounts[genre] / genresAssocWithArtistsFlat.length) *
            100
          ).toFixed(2);
          topGenres.push(genre, percentage);
          totalPercentage += parseFloat(percentage);
        }

        topGenres.push("other", (100 - totalPercentage).toFixed(2));

        artistCode.push("topGenresOnly[<=20]", sortedGenres.slice(0, 20));

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

    const formattedDateTime = `${month}-${day}-${year} at ${hours}.${minutes}.${seconds} ${ampm}`;

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
    link.download = `comparify code (${displayName.replace(
      /[<>:"\\|?*]/g,
      ""
    )}) ${getCurrentDateTime()}.txt`;
    link.click();
  };

  const toDataPage = async () => {
    if (isTokenExpired()) {
      logout("apiError");
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

  const [filename1, setFilename1] = useState(null);
  const [filename2, setFilename2] = useState(null);
  const [filename3, setFilename3] = useState(null);

  const [file2, setFile2] = useState("");

  const addFile2 = (event, defaultMessage) => {
    const fileInput = event.target;
    const fileExists = fileInput?.files.length > 0;
    const fileNameIsValid =
      fileInput?.files[0]?.name.substring(0, 14) === "comparify code";

    const labelElement = document.getElementById("inputLabel1");

    if (fileExists && fileNameIsValid) {
      labelElement.classList.add("valid");
      setFilename1(fileInput?.files[0].name);
      const fileReader = new FileReader();

      fileReader.readAsText(fileInput?.files[0], "UTF-8");
      fileReader.onload = (e) => {
        const content = e.target.result;
        setFile2(content);
      };
    } else if (!fileNameIsValid) {
      labelElement.classList.remove("valid");
      setFilename1("Invalid comparify code. Try again.");
      setFile2(null);
    } else {
      labelElement.classList.remove("valid");
      setFilename1(null);
      setFile2(null);
    }
  };

  const [file1TwoComp, setFile1TwoComp] = useState("");
  const [file2TwoComp, setFile2TwoComp] = useState("");

  const addFile1TwoComp = (event) => {
    const fileInput = event.target;
    const isValid = fileInput.files.length > 0; // Check if there is at least one file selected

    const labelElement = document.getElementById("inputLabel2");
    if (isValid) {
      labelElement.classList.add("valid");
      setFilename2(fileInput.files[0].name);
    } else {
      labelElement.classList.remove("valid");
      setFilename2(null);
    }

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
    const fileInput = event.target;
    const isValid = fileInput.files.length > 0; // Check if there is at least one file selected

    const labelElement = document.getElementById("inputLabel3");
    if (isValid) {
      labelElement.classList.add("valid");
      setFilename3(fileInput.files[0].name);
    } else {
      labelElement.classList.remove("valid");
      setFilename3(null);
    }

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
      logout("apiError");
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

  // const handleFileChange = (event) => {
  //   const fileName = event.target.files[0]?.name;
  //   const label = document.querySelector("label[for=files]");
  //   label.innerText = fileName ?? "Browse Files";
  // };
  return (
    // <div className="codePage" style={{ backgroundImage: `url("${bg}") `}}>
    <div className="codePage">
      <Link to="/">
        <img
          draggable={false}
          alt=""
          src={fullLogo}
          style={{
            width: "175px",
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "white",
            padding: "4px",
            borderRadius: "20px",
            WebkitUserDrag: "none",
          }}
          onContextMenu={(event) => event.preventDefault()}
          draggable={false}
        />
      </Link>

      {location.state?.error && location.state.error === 400 && (
        <div className="errorMessage2">
          Code error. Make sure the file you uploaded is a valid comparify code.
        </div>
      )}
      {trigger && (
        <div className="errorMessage3">
          Your code contains your Spotify display name, ID, profile photo, and
          streaming data. Only share your code with people you are comfortable
          with having that information.
        </div>
      )}
      <div className="cardOverlay" style={{ background: "white" }}>
        <div className="homeBtnDiv">
          <button
            className="homeBtn"
            onClick={logout}
            data-tooltip-id="codePageTooltip1"
            data-tooltip-content="Home"
          >
            <img
              draggable={false}
              src={back}
              className="backImgCodePage"
              alt="Home button arrow"
              style={{ cursor: "pointer" }}
              onContextMenu={(event) => event.preventDefault()}
            ></img>
          </button>

          <button
            className="homeBtn"
            onClick={switchUser}
            data-tooltip-id="codePageTooltip1"
            data-tooltip-content="Switch user"
          >
            <img
              draggable={false}
              src={switchUserImg}
              className="backImgCodePage"
              alt=""
              style={{ cursor: "pointer" }}
              onContextMenu={(event) => event.preventDefault()}
            ></img>
          </button>
        </div>
        <div
          className="grayHeader titleDiv"
          data-tooltip-id="dashboardTitleTooltip"
        >
          Dashboard
        </div>
        <div className="profilePicDivCodePage">
          {profilePicUrl && (
            <img
              draggable={false}
              src={profilePicUrl}
              className="profilePicImgCodePage"
              data-tooltip-id="codePageTooltip1"
              data-tooltip-content={displayName}
              alt={displayName}
              onContextMenu={(event) => event.preventDefault()}
            />
          )}
        </div>

        <div
          className="codeDiv"
          style={{ display: "flex", justifyContent: "center" }}
          // style={{color:'#1e90ff',marginTop:'-20px'}}
        >
          {/* <h2
            // className="gradient compareNameCodePage"
            style={{ fontFamily: "gothamMedium",margin:'10px 10px' }}
          >
            you
          </h2> */}

          {!loadingDownload ? (
            <button
              onClick={downloadCode}
              className="basicBtn downloadCodeBtnCodePage pop"
              // data-tooltip-id="codePageTooltip1"
              disabled={
                loadingDownload ||
                loadingView ||
                loadingCompare1 ||
                loadingCompare2
              }
              style={{
                display: "flex",
                alignItems: "center",
                width: "fit-content",
                padding: "4px",
                fontFamily: "gothamMedium",
              }}
            >
              <img
                draggable={false}
                alt=""
                src={downloadBlue}
                style={{ width: "20px" }}
                // draggable={false}
                onContextMenu={(event) => event.preventDefault()}
              />{" "}
              <span style={{ marginLeft: "5px" }}>save your code</span>
            </button>
          ) : (
            <>
              <div style={{ height: "25px" , marginTop:'25px'}}></div>
              <div className="loadingDots">
                <div className="loadingDots--dot"></div>
                <div className="loadingDots--dot"></div>
                <div className="loadingDots--dot"></div>
              </div>
            </>
          )}
        </div>
        <div
          className="codeDiv "
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "-25px",
          }}
        >
          {!loadingView ? (
            <button
              className="basicBtn padded viewdatabtn pop"
              // data-tooltip-id="codePageTooltip1"
              disabled={
                loadingView ||
                loadingDownload ||
                loadingCompare1 ||
                loadingCompare2
              }
              onClick={() => {
                toDataPage();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                width: "fit-content",
                // padding: "2px 10px",
                fontFamily: "gothamMedium",
              }}
            >
              <img
                draggable={false}
                src={dashboard}
                style={{ width: "20px" }}
                alt=""
                onContextMenu={(event) => event.preventDefault()}
              />
              <span style={{ marginLeft: "5px" }} className="viewtxt">view your data</span>
            </button>
          ) : (
            <div className="loadingDots" style={{marginTop:'30px'}}>
              <div className="loadingDots--dot"></div>
              <div className="loadingDots--dot"></div>
              <div className="loadingDots--dot"></div>
            </div>
          )}
        </div>
        {/* <h4 className="grayText">or</h4> */}
        <div
          className="separator"
          style={{ color: "gray", fontWeight: "bold", marginBottom: "30px" }}
        >
          <img
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
            alt=""
            src={arrow}
            style={{
              width: "20px",
              transform: "rotate(90deg)",
              verticalAlign: "middle",
            }}
          />
        </div>

        <div>
          <h2
            className="gradient compareNameCodePage"
            style={{ fontFamily: "gothamMedium" }}
          >
            compare
          </h2>
        </div>
        <div className="uploadBtn1">
          {/* <input
            data-tooltip-id="codePageTooltip1"
            data-tooltip-content="upload the code for the user you want to compare with"
            type="file"
            accept=".txt"
            onChange={addFile2}
            className="yellowUpload"
           
          /> */}

          <label
            htmlFor="input1"
            className="custom-file-upload yellow"
            id="inputLabel1"
            data-tooltip-id="codePageTooltip2"
            data-tooltip-content={
              filename1
                ? filename1
                : "upload the code for the user you want to compare with"
            }
          >
            <img
              draggable={false}
              src={uploadYellow}
              alt=""
              className="upload-icon"
              onContextMenu={(event) => event.preventDefault()}
            />

            {/* {!filename1 ?(
  <img
  draggable={false} src={uploadYellow} alt="" className="upload-icon"/>
  ): (

  <Spline scene="  https://prod.spline.design/9ZMBMIvwXQbw3nge/scene.splinecode
  " className=""/>)} */}
          </label>
          <input
            id="input1"
            type="file"
            accept=".txt"
            onChange={addFile2}
            style={{ display: "none" }}
            disabled={
              loadingDownload ||
              loadingView ||
              loadingCompare1 ||
              loadingCompare2
            }
          />

          <span className="codeDiv">
            {!loadingCompare1 && (
              <span
                className={
                  loadingDownload || loadingView || !file2
                    ? "submitBtn disabled padded"
                    : "submitBtn padded"
                }
                // disabled={!file2}
                onClick={() => {
                  toComparePage1();
                }}
              >
                submit <img
            alt=""
            src={arrow}
            className="arrow"
            style={{ width: "15px", verticalAlign: "middle" }}
            onContextMenu={(event) => event.preventDefault()}
          />
              </span>
            )}
            {loadingCompare1 && (
              <button
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
          <label
            htmlFor="input2"
            className="custom-file-upload blue"
            id="inputLabel2"
            data-tooltip-id="codePageTooltip2"
            data-tooltip-content={
              filename2
                ? filename2
                : "upload the code for the first user you want to compare"
            }
          >
            {/* {!filename2 ?(
  <img
  draggable={false} src={uploadBlue} alt="" className="upload-icon"/>): (

  <Spline scene="https://prod.spline.design/VoTdUUTH5eD1FEIg/scene.splinecode" className=""/>)} */}
            <img
              draggable={false}
              src={uploadBlue}
              alt=""
              className="upload-icon"
              onContextMenu={(event) => event.preventDefault()}
            />
          </label>
          <input
            disabled={
              loadingDownload ||
              loadingView ||
              loadingCompare1 ||
              loadingCompare2
            }
            type="file"
            accept=".txt"
            onChange={addFile1TwoComp}
            id="input2"
            style={{ display: "none" }}
          />

          <label
            htmlFor="input3"
            className="custom-file-upload yellow"
            id="inputLabel3"
            data-tooltip-id="codePageTooltip2"
            data-tooltip-content={
              filename3
                ? filename3
                : "upload the code for the second user you want to compare"
            }
          >
            <img
              draggable={false}
              src={uploadYellow}
              alt=""
              className="upload-icon"
              onContextMenu={(event) => event.preventDefault()}
            />
            {/* {!filename3 ?(
  <img
  draggable={false} src={uploadYellow} alt="" className="upload-icon"/>
  ): (

  <Spline scene="  https://prod.spline.design/9ZMBMIvwXQbw3nge/scene.splinecode
  " className=""/>)} */}
          </label>
          <input
            disabled={
              loadingDownload ||
              loadingView ||
              loadingCompare1 ||
              loadingCompare2
            }
            type="file"
            accept=".txt"
            onChange={addFile2TwoComp}
            // style={{marginLeft:'20px'}}

            id="input3"
            style={{ display: "none", marginLeft: "20px" }}
          />
          {!loadingCompare2 && (
            <span
              className={
                loadingDownload || loadingView || !file1TwoComp || !file2TwoComp
                  ? "submitBtn disabled padded"
                  : "submitBtn padded"
              }
              // disabled=
              onClick={() => {
                toComparePage2();
              }}
              style={{}}
            >
              submit<img
            alt=""
            src={arrow}
            className="arrow"
            style={{ width: "15px", verticalAlign: "middle" }}
            onContextMenu={(event) => event.preventDefault()}
          />
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

        <Tooltip id="codePageTooltip1" className="tooltip1" noArrow clickable />
        <Tooltip
          id="codePageTooltip2"
          className="tooltipUpload"
          noArrow
          clickable
        />
      </div>
      <div style={{position:'absolute', bottom:'0px', left: '50%',
  transform: 'translateX(-50%)'}}>
    {/* <Footer /> */}
    </div>
      
    </div>
  );
}

export default Code;
