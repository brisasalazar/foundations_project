const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const {logger} = require("./util/logger");
const {authenticateToken} = require("./util/jwt"); 

const userController = require('./controller/userController');
const ticketController = require('./controller/ticketController');

const PORT = 3000;

function loggerMiddleware(req, res, next){
    logger.info(`Incoming ${req.method} : ${req.url}`);
    next();
}

app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use("/users", userController);
app.use("/tickets", ticketController);                      

//restricts access to certain paths, authenticates token 
app.get("/protected", authenticateToken, (req, res) => {
    res.json({message: "Accessed Protected Route", user: req.user});
})

// check that server working 
app.post("/", (req, res) => {
    let data = req.body;
    logger.info(data);
    res.send({message: "data received"});
})

//listening 
app.listen(PORT, () =>{
    console.log(`Server is listening on http://localhost:${PORT}`);
})
