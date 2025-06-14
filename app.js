// npm run dev to run the app
import express, { urlencoded } from "express";
import dotenv from "dotenv";
import expressEjsLayouts from "express-ejs-layouts";
import methodOverride from "method-override";
import mainRoutes from "./server/routes/main.js";
import { connectDB } from "./server/config/db.js";
import adminRoutes from "./server/routes/admin.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import isActiveRoute from "./server/helpers/routeHelpers.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; // allows your app to use the port the hosting service provides.

// Connect to DB
connectDB();

//middleware for our search bar 
app.use(express.urlencoded({extended: true}))
app.use(express.json())



//middleware for our cookie parser and sessions
app.use(cookieParser()) // lets you read cookies sent by the browser &can access cookies via req.cookies.
app.use(session({ // session stores user data between HTTP requests (e.g., staying logged in). The data is usually stored on the server, and the browser just keeps a cookie with the session ID.
    secret: "keyboard cat", // random string used to sign and encrypt the session ID in the cookie
    resave: false, //  prevents the session from being saved back to the session store if it hasn’t changed during the request
    saveUninitialized: true, // a new session will be saved to the store even if it’s not been modified. Often used for login systems or tracking users on first visit.
    store: MongoStore.create({ // this creates the cookie for us, tells express-session to use MongoDB to store sessions
        mongoUrl: process.env.MONGODB_URL // connects it to your MongoDB database.
    })
}))

app.use(methodOverride("_method"))

app.use(express.static("public")); // public folder will hold css, js, img
// don't need to use ../../ as it know it's all in public folder

//* Templating Engine
app.use(expressEjsLayouts); // tells Express to use the express-ejs-layouts middleware
// allows you to have one main layout (like a template with a header, footer, etc.) and insert different pages (views) into it.
app.set("layout", "./layouts/main"); // tells Express EJS Layouts where your main layout file is located.
// "Use the ./layouts/main.ejs file as the base layout for all views."
app.set("view engine", "ejs") //tells Express that you're using EJS (Embedded JavaScript) as the view engine.

app.locals.isActiveRoute = isActiveRoute



//! We don't want all our routes in app.js so put them in main.js

app.use("/", mainRoutes);
//  tells your Express app to use the routes defined in mainRoutes (your main.js file) for any requests that start with /

app.use("/", adminRoutes);



app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`)
})

