const express=require("express");

const router=express.Router();

const {register,login}= require("../controllers/authController");

router.post("/register",register);  //  parameters :: "/register"→ URL path   register→function to execute when this route is hit
router.post("/login",login);

module.exports= router;