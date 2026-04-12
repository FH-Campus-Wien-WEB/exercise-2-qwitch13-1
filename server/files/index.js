/**
 * !!! window.onload fires after the entire page (HTML, CSS, images) has finished loading.
 * we use it to make sure the DOM is ready before we try to manipulate it. !!!
 * detail: this runs after the entire page has loaded —
 * all HTML, images, stylesheets, and other resources are downloaded and parsed.
 * it"s a safe place to run code that needs to interact with DOM elements,
 * because you know they exist.
 **/
window.onload = function () {

  /**
   * create a new XMLHttpRequest object — this lets us fetch data from the server
   * without reloading the page (aka AJAX).
   * the following creates an object that lets you make HTTP requests from JavaScript
   * without reloading the page.
   * it"s the older way to do AJAX (Asynchronous JavaScript and XML).
   **/
  const xhr = new XMLHttpRequest()

  /**
   * define what happens when the server responds.
   * this sets up a callback function that runs when the server responds successfully.
   * the function body typically processes the response data.
   **/
  xhr.onload = function () {

    /**
     * [semantic HTML] select the <main> element — this is the primary content area of the page.
     * screen readers use <main> to let users skip navigation and jump straight to content.
     **/
    const mainElement = document.querySelector("main") // changed to main instead of body

    /**
     * check if the server returned HTTP 200 (OK).
     * we use === (strict equality) to avoid unexpected type coercion.
     **/
    if (xhr.status === 200) {

      /**
       * the server sends movie data as a JSON string.
       * JSON.parse() converts that string into a JavaScript array of objects.
       **/
      const movies = JSON.parse(xhr.responseText)

      for (const movie of movies) {
        /* Task 1.3. Add your code from exercise 1 here
           and include a non-functional 'Edit' button
           to pass this test */

        /** --- create the movie card --- **/

        /**
         * [semantic HTML] <article> represents a self-contained piece of content
         * (like a blog post or, in our case, a movie card).
         **/
        const article = document.createElement("article")

        /**
         * [AOM] aria-labelledby links this article to its heading element.
         * screen readers announce the heading text when entering this article,
         * so users know which movie card they are in.
         **/
        const titleId = "movie-title-" + movie.imdbID
        article.setAttribute("aria-labelledby", titleId)

        /** --- poster image --- **/

        /**
         * [semantic HTML] <figure> wraps media content (images, diagrams, etc.)
         * that is referenced from the main text. it gives the image semantic meaning
         * beyond just being a floating <img>.
         **/
        const figure = document.createElement("figure")
        const img = document.createElement("img")
        img.src = movie.Poster       // sets the image URL from the movie data
        img.alt = "Poster of " + movie.Title  // the alt text is for screen readers and for when the image fails to load
        figure.appendChild(img)       // puts the <img> inside the <figure>
        article.appendChild(figure)   // puts the <figure> inside the <article>

        /** --- movie title --- **/

        /**
         * [semantic HTML] we use <h2> for movie titles because <h1> is already
         * used for the page heading ("Movies!"). this keeps the heading hierarchy
         * correct: h1 > h2 > h3. screen readers use heading levels to build
         * a navigable outline of the page.
         **/
        const title = document.createElement("h2")
        title.id = titleId            // this ID is referenced by aria-labelledby above
        title.textContent = movie.Title
        article.appendChild(title)

        /** --- edit button--- **/

        /**
         * [semantic HTML] <a> with role="button" and tabindex="0"
         * to make it keyboard-accessible.
         * [AOM] the aria-label describes the button"s purpose to screen readers.
         * the href points to an edit page with the movie"s imdbID as a query parameter,
         * so the user can edit the movie data.
         **/
        const edit_btn = document.createElement("button")
        edit_btn.id = "edit-btn-" + movie.imdbID
        edit_btn.textContent = "Edit"
        edit_btn.className = "edit_btn" // a CSS class for styling
        edit_btn.onclick = function() {
          location.href = "edit.html?imdbID=" + movie.imdbID
        }
        edit_btn.setAttribute("aria-label", "Edit this movie") // provides a label for screen readers

        // create a spacer
        const spacer = document.createElement("span")
        spacer.textContent = "\t"  // tab character

        article.appendChild(spacer)
        article.appendChild(edit_btn)

        /** --- runtime and release date --- **/

        const meta = document.createElement("p")
        meta.className = "meta"       // a CSS class for gray, smaller text styling

        /**
         * [semantic HTML] <time> with a datetime attribute provides a machine-readable
         * date. browsers and assistive tech can parse "2024-01-19" even if we
         * display it differently to the user.
         **/
        meta.innerHTML = "Runtime: " + movie.Runtime + " min \u2022 Released on "
            + "<time datetime=\"" + movie.Released + "\">" + movie.Released + "</time>"
        article.appendChild(meta)

        /** --- genre tags --- **/

        /**
         * [semantic HTML] using <ul> + <li> for genres instead of loose <span> elements.
         * this tells screen readers, "here is a list of 3 items," instead of just
         * reading text blobs with no structure.
         **/
        const genreList = document.createElement("ul")

        /**
         * [AOM] the aria-label gives this list a name that screen readers announce,
         * e.g., "Genres, list, 3 items." without it, the list would be unnamed.
         **/
        genreList.setAttribute("aria-label", "Genres")

        /** these inline styles display the genre badges horizontally (overrides the default list styling). **/
        genreList.style.listStyle = "none"   // removes the bullet points
        genreList.style.padding = "0"        // removes the default left padding
        genreList.style.display = "flex"     // lays out the items in a row
        genreList.style.flexWrap = "wrap"    // wraps to the next line if needed
        genreList.style.gap = "4px"          // a small space between the badges

        /** creates one <li> element per genre. **/
        movie.Genres.forEach(function (genre) {
          const li = document.createElement("li")
          li.className = "genre"        // a CSS class for the rounded badge styling
          li.textContent = String(genre) // sets the genre name as text
          genreList.appendChild(li)
        })
        article.appendChild(genreList)

        /** --- plot summary --- **/

        /**
         * [semantic HTML] <section> groups related content together.
         * each section represents a distinct part of the movie card.
         **/
        const plotSection = document.createElement("section")

        /**
         * [AOM] the aria-label identifies this section for screen reader users
         * navigating by landmarks (e.g., the "Plot summary" section).
         **/
        plotSection.setAttribute("aria-label", "Plot summary")
        const plot = document.createElement("p")
        plot.className = "plot"

        /**
         * split the plot text into individual words and wrap each in a <span>.
         * this enables the speed-read hover effect — each word highlights
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

        /** --- ratings --- **/

        /** [semantic HTML] another <section> to group rating information. **/
        const ratingsSection = document.createElement("section")
        /** [AOM] the aria-label lets screen readers announce the "Ratings" section. **/
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

        /** --- directors --- **/

        /** [semantic HTML] <section> groups the heading and list together. **/
        const dirSection = document.createElement("section")
        /** [AOM] the aria-label enables landmark navigation for this section. **/
        dirSection.setAttribute("aria-label", "Directors")

        /**
         * [semantic HTML] <h3> because we are inside an <article> with an <h2> title.
         * the heading hierarchy is: h1 (page) > h2 (movie title) > h3 (subsection).
         **/
        const dirH3 = document.createElement("h3")
        dirH3.textContent = "Directors"
        dirSection.appendChild(dirH3)
        const dirList = document.createElement("ul")
        /** [AOM] the aria-label describes the list content for screen readers. **/
        dirList.setAttribute("aria-label", "List of directors")

        /** loop through each director and create a list item. **/
        movie.Directors.forEach(function (d) {
          const li = document.createElement("li")
          li.textContent = String(d)
          dirList.appendChild(li)
        })
        dirSection.appendChild(dirList)
        article.appendChild(dirSection)

        /** --- writers --- **/

        /** [semantic HTML] <section> with [AOM] aria-label (same pattern as directors). **/
        const wrSection = document.createElement("section")
        wrSection.setAttribute("aria-label", "Writers")
        const wrH3 = document.createElement("h3")  // [semantic HTML] <h3> subsection heading
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

        /** --- actors --- **/

        /** [semantic HTML] <section> with [AOM] aria-label (same pattern as directors). **/
        const actSection = document.createElement("section")
        actSection.setAttribute("aria-label", "Actors")
        const actH3 = document.createElement("h3")  // [semantic HTML] <h3> subsection heading
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

        /** finally, add the completed movie card to the <main> container. **/
        mainElement.appendChild(article)
      }
    } else {
      mainElement.append( // changed to main instead of body
        "Daten konnten nicht geladen werden, Status " + // why only in german? is it an easter-egg?
          xhr.status +
          " - " +
          xhr.statusText
      )
    }
  }

  /** configure the request: HTTP GET method, targeting the "/movies" endpoint on our server. **/
  xhr.open("GET", "/movies")

  /** send the request — the onload callback above will fire when the response arrives. **/
  xhr.send()
}
