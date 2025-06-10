import { Router } from "express";
import { Post } from "../models/Post.js";

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

        res.render('admin/login', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error);
    }
});

export default router 