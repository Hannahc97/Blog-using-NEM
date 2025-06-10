// alert("hello")

document.addEventListener("DOMContentLoaded", function(){ // waits for the whole webpage (DOM) to load before running the script — so all elements exist and can be selected.
    const searchBtn = document.querySelectorAll(".searchBtn"); // could be more than one search button
    const searchBar = document.querySelector(".searchBar"); // The search bar container (usually hidden at first)
    const searchInput = document.getElementById("searchInput"); // actual text input inside the search bar 
    const searchClose = document.getElementById("searchClose");

    for(let i = 0; i < searchBtn.length; i ++){ // doing forLoop incase we had multiple search buttons
        searchBtn[i].addEventListener("click", function(){
            searchBar.style.visibility = "visible"; // search bar’s visibility is set to "visible" (so it shows up)
            searchBar.classList.add("open"); //  CSS class "open" is added — this might trigger animations
            this.setAttribute("aria-expanded", "true"); // good for accessibility — tells screen readers that the search bar is open
            searchInput.focus(); // Focus is moved to the search input, so the user can start typing right away (blue box)
        })
    }

    searchClose.addEventListener("click", function(){
        searchBar.style.visibility = "hidden"; // search bar’s visibility is set to "hidden" (so it disappears)
        searchBar.classList.remove("open"); // "open" class is removed (undoes the styling/animation)
        this.setAttribute("aria-expanded", "false"); // close button’s aria-expanded attribute is set to "false" (indicating it’s closed)
    })
})