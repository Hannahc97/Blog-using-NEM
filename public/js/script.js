// alert("hello")

document.addEventListener("DOMContentLoaded", function(){
    const searchBtn = document.querySelector(".searchBtn");
    const searchBar = document.querySelector(".searchBar");
    const searchInput = document.querySelector(".searchInput");
    const searchClose = document.querySelector(".searchClose");

    for(let i = 0; i < searchBtn.length; i ++){
        searchBtn[i].addEventListener("click", function(){
            searchBar.style.visibility = "visible";
            searchBar.classList.add("open");
            this.setAttribute("aria-expanded", "true");
            
        })
    }
    
})