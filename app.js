// npm run dev to run the app
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import expressEjsLayouts from "express-ejs-layouts";
import mainRoutes from "./server/routes/main.js";
import { connectDB } from "./server/config/db.js";

// const express = require("express");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // allows your app to use the port the hosting service provides.

// Connect to DB
connectDB();

//middleware for a our search bar 
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static("public")); // public folder will hold css, js, img
// don't need to use ../../ as it know it's all in public folder

//* Templating Engine
app.use(expressEjsLayouts); // tells Express to use the express-ejs-layouts middleware
// allows you to have one main layout (like a template with a header, footer, etc.) and insert different pages (views) into it.
app.set("layout", "./layouts/main"); // tells Express EJS Layouts where your main layout file is located.
// "Use the ./layouts/main.ejs file as the base layout for all views."
app.set("view engine", "ejs") //tells Express that you're using EJS (Embedded JavaScript) as the view engine.

//! We don't want all our routes in app.js so put them in main.js

app.use("/", mainRoutes);
//  tells your Express app to use the routes defined in mainRoutes (your main.js file) for any requests that start with /

app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})

