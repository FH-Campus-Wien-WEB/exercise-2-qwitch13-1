/**
 * server.js — the entry point of our Node.js web server.
 *
 * this file sets up an Express server that:
 *   1. serves static files (HTML, CSS, JS) from the "files" directory
 *   2. provides a REST API with three endpoints:
 *      - GET  /movies          >> returns ALL movies as a JSON array
 *      - GET  /movies/:imdbID  >> returns ONE movie by its imdbID
 *      - PUT  /movies/:imdbID  >> updates or creates a movie
 *
 * what is express?
 *   Express is a minimal web framework for Node.js. it handles incoming
 *   HTTP requests and lets us define "endpoints" — combinations of an
 *   HTTP method (GET, PUT, POST, DELETE) and a URL path (/movies, etc.).
 *
 * what is require()?
 *   Node.js"s way of importing modules (libraries or your own files).
 *   "require("express")" loads the Express library from node_modules.
 *   "require("./movie-model.js")" loads our local movie data file.
 */

const express = require("express");
const path = require("path");

/**
 * body-parser is middleware that reads the raw bytes of an incoming
 * request body and converts them into a usable JavaScript object.
 *
 * middleware is a function that runs on every incoming HTTP request
 * before your endpoint handlers see it.
 *
 * without it, "req.body" would be "undefined" for PUT/POST requests.
 * we use "bodyParser.json()" which specifically parses bodies where
 * the Content-Type header is "application/json".
 */
const bodyParser = require("body-parser");

/**
 * import our movie data. because movie-model.js uses "module.exports",
 * "movieModel" now holds the exact same object — an object keyed by imdbID.
 * any changes we make to "movieModel" here persist in memory (until the
 * server restarts), because Node.js caches the module.
 */
const movieModel = require("./movie-model.js");

/** create an Express application instance. */
const app = express();


// Parse urlencoded bodies
/**
 * app.use() registers "middleware" — functions that run on EVERY incoming
 * request BEFORE our endpoint handlers see it.
 *
 * bodyParser.json() reads the request body, parses the JSON string into
 * a JavaScript object, and attaches it to "req.body".
 *
 * client sends:
 * send(JSON.stringify({ Title: "The Matrix", Runtime: 136 }))
 * server receives it in req.body:
 * put("/movies/:imdbID", function (req, res) {
 *   const movieData = req.body;  // <<←>> the object from the client
 *   movieModel[id] = movieData;  // <<>> store it
 *   res.sendStatus(200);
 * })
 *
 */
app.use(bodyParser.json());

// Serve static content in directory "files"
/**
 * express.static() is built-in middleware that serves files from a directory.
 *
 * path.join(__dirname, "files") builds the absolute path to the "files" folder
 * next to this script. when a browser requests "/index.html", Express looks for
 * a file at server/files/index.html and sends it back.
 *
 * __dirname is a Node.js global — it is the directory of the CURRENT file.
 */
app.use(express.static(path.join(__dirname, "files")));


/**
 * endpoint: GET /movies
 * returns ALL movies as a JSON array.
 *
 * how it works:
 *   1. "movieModel" is an object like { tt0133093: {...}, tt21064584: {...} }
 *   2. "Object.values(movieModel)" extracts just the values >> an array
 *   3. "res.json(...)" converts the array to a JSON string and sends it
 *      with Content-Type: application/json
 *
 * what is "req" & "res"?
 *   req (request)  — contains everything about the incoming HTTP request
 *                     (URL, headers, body, query parameters, etc.)
 *   res (response) — provides methods to send data back to the client
 *                     (.json(), .send(), .sendStatus(), etc.)
 */
// Configure a "get" endpoint for all movies..
app.get("/movies", function (req, res) {
  /* Task 1.2. Remove the line below and return the movies from
     the model as an array */
  if(Object.keys(movieModel).length > 0){ // check if the movieModel is empty
    res.send(Object.values(movieModel)) // send the movieModel as an array
  }
  else{
    res.sendStatus(404)
  }
})

/**
 * endpoint: GET /movies/:imdbID
 * returns ONE movie identified by its imdbID.
 *
 * :imdbID is a "route parameter" — Express extracts whatever appears
 * in that URL segment and puts it in "req.params.imdbID".
 *
 * example: GET /movies/tt0133093
 *   >> req.params.imdbID === "tt0133093"
 *
 * if the movie exists in our model >> send it (status 200 is automatic).
 * if not >> respond with HTTP 404 (Not Found).
 */
// Configure a "get" endpoint for a specific movie
app.get("/movies/:imdbID", function (req, res) {
  /* Task 2.1. Remove the line below and add the
    functionality here */
  const movie = movieModel[req.params.imdbID];

  if (movie) {
    res.json(movie);
  } else {
    res.sendStatus(404);
  }
})

/* Task 3.1 and 3.2.
   - Add a new PUT endpoint
   - Check whether the movie sent by the client already exists
     and continue as described in the assignment */

/**
 * endpoint: PUT /movies/:imdbID
 * updates an existing movie OR creates a new one.
 *
 * PUT is the HTTP method for "store this data at this URL".
 * the client sends the movie object as JSON in the request body.
 * because of bodyParser.json(), we can access it via "req.body".
 *
 * two cases:
 *   1. imdbID already exists >> REPLACE the data >> respond 200 (OK)
 *   2. imdbID is new         >> ADD the data     >> respond 201 (Created)
 *      and send back the stored movie
 */
app.put("/movies/:imdbID", function (req, res) {
  const id = req.params.imdbID;
  const movieData = req.body;

  if (movieModel[id]) {
    /* movie exists >> update it */
    movieModel[id] = movieData;
    res.sendStatus(200);
  } else {
    /* movie is new >> create it */
    movieModel[id] = movieData;
    res.status(201).json(movieData);
  }
});

/**
 * app.listen(3000) tells the server to start accepting connections
 * on port 3000. a "port" is like a numbered door on your computer —
 * the browser knocks on door 3000 and this server answers.
 */
app.listen(3000)

console.log("Server now listening on http://localhost:3000/")