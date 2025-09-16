// service layer 
const userDAO = require('../repository/userDAO');
// const uuid = require('uuid');
const bcrypt = require('bcrypt');
const {logger} = require("../util/logger");


// USER FUNCTIONS 
function validateUser(user){
    // check if username and password meet correct criteria (length > 0)
    // check that username is unique 
    const usernameResult = user.username.length > 0;
    const passwordResult = user.password.length > 0;
    return (usernameResult && passwordResult);
}

// register new users
async function registerUser(user){
    // call validate user here 
    const saltRounds = 10;
    if (validateUser(user)){
        const password = await bcrypt.hash(user.password, saltRounds);
        const data = await userDAO.postUser({
            user_id: crypto.randomUUID(), 
            username: user.username,
            password, 
            role: user.role
        });
        logger.info(`Creating new user: ${JSON.stringify(data)}`);
        return data;
    } else if (userDAO.getUserByUsername(user.username) != null){ // username exists in database
        logger.info(`Failed to create user, username already exists.`);
        return null;
    } else{ // username or password empty/dont meet criteria 
        logger.info(`Failed to validate user: ${JSON.stringify(data)}`);
        return null;
    }
}
       
async function loginUser(username, password){
    const user = await getUserByUsername(username);
    if(user && (await bcrypt.compare(password, user.password))){
        logger.info(`User logged in successfully`)
        return user;
    }else{
        logger.info(`Incorrect username or password`);
        return null;
    }
}

async function getUserByUsername(username){
    if (username){ //username not empty
        const data = await userDAO.getUserByUsername(username);
        if (data){
            logger.info(`User found by username ${JSON.stringify(data)}`);
            return data;
        } else {
            logger.info(`User not found by username ${JSON.stringify(data)}`);
            return null;
        }
    }
}

async function getUserById(user_id){
    if (user_id){
        const data = await userDAO.getUserById(user_id);
        if (data){
            logger.info(`User found by user id ${JSON.stringify(data)}`);
            return data;
        } else {
            logger.info(`User not found by user id ${JSON.stringify(data)}`);
            return null;
        }
    }
}

async function editUser(user_id, attribute, edit){
    const data = await userDAO.editUser(user_id, attribute, edit);
    if (data){
        logger.info(`User updated ${JSON.stringify(data)}`);
        return data;
    } else{
        logger.info(`Uable to update user ${JSON.stringify(data)}`);
        return null;
    }
}

async function deleteUserbyId(user_id){
    if (user_id){
        const data = await userDAO.deleteUserById(user_id);
        if (data){
            logger.info(`User deleted using user id ${JSON.stringify(data)}`);
            return data;
        } else {
            logger.info(`User not found ${JSON.stringify(data)}`);
            return null;
        }
    }
}

module.exports = {registerUser, loginUser, getUserById, getUserByUsername, editUser, deleteUserbyId};