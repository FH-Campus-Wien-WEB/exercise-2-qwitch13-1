/**
 * !!! window.onload fires after the entire page (HTML, CSS, images) has finished loading.
 * We use it to make sure the DOM is ready before we try to manipulate it. !!!
 * Detail: This runs after the entire page has loaded —
 * all HTML, images, stylesheets, and other resources are downloaded and parsed.
 * It"s a safe place to run code that needs to interact with DOM elements,
 * because you know they exist.
 **/
window.onload = function () {

  /**
   * Create a new XMLHttpRequest object — this lets us fetch data from the server
   * without reloading the page (aka AJAX).
   * The following creates an object that lets you make HTTP requests from JavaScript
   * without reloading the page.
   * It"s the older way to do AJAX (Asynchronous JavaScript and XML).
   **/
  const xhr = new XMLHttpRequest()

  /**
   * Define what happens when the server responds.
   * This sets up a callback function that runs when the server responds successfully.
   * The function body typically processes the response data.
   **/
  xhr.onload = function () {

    /**
     * [Semantic HTML] Select the <main> element — this is the primary content area of the page.
     * Screen readers use <main> to let users skip navigation and jump straight to content.
     **/
    const mainElement = document.querySelector("main")

    /**
     * Check if the server returned HTTP 200 (OK).
     * We use === (strict equality) to avoid unexpected type coercion.
     **/
    if (xhr.status === 200) {

      /**
       * The server sends movie data as a JSON string.
       * JSON.parse() converts that string into a JavaScript array of objects.
       **/
      const movies = JSON.parse(xhr.responseText)

      /**
       * Loop through each movie object in the array.
       * "index" gives us a unique number (0, 1, 2...) for each movie — used for IDs.
       **/
      movies.forEach(function (movie, index) {

        /** --- Create the movie card --- **/

        /**
         * [Semantic HTML] <article> represents a self-contained piece of content
         * (like a blog post or, in our case, a movie card).
         **/
        const article = document.createElement("article")

        /**
         * [AOM] aria-labelledby links this article to its heading element.
         * Screen readers announce the heading text when entering this article,
         * so users know which movie card they are in.
         **/
        const titleId = "movie-title-" + index
        article.setAttribute("aria-labelledby", titleId)

        /** --- Poster image --- **/

        /**
         * [Semantic HTML] <figure> wraps media content (images, diagrams, etc.)
         * that is referenced from the main text. It gives the image semantic meaning
         * beyond just being a floating <img>.
         **/
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        img.src = movie.Poster       // Sets the image URL from the movie data
        img.alt = "Poster of " + movie.Title  // The alt text is for screen readers and for when the image fails to load
        figure.appendChild(img)       // Puts the <img> inside the <figure>
        article.appendChild(figure)   // Puts the <figure> inside the <article>

        /** --- Movie title --- **/

        /**
         * [Semantic HTML] We use <h2> for movie titles because <h1> is already
         * used for the page heading ("Movies!"). This keeps the heading hierarchy
         * correct: h1 > h2 > h3. Screen readers use heading levels to build
         * a navigable outline of the page.
         **/
        const title = document.createElement("h2")
        title.id = titleId            // This ID is referenced by aria-labelledby above
        title.textContent = movie.Title
        article.appendChild(title)

        /** --- Edit button--- **/

        /**
         * [Semantic HTML] <a> with role="button" and tabindex="0"
         * to make it keyboard-accessible.
         * [AOM] The aria-label describes the button"s purpose to screen readers.
         * The href points to an edit page with the movie"s imdbID as a query parameter,
         * so the user can edit the movie data.
         **/
        const edit_btn = document.createElement("button")
        edit_btn.id = "edit-btn-" + index
        edit_btn.textContent = "Edit"
        edit_btn.className = "edit_btn" // A CSS class for styling
        edit_btn.onclick = function() {
          location.href = "edit.html?imdbID=" + movie.imdbID
        }
        edit_btn.setAttribute("aria-label", "Edit this movie") // Provides a label for screen readers

        // Create a spacer
        const spacer = document.createElement("span")
        spacer.textContent = "\t"  // Tab character

        article.appendChild(spacer)
        article.appendChild(edit_btn)

        /** --- Runtime and release date --- **/

        const meta = document.createElement("p")
        meta.className = "meta"       // A CSS class for gray, smaller text styling

        /**
         * [Semantic HTML] <time> with a datetime attribute provides a machine-readable
         * date. Browsers and assistive tech can parse "2024-01-19" even if we
         * display it differently to the user.
         **/
        meta.innerHTML = "Runtime: " + movie.Runtime + " min \u2022 Released on "
            + "<time datetime=\"" + movie.Released + "\">" + movie.Released + "</time>"
        article.appendChild(meta)

        /** --- Genre tags --- **/

        /**
         * [Semantic HTML] Using <ul> + <li> for genres instead of loose <span> elements.
         * This tells screen readers, "here is a list of 3 items," instead of just
         * reading text blobs with no structure.
         **/
        const genreList = document.createElement("ul")

        /**
         * [AOM] The aria-label gives this list a name that screen readers announce,
         * e.g., "Genres, list, 3 items." Without it, the list would be unnamed.
         **/
        genreList.setAttribute("aria-label", "Genres")

        /** These inline styles display the genre badges horizontally (overrides the default list styling). **/
        genreList.style.listStyle = "none"   // Removes the bullet points
        genreList.style.padding = "0"        // Removes the default left padding
        genreList.style.display = "flex"     // Lays out the items in a row
        genreList.style.flexWrap = "wrap"    // Wraps to the next line if needed
        genreList.style.gap = "4px"          // A small space between the badges

        /** Creates one <li> element per genre. **/
        movie.Genres.forEach(function (genre) {
          const li = document.createElement("li")
          li.className = "genre"        // A CSS class for the rounded badge styling
          li.textContent = String(genre) // Sets the genre name as text
          genreList.appendChild(li)
        })
        article.appendChild(genreList)

        /** --- Plot summary --- **/

        /**
         * [Semantic HTML] <section> groups related content together.
         * Each section represents a distinct part of the movie card.
         **/
        const plotSection = document.createElement("section")

        /**
         * [AOM] The aria-label identifies this section for screen reader users
         * navigating by landmarks (e.g., the "Plot summary" section).
         **/
        plotSection.setAttribute("aria-label", "Plot summary")
        const plot = document.createElement("p")
        plot.className = "plot"

        /**
         * Split the plot text into individual words and wrap each in a <span>.
         * This enables the speed-read hover effect — each word highlights
         * as you move the mouse across the text.
         **/
        movie.Plot.split(" ").forEach(function (word) {
          const wordSpan = document.createElement("span")
          wordSpan.className = "plot-word"
          wordSpan.textContent = word + " "
          plot.appendChild(wordSpan)
        })
        plotSection.appendChild(plot)
        article.appendChild(plotSection)

        /** --- Ratings --- **/

        /** [Semantic HTML] Another <section> to group rating information. **/
        const ratingsSection = document.createElement("section")
        /** [AOM] The aria-label lets screen readers announce the "Ratings" section. **/
        ratingsSection.setAttribute("aria-label", "Ratings")
        const ratingsP = document.createElement("p")
        /**
         * innerHTML is used here (instead of textContent) because we need
         * <strong> tags for bold labels and &bull; for the bullet separator.
         **/
        ratingsP.innerHTML = "<strong>IMDb:</strong> " + movie.imdbRating
            + "/10 &bull; <strong>Metascore:</strong> " + movie.Metascore + "/100"
        ratingsSection.appendChild(ratingsP)
        article.appendChild(ratingsSection)

        /** --- Directors --- **/

        /** [Semantic HTML] <section> groups the heading and list together. **/
        const dirSection = document.createElement("section")
        /** [AOM] The aria-label enables landmark navigation for this section. **/
        dirSection.setAttribute("aria-label", "Directors")

        /**
         * [Semantic HTML] <h3> because we are inside an <article> with an <h2> title.
         * The heading hierarchy is: h1 (page) > h2 (movie title) > h3 (subsection).
         **/
        const dirH3 = document.createElement("h3")
        dirH3.textContent = "Directors"
        dirSection.appendChild(dirH3)
        const dirList = document.createElement("ul")
        /** [AOM] The aria-label describes the list content for screen readers. **/
        dirList.setAttribute("aria-label", "List of directors")

        /** Loop through each director and create a list item. **/
        movie.Directors.forEach(function (d) {
          const li = document.createElement("li")
          li.textContent = String(d)
          dirList.appendChild(li)
        })
        dirSection.appendChild(dirList)
        article.appendChild(dirSection)

        /** --- Writers --- **/

        /** [Semantic HTML] <section> with [AOM] aria-label (same pattern as Directors). **/
        const wrSection = document.createElement("section")
        wrSection.setAttribute("aria-label", "Writers")
        const wrH3 = document.createElement("h3")  // [Semantic HTML] <h3> subsection heading
        wrH3.textContent = "Writers"
        wrSection.appendChild(wrH3)
        const wrList = document.createElement("ul")
        wrList.setAttribute("aria-label", "List of writers")  // [AOM] list label
        movie.Writers.forEach(function (w) {
          const li = document.createElement("li")
          li.textContent = String(w)
          wrList.appendChild(li)
        })
        wrSection.appendChild(wrList)
        article.appendChild(wrSection)

        /** --- Actors --- **/

        /** [Semantic HTML] <section> with [AOM] aria-label (same pattern as Directors). **/
        const actSection = document.createElement("section")
        actSection.setAttribute("aria-label", "Actors")
        const actH3 = document.createElement("h3")  // [Semantic HTML] <h3> subsection heading
        actH3.textContent = "Actors"
        actSection.appendChild(actH3)
        const actList = document.createElement("ul")
        actList.setAttribute("aria-label", "List of actors")  // [AOM] list label
        movie.Actors.forEach(function (a) {
          const li = document.createElement("li")
          li.textContent = String(a)
          actList.appendChild(li)
        })
        actSection.appendChild(actList)
        article.appendChild(actSection)

        /** Finally, add the completed movie card to the <main> container. **/
        mainElement.appendChild(article)
      })
    } else {
      /** If the server returned an error (not 200), show an error message. **/

      const errorP = document.createElement("p")

      /**
       * [AOM] role="alert" makes screen readers immediately announce this message
       * when it appears — the user does not have to navigate to it.
       * This is important for accessibility: errors should be announced proactively.
       **/
      errorP.setAttribute("role", "alert")
      errorP.textContent = "Daten konnten nicht geladen werden, Status " //Why only here German??
          + xhr.status + " - " + xhr.statusText
      mainElement.appendChild(errorP)
    }
  }

  /** Configure the request: HTTP GET method, targeting the "/movies" endpoint on our server. **/
  xhr.open("GET", "/movies")

  /** Send the request — the onload callback above will fire when the response arrives. **/
  xhr.send()
}