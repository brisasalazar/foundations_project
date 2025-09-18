// Controller Layer 

const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const {logger} = require("../util/logger")

const secretKey = "my-secret-key"

const userService = require("../service/userService");
const { authenticateToken } = require("../util/jwt");

//local middleware 
function validatePostUser(req, res, next){
    const user = req.body;
    if(user.username && user.password){
        next();
    }else{
        res.status(400).json({message: "Invalid username or password", data: user});
    }
}

// register new user
router.post("/register", validatePostUser, async (req, res) => {
    const data = await userService.registerUser(req.body);
    if (data){
        res.status(201).json({message:"User created successfully"});
    } else{
        res.status(400).json({message: "Failed to create user", data: req.body});
    }
})

// // get user with user_id 
// router.get("/{user_id}", async (req, res) => {
//     const data = await userService.getUserById(req.body.user_id);
//     logger.info(req.body.user_id);
//     if (data){
//         res.status(200).json({message: `User found through user id ${JSON.stringify(data)}`});
//     } else {
//         res.status(400).json({message: `User not found ${JSON.stringify(data)}`});
//     }
// })

// router.get("/username", async (req, res) => {
//     const data = await userService.getUserByUsername(req.body.username);
//     if (data){
//         res.status(200).json({message: `User returned through username${JSON.stringify(data)}`});
//     } else {
//         res.status(400).json({message: `User not found ${JSON.stringify(data)}`});
//     }
// })


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
        res.status(400).json({message: "Username or password incorrect", data: req.body});
    }
})

module.exports = router;