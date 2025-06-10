// import express from "express"
// const app = express();

//! We have multiple routes - this will have all the main routes like homepage, contact, about etc

import { Router } from "express"; // importing the Router function from Express.
import { Post } from "../models/Post.js";
import { get } from "mongoose";

const router = Router() // holds all the routes for this module (main.js)

// Routes
// GET
// HOME
router.get("", async (req, res) => {

    // This renders/pass ejs data such as rendering to layouts
    // Created an object with title & description so we can pass it to a page 


    try{
        const locals = { 
        title: "Node.js blog",
        description: "A simple blog made with node.js, express and MongoDb"
        }
        
        //? pagination 
        let postsPerPage = 10;
        let page = req.query.page || 1; // in the url "?page=2", default page is 1
        
        // Sorts the posts by newest first (most recent createdAt at the top
        const data = await Post.aggregate([{$sort: {createdAt: -1}}])
        .skip(postsPerPage * page - postsPerPage) // Eg If you’re on page 2 & each page shows 10 posts, skip the first 10.
        .limit(postsPerPage)
        .exec(); // executes aggregated pipeline/ Runs the query.

        // gets the total number of posts in the database — so you know how many pages there will be
        const count = await Post.countDocuments(); 
        // checks whether there should be a “Next” page:
        const nextPage = parseInt(page) + 1; // Adds 1 to the current page (nextPage)
        const hasNextPage = nextPage <= Math.ceil(count / postsPerPage);
        // Checks if that number is less than or equal to the total number of pages
            // Math.ceil(count / postsPerPage) gives the total number of pages
        // If yes, hasNextPage is true. Otherwise, it's false.

        // this finds all the posts and then we render all the data
        // const data = await Post.find(); 

        // renders the index view and sends it:
        // Pass "locals" to a page and render it, if passing more objects put it in {}
        res.render("index", { // we are rendering the home page from ./views/index 
            locals, // The blog title and description
            data, // The blog posts to show
            current: page, // The current page number
            nextPage: hasNextPage? nextPage : null // The next page number (or null if there's no next page)
        }) 
    }
    catch (error) {
        console.log(error)
    }

});

// GET
// Posts : id

router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;

        const data = await Post.findById({_id: slug});

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('post', { locals, data });

    } catch (error) {
        console.log(error);
    }
});

// POST
// Post - searchTerm
router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let searchTerm = req.body.searchTerm //grabbing the name=searchTerm from search.ejs

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "") // regEx good for validation or searching


        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, "i")}},
                {body: {$regex: new RegExp(searchNoSpecialChar, "i")}}
            ]
        });

        res.render("search", {
            data, locals
        });
    } catch (error) {
        console.log(error);
    }
});


router.get("/about", (req, res) => {
    res.render("about")  
});

export default router // exports the router so you can use it in your main app file



//! This function allows you to innsert data, if you want to add more delete the others 
// function insertPostData(){
//     Post.insertMany([
//         {
//             title: "Building a blog",
//             body: "This is the body text" // createdAt, updatedAt inserted automatically
//         },
//         {
//             title: "Deployment of Node.js applications",
//             body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//         },
//         {
//             title: "Authentication and Authorization in Node.js",
//             body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//         },
//         {
//             title: "Understand how to work with MongoDB and Mongoose",
//             body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//         },
//         {
//             title: "build real-time, event-driven applications in Node.js",
//             body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//         },
//         {
//             title: "Discover how to use Express.js",
//             body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//         },
//         {
//             title: "Asynchronous Programming with Node.js",
//             body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//         },
//         {
//             title: "Learn the basics of Node.js and its architecture",
//             body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//         },
//         {
//             title: "NodeJs Limiting Network Traffic",
//             body: "Learn how to limit netowrk traffic."
//         },
//         {
//             title: "Learn Morgan - HTTP Request logger for NodeJs",
//             body: "Learn Morgan."
//         },
//     ])
// }
// insertPostData()