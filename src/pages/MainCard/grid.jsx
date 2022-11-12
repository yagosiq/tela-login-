import { MainCard } from ".";
import Grid from "@mui/material/Grid";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CircularIndeterminate from "./loading";

export const GridMovie = () => {
  const [movies, setMovies] = useState([]);
  const [movie, setMovie] = useState([]);
  const [wanted_movie, setWanted_movie] = useState("");
  useEffect(() => {
    if (movies.length === 0) {
      axios
        .get("http://localhost:3333/cold_start", {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          localStorage.setItem("cold_start", res.data.movie_info);
          setMovies(res.data.movie_info);
        });
    }
  }, [wanted_movie]);

  const handleSearchMovie = async (wanted_movie) => {
    setMovies("");
    setMovie("");
    await axios
      .post(
        "http://localhost:3333/content_based",
        { movie_name: wanted_movie },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        console.log(res.data);
        if (res) {
          setMovies(res.data.rec.recommendation);
          setMovie(res.data.rec.wanted_movie);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Grid container spacing={3} align="center">
        <Grid item xs={11}>
          <div className="wrap-input">
            <input
              className={wanted_movie !== "" ? "has-val input" : "input"}
              type="text"
              value={wanted_movie}
              onChange={(e) => setWanted_movie(e.target.value)}
            />
            <span
              className="focus-input"
              data-placeholder="Buscar por um filme"
            ></span>
          </div>
        </Grid>
        <Grid item xs={1}>
          <div className="container-login-form-btn">
            <button
              type="button"
              className="login-form-btn"
              onClick={() => handleSearchMovie(wanted_movie)}
            >
              Buscar
            </button>
          </div>
        </Grid>
        {movies.length === 0 && (
          <Grid item xs={12} align="center">
            <CircularIndeterminate />
          </Grid>
        )}
        {Object.values(movie).map((m, i) => {
          console.log(m);
          return (
            <Grid item xs={3}>
              <MainCard movie_data={m} />
            </Grid>
          );
        })}
        {Object.values(movies).map((movie, i) => {
          console.log(movie);
          return (
            <Grid item xs={3}>
              <MainCard movie_data={movie} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};
