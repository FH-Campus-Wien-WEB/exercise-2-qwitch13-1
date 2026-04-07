/* Task 1.1. Add your movie data here 
   and export it so it"'s available in _e1_server.js */
/**
 * movie-model.js — The data layer of our application.
 *
 * This module stores all movie data in a single JavaScript object (not an array).
 * The KEY of each entry is the movie"'s imdbID (e.g. "tt0133093").
 * The VALUE is the full movie object with all its properties.
 *
 * WHY an object instead of an array?
 *   - Looking up a movie by its imdbID is O(1) — just "movies[imdbID]".
 *   - With an array you would need to loop through every element to find one movie.
 *   - Adding or replacing a movie is also O(1) — just "movies[imdbID] = newData".
 *
 * We use "module.exports" to make this object available to other files.
 * In server.js the import "require("'./movie-model.js"')" gives back exactly
 * what we assign to "module.exports" here.
 */

const movies = {

    /* ── Movie 1: Origin ─────────────────────────────────────────── */
    tt21064584: {
        imdbID: "tt21064584",
        Title: "Origin",
        Released: "2024-01-19",       // ISO 8601 date format (YYYY-MM-DD)
        Runtime: 141,                 // number, not "141 min"
        Genres: ["Drama", "History"], // array, not "Drama, History"
        Directors: ["Ava DuVernay"],
        Writers: ["Ava DuVernay", "Isabel Wilkerson"],
        Actors: ["Aunjanue Ellis-Taylor", "Jon Bernthal", "Niecy Nash"],
        Plot: "The unspoken system that has shaped America and chronicles how lives today are defined by a hierarchy of human divisions.",
        Poster: "https://m.media-amazon.com/images/M/MV5BMmE5YTBlMDAtZDFjZi00NjQ5LWJkNWUtMzJhMmYzYWQyZDA4XkEyXkFqcGc@._V1_SX300.jpg",
        Metascore: 75,                // number, not "75"
        imdbRating: 7.2               // number, not "7.2"
    },

    /* ── Movie 2: HyperNormalisation ─────────────────────────────── */
    tt6156350: {
        imdbID: "tt6156350",
        Title: "HyperNormalisation",
        Released: "2016-10-16",
        Runtime: 166,
        Genres: ["Documentary"],
        Directors: ["Adam Curtis"],
        Writers: ["Adam Curtis"],
        Actors: ["Adam Curtis", "Donald Trump", "Vladimir Putin"],
        Plot: "Adam Curtis explains how, at a time of confusing and inexplicable world events, politicians and the people they represent have retreated in to a damaging over-simplified version of what is happening.",
        Poster: "https://m.media-amazon.com/images/M/MV5BYzFlMjZlNTUtMWIwZi00NGY3LTljMTctZDk3MDIwZGVhMmQ5XkEyXkFqcGc@._V1_SX300.jpg",
        Metascore: 0,
        imdbRating: 8.2
    },

    /* ── Movie 3: The Matrix ─────────────────────────────────────── */
    tt0133093: {
        imdbID: "tt0133093",
        Title: "The Matrix",
        Released: "1999-03-31",
        Runtime: 136,
        Genres: ["Action", "Sci-Fi"],
        Directors: ["Lana Wachowski", "Lilly Wachowski"],
        Writers: ["Lilly Wachowski", "Lana Wachowski"],
        Actors: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
        Plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
        Poster: "https://m.media-amazon.com/images/M/MV5BN2NmN2VhMTQtMDNiOS00NDlhLTliMjgtODE2ZTY0ODQyNDRhXkEyXkFqcGc@._V1_SX300.jpg",
        Metascore: 73,
        imdbRating: 8.7
    }
};

/**
 * module.exports — Node.js mechanism for sharing code between files.
 *
 * Whatever you assign to "module.exports" becomes the return value
 * of "require(./movie-model.js"')" in any other file.
 * Here we export the entire "movies" object so server.js can read
 * and modify it.
 */
module.exports = movies;
