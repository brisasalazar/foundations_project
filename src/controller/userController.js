// Controller Layer 

const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const secretKey = "my-secret-key"

const userService = require("../service/userService");
const { authenticateToken } = require("../util/jwt");

function validatePostUser(req, res, next){
    const user = req.body;
    if(user.username && user.password){
        next();
    }else{
        res.status(400).json({message: "invalid username or password", data: user});
    }
}

router.get("/user_id", async (req, res) => {
    const data = await userService.getUserById(req.body.user_id);
    if (data){
        res.status(200).json({message: `User found through user id ${JSON.stringify(data)}`});
    } else {
        res.status(400).json({message: `User not found ${JSON.stringify(data)}`});
    }
})

router.get("/username", async (req, res) => {
    const data = await userService.getUserByUsername(req.body.username);
    if (data){
        res.status(200).json({message: `User returned through username${JSON.stringify(data)}`});
    } else {
        res.status(400).json({message: `User not found ${JSON.stringify(data)}`});
    }
})

// register new user
router.post("/register", validatePostUser, async (req, res) => {
    const data = await userService.registerUser(req.body);
    if (data){
        res.status(201).json({message: `User created successfully ${JSON.stringify(data)}`});
    } else{
        res.status(400).json({message: "Failed to create user", data: req.body});
    }
})
// login user
router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const data = await userService.loginUser(username, password);
    if (data){
        const token = jwt.sign(
            {
                id:data.user_id, 
                username
            }, 
            secretKey, 
            {
                expiresIn: "15m"
            }
        );
        res.status(200).json({message:"Login successful", token});
    } else{
        res.status(400).json({message: "Username or password incorrect", data: user});
    }
})

module.exports = router;
// delete user 