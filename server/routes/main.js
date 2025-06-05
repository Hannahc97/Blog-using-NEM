// import express from "express"
// const app = express();

// We have multiple routes - this will have all the main routes like homepage, contact, about etc

import { Router } from "express"; // importing the Router function from Express.
const router = Router() // holds all the routes for this module (main.js)

// Routes
router.get("", (req, res) => {
    res.send("Hello World")
});

export default router // exports the router so you can use it in your main app file
