import { Router } from "express";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt"; // helps encrypt/decrypt pw
// import * as jwt from 'jsonwebtoken'
// import jwt from 'jsonwebtoken';
// import { sign, decode, verify } from 'jsonwebtoken'
// import pkg from 'jsonwebtoken';
// const { sign, decode, verify } = pkg;
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

dotenv.config();

const router = Router()
const adminLayout = "../views/layouts/admin"
const jwtSecret = process.env.JWT_SECRET

/**
 * Check Login --> need to add this middleware to pages that require login
 * protect certain routes, making sure only logged-in users can access them
 * If you change/delete the token in dev tools the dashboard page will show unauthorised
*/
const authMiddleware = (req, res, next) => { // Middleware in Express is code that runs before the main route handler
    const token = req.cookies.token; // tries to get the token from the user's browser cookies, which was saved during login (res.cookie("token", token, { httpOnly: true });)
    if(!token){ // If the cookie isn’t there
        return res.status(401).json({message: "unauthorised"}) // sends error & stops request
    }
    try{ // if we have the token
        const decoded = jwt.verify(token, jwtSecret); // Uses jwt.verify() to decode and verify the token using your secret
        req.userId = decoded.userId; // If successful, it pulls out the user ID and attaches it to req.userId so other routes can use it
        next() // next() is a function that moves to the next step if everything is okay
    } catch(error){
        return res.status(401).json({message: "unauthorised"})
    }
}

/**
 * GET /
 * Admin - Login page
*/
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('admin/login', { locals, layout: adminLayout }); // tells Express to render the admin/login view, tells the view engine to use a specific layout for the admin pages
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST /
 * Admin - Check Login
*/
// sets up the route to handle form submissions to /admin
router.post('/admin', async (req, res) => {
    try {
        // Pulls the submitted username and password from the login form (input name="username")
        const {username, password} = req.body;
        // Looks up a user in the MongoDB database by their username, 
        const user = await User.findOne({username})//if no matching user is found, user will be null
        if(!user){// If user doesn’t exist, send 401 Unauthorized response and stop login process
            return res.status(401).json({message: "invalid credentials"})
        }
        // Uses bcrypt.compare() to check if the password entered in the form matches hashed password stored in database
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){ //  If the password doesn’t match, return 401 response
            return res.status(401).json({message: "invalid credentials"})
        }
        // If both checks pass, create a JWT (JSON Web Token). Token stores the user’s ID (as a payload), and it's signed with a secret. Token can be used to identify the user on future requests, it keeps you logged in 
        const token = jwt.sign({ userId: user._id}, jwtSecret );

        // Stores the token in a cookie on the user’s browser.
        // httpOnly: true means JavaScript can’t access the cookie — good for security
        res.cookie("token", token, {httpOnly: true})
        res.redirect("/dashboard") //  Once the cookie is set, it redirects the user to /dashboard
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Dashboard
*/
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Dashboard",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        const data = await Post.find(); // getting all the posts 
        // tells Express to render the admin/dashboard view, tells the view engine to use a specific layout for the admin pages
        res.render("./admin/dashboard", {
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
});


/**
 * GET /
 * Admin - Create New Post page
*/
router.get('/add-post', authMiddleware, async (req, res) => { // showing the “Add New Post” form,  using await to fetch data from MongoDB
    try {
        const locals = {
            title: "Add Post",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        const data = await Post.find() //  fetches all existing blog posts from MongoDB using Mongoose

        res.render("./admin/add-post", { // Render the EJS (or other templating) file located at views/admin/add-post.ejs
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
});


/**
 * POST /
 * Admin - Create New Post
*/
router.post('/add-post', authMiddleware, async (req, res) => {
    try{
        try {
            const newPost = new Post({
                title: req.body.title, // grabs title and body from the form submission (req.body)
                body: req.body.body // creates a new Mongoose model instance using the Post schema
            }) // <input name="title" />  <textarea name="body"></textarea>

            await Post.create(newPost) // saves the new post to your MongoDB database
            res.redirect("/dashboard") // then redirected to the dashboard

            } catch (error) { // errors while saving the post (like missing fields, DB issues).
                console.log(error);
            }
    } catch (error){
        console.log(error)
    }
});



/**
 * GET /
 * Admin - Edit Post page
*/
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        const data = await Post.findOne({_id: req.params.id}) // req.params.id Gets the post ID from the URL
        // Post.findOne({_id: ...}): Finds the post in the MongoDB collection by its ID

        res.render("./admin/edit-post", { // renders the views/admin/edit-post.ejs template
            locals,
            data,
            layout: adminLayout
        });
    } catch (error) {
        console.log(error);
    }
});


/**
 * PUT /
 * Admin  Edit Post
*/
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try { // Mongoose method that finds by its ID
        await Post.findByIdAndUpdate(req.params.id, { // Gets the post ID from the URL
            title: req.body.title, // come from the form fields 
            body: req.body.body,
            updatedAt: Date.now()
        })

        //redirected back to the same edit page
        // res.redirect(`/edit-post/${req.params.id}`) 
        // Redirect with ?updated=true to show window alert, have put in main.js 
        res.redirect(`/post/${req.params.id}?updated=true`)

    } catch (error) {
        console.log(error);
    }
});

/**
 * DELETE /
 * Admin - delete Post
*/
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {// grabs the post ID from the URL.
        //  tells MongoDB to delete one post whose _id matches the provided ID.
        await Post.deleteOne({ _id: req.params.id})

        res.redirect(`/dashboard`);

    } catch (error) {
        console.log(error);
    }
});






/**
 * POST /
 * Admin - register
*/
//  sets up the route to handle a POST request to /register, which happens when the registration form is submitted.
router.post('/register', async (req, res) => { 
    try {
        // pulls the username and password fields from the submitted form (input name="username")
        const {username, password} = req.body; //getting from register form
        const hashedPassword = await bcrypt.hash(password, 10) //hashing pw

        try{ // saves the new user into the database using your User model
            // User.create adds a new record to MongoDB & stores the hashed password
            const user = await User.create({username, password: hashedPassword})
            res.status(201).json({message: "user created", user}) // for testing purposes
        } catch(error){
            if(error.code === 11000){ // (duplicate key error in MongoDB).
                res.status(409).json({message: "User already in use"})
            }
            res.status(500).json({message: "Internal server error"})
        }
    } catch (error) {
        console.log(error);
    }
});

export default router 