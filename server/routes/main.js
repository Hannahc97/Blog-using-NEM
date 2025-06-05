// import express from "express"
// const app = express();

//! We have multiple routes - this will have all the main routes like homepage, contact, about etc

import { Router } from "express"; // importing the Router function from Express.

const router = Router() // holds all the routes for this module (main.js)

// Routes
router.get("", (req, res) => {

    // This renders/pass ejs data such as rendering to layouts
    // Created an object with title & description so we can pass it to a page 
    const locals = { 
        title: "Node.js blog",
        description: "A simple blog made with node.js, express and MongoDb"
    }
    // Pass "locals" to a page and render it, if passing more objects put it in {}
    res.render("index", { locals }) // we are rendering the home page from ./views/index 
});

router.get("/about", (req, res) => {
    res.render("about")  
});

export default router // exports the router so you can use it in your main app file
