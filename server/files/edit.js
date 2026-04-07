/**
 * edit.js — Client-side script for the movie edit page (edit.html).
 *
 * This file runs IN THE BROWSER.
 * It does three things:
 *   1. Reads the imdbID from the URL query parameter
 *   2. Fetches that movie's data from the server and fills the form
 *   3. Provides putMovie() to send the edited data back to the server
 */


/**
 * setMovie(movie) — Fills every form field with values from a movie object.
 *
 * HOW IT WORKS:
 *   "document.forms[0]" gives the first <form> element on the page.
 *   ".elements" is a collection of all form controls (inputs, selects, etc.).
 *   We loop through them, match each element's "id" to a property in the
 *   movie object, and set the value.
 *
 *   Special case: the <select multiple> for Genres. We can't just set .value
 *   because multiple options can be selected. Instead we loop through each
 *   <option> and set option.selected = true if the genre is in the array.
 */

function setMovie(movie) {
  for (const element of document.forms[0].elements) {
    const name = element.id;
    const value = movie[name];

    if (name === "Genres") {
      const options = element.options;
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        option.selected = value.indexOf(option.value) >= 0;
      }
    } else {
      element.value = value;
    }
  }
}

/**
 * getMovie() — Reads all form fields and builds a movie object.
 *
 * This is the inverse of setMovie(). It reads the current form state
 * and returns a plain JavaScript object like:
 *   { imdbID: "tt0133093", Title: "The Matrix", Runtime: 136, ... }
 *
 * Special handling:
 *   - Genres:   collects all selected <option> values into an array
 *   - Runtime, Metascore, imdbRating: converts strings to numbers via Number()
 *   - Directors, Writers, Actors: splits the comma-separated string into an array
 *     and trims whitespace from each name
 */
function getMovie() {
  const movie = {};

  /**
   * Array.from() converts the HTMLCollection into a real array so we can
   * use .filter(). We filter to only elements that have an id, skipping
   * any unnamed controls (like buttons without an id).
   */
  const elements = Array.from(document.forms[0].elements).filter(
    (element) => element.id,
  );

  for (const element of elements) {
    const name = element.id;

    let value;

    if (name === "Genres") {      // Collect all selected genre options into an array
      value = [];
      const options = element.options;
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        if (option.selected) {
          value.push(option.value);
        }
      }
    } else if (
      name === "Metascore" ||
      name === "Runtime" ||
      name === "imdbRating"
    ) {
      value = Number(element.value); // Convert numeric fields from string to number
    } else if (
      name === "Actors" ||
      name === "Directors" ||
      name === "Writers"
    ) {
      /**
       * Split "Lana Wachowski, Lilly Wachowski" into ["Lana Wachowski", "Lilly Wachowski"].
       * .split(",") breaks the string at every comma.
       * .map(item => item.trim()) removes leading/trailing whitespace from each piece.
       */
      value = element.value.split(",").map((item) => item.trim());
    } else {
      value = element.value;
    }

    movie[name] = value;
  }

  return movie;
}
/**
 * putMovie() — Sends the edited movie data to the server via HTTP PUT.
 *
 * This function is called when the user clicks the "Save" button.
 *
 * STEP BY STEP:
 *   1. getMovie() reads all form fields into a JavaScript object
 *   2. We create a new XMLHttpRequest
 *   3. xhr.open("PUT", "/movies/" + movie.imdbID)  >> configure the request
 *   4. xhr.setRequestHeader(...)  >> tell the server we're sending JSON
 *   5. xhr.onload = ...  >> define what happens when the server responds
 *   6. xhr.send(JSON.stringify(movie))  >> convert the object to a JSON string and send it
 *
 * JSON.stringify() is the opposite of JSON.parse():
 *   JSON.parse:     string >> object    (reading)
 *   JSON.stringify:  object >> string    (writing)
 *
 * xhr.setRequestHeader("Content-Type", "application/json")
 *   This HTTP header tells the server: "the body of this request is JSON".
 *   Without it, the server's bodyParser.json() wouldn't know how to parse it,
 *   and req.body would be undefined.
 */
function putMovie() {
  /* Task 3.3. 
    - Get the movie data using getMovie()
    - Configure the XMLHttpRequest to make a PUT to /movies/:imdbID
    - Set the 'Content-Type' appropriately for JSON data
    - Configure the function below as the onload event handler
    - Send the movie data as JSON
  */

  const xhr = new XMLHttpRequest();

  const movie = getMovie();

  xhr.open("PUT", "/movies/" + movie.imdbID);

  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    if (xhr.status === 200 || xhr.status === 204) { // reason for:  "==" - fixed it  if (xhr.status == 200 || xhr.status === 204) {

      /** Success >> navigate back to the overview page */
      location.href = "index.html";
    } else {
      alert("Saving of movie data failed. Status code was " + xhr.status);
    }
  };
  /**
   * JSON.stringify(movie) converts the JavaScript object into a JSON string.
   * xhr.send() transmits that string as the body of the PUT request.
   */
  xhr.send(JSON.stringify(movie));
}

/** Loading and setting the movie data for the movie with the passed imdbID */
const imdbID = new URLSearchParams(window.location.search).get("imdbID");

const xhr = new XMLHttpRequest();
xhr.open("GET", "/movies/" + imdbID);
xhr.onload = function () {
  if (xhr.status === 200) {
    setMovie(JSON.parse(xhr.responseText));
  } else {
    alert(
      "Loading of movie data failed. Status was " +
        xhr.status +
        " - " +
        xhr.statusText,
    );
  }
};

xhr.send();

