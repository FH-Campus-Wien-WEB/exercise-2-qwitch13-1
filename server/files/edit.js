/**
 * edit.js — client-side script for the movie edit page (edit.html).
 *
 * this file runs in the browser.
 * it does three things:
 *   1. reads the imdbid from the url query parameter
 *   2. fetches that movie's data from the server and fills the form
 *   3. provides putmovie() to send the edited data back to the server
 */


/**
 * setmovie(movie) — fills every form field with values from a movie object.
 *
 * how it works:
 *   "document.forms[0]" gives the first <form> element on the page.
 *   ".elements" is a collection of all form controls (inputs, selects, etc.).
 *   we loop through them, match each element's "id" to a property in the
 *   movie object, and set the value.
 *
 *   special case: the <select multiple> for genres. we can't just set .value
 *   because multiple options can be selected. instead we loop through each
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
 * getmovie() — reads all form fields and builds a movie object.
 *
 * this is the inverse of setmovie(). it reads the current form state
 * and returns a plain javascript object like:
 *   { imdbid: "tt0133093", title: "the matrix", runtime: 136, ... }
 *
 * special handling:
 *   - genres:   collects all selected <option> values into an array
 *   - runtime, metascore, imdbrating: converts strings to numbers via number()
 *   - directors, writers, actors: splits the comma-separated string into an array
 *     and trims whitespace from each name
 */
function getMovie() {
  const movie = {};

  /**
   * array.from() converts the htmlcollection into a real array so we can
   * use .filter(). we filter to only elements that have an id, skipping
   * any unnamed controls (like buttons without an id).
   */
  const elements = Array.from(document.forms[0].elements).filter(
    (element) => element.id,
  );

  for (const element of elements) {
    const name = element.id;

    let value;

    if (name === "Genres") {      // collect all selected genre options into an array
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
      value = Number(element.value); // convert numeric fields from string to number
    } else if (
      name === "Actors" ||
      name === "Directors" ||
      name === "Writers"
    ) {
      /**
       * split "lana wachowski, lilly wachowski" into ["lana wachowski", "lilly wachowski"].
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
 * putmovie() — sends the edited movie data to the server via http put.
 *
 * this function is called when the user clicks the "save" button.
 *
 * step by step:
 *   1. getmovie() reads all form fields into a javascript object
 *   2. we create a new xmlhttprequest
 *   3. xhr.open("put", "/movies/" + movie.imdbid)  >> configure the request
 *   4. xhr.setrequestheader(...)  >> tell the server we're sending json
 *   5. xhr.onload = ...  >> define what happens when the server responds
 *   6. xhr.send(json.stringify(movie))  >> convert the object to a json string and send it
 *
 * json.stringify() is the opposite of json.parse():
 *   json.parse:     string >> object    (reading)
 *   json.stringify:  object >> string    (writing)
 *
 * xhr.setrequestheader("content-type", "application/json")
 *   this http header tells the server: "the body of this request is json".
 *   without it, the server's bodyparser.json() wouldn't know how to parse it,
 *   and req.body would be undefined.
 */
function putMovie() {
  /* Task 3.3. 
    1 Get the movie data using getMovie()
    2 Configure the XMLHttpRequest to make a PUT to /movies/:imdbID
    3 Set the 'Content-Type' appropriately for JSON data
    4 Configure the function below as the onload event handler
    5 Send the movie data as JSON
  */

  const xhr = new XMLHttpRequest();

  const movie = getMovie(); // 1

  xhr.open("PUT", "/movies/" + movie.imdbID); // 2

  xhr.setRequestHeader("Content-Type", "application/json"); // 3

  xhr.onload = function () { // 4 already in template
    if (xhr.status === 200 || xhr.status === 204) { // reason for:  "=="? --> fixed it << original >> if (xhr.status == 200 || xhr.status === 204) {

      /** success >> navigate back to the overview page */
      location.href = "index.html";
    } else {
      alert("Saving of movie data failed. Status code was " + xhr.status);
    }
  };
  /**
   * json.stringify(movie) converts the javascript object into a json string.
   * xhr.send() transmits that string as the body of the put request.
   */
  xhr.send(JSON.stringify(movie)); //5
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

