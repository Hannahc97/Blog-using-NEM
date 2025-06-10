import { Router } from "express";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import bcrypt from "bcrypt"; // helps encrypt/decrypt pw
import * as jwt from 'jsonwebtoken'

const router = Router()

const adminLayout = "../views/layouts/admin"

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

        res.render('admin/login', { locals, layout: adminLayout }); // tells Express to render the admin/login view,  tells the view engine to use a specific layout for the admin pages
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST /
 * Admin - Check Login
*/
router.post('/admin', async (req, res) => {
    try {

        const {username, password} = req.body;
        if(req.body.username === "admin" && req.body.password === "password"){
            res.redirect
        }

        // res.render('admin/login', { locals, layout: adminLayout });
        res.redirect("/admin")
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST /
 * Admin - register
*/
router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body; //getting from register form
        const hashedPassword = await bcrypt.hash(password, 10) //hashing pw

        try{ // create the user
            const user = await User.create({username, password: hashedPassword})
            res.status(201).json({message: "user created", user}) // for testing purposes
        } catch(error){
            if(error.code === 11000){
                res.status(409).json({message: "User already in use"})
            }
            res.status(500).json({message: "Internal server error"})
        }
    } catch (error) {
        console.log(error);
    }
});

export default router 