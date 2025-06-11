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
        // If both checks pass, create a JWT (JSON Web Token). Token stores the user’s ID (as a payload), and it's signed with a secret. Token can be used to identify the user on future requests
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
router.get('/dashboard', async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('./admin/dashboard'); // tells Express to render the admin/dashboard view, tells the view engine to use a specific layout for the admin pages
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