// import express from "express"
// const app = express();

//! We have multiple routes - this will have all the main routes like homepage, contact, about etc

import { Router } from "express"; // importing the Router function from Express.
import { Post } from "../models/Post.js";

const router = Router() // holds all the routes for this module (main.js)

// Routes
// GET
// HOME
router.get("", async (req, res) => {

    // This renders/pass ejs data such as rendering to layouts
    // Created an object with title & description so we can pass it to a page 
    const locals = { 
        title: "Node.js blog",
        description: "A simple blog made with node.js, express and MongoDb"
    }

    try{ 
        const data = await Post.find(); // this finds all the posts and then we render all the data
        // Pass "locals" to a page and render it, if passing more objects put it in {}
        res.render("index", { locals, data }) // we are rendering the home page from ./views/index 
    }
    catch (error) {
        console.log(error)
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