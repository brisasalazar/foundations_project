const express = require('express');
const app = express();
const {logger, loggerMiddleware} = require('./util/logger');
const {authenticateToken} = require("./util/jwt");

const userController = require('./controller/userController');
const ticketController = require('./controller/ticketController');

const PORT = 3000;

app.use(express.json());
app.use(loggerMiddleware);

app.use("/users", userController);
app.use("/tickets", ticketController);

app.get("/protected", authenticateToken, (req, res) => {
    res.json({message: "Accessed Protected Route", user: req.user});
})

// register user
app.get("/users/register", (req, res) =>{
    
})
// login user
// submit ticket 
// view ticket history
// filter tickets by status
// edit ticket status 

app.listen(PORT, () =>{
    console.log(`Server is listening on http://localhost:${PORT}`);
})
