// DAO for users

// import aws sdk clients, dyanodb, and fs modules 
const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand, ScanCommand, UpdateCommand} = require("@aws-sdk/lib-dynamodb")

const {logger} = require("../util/logger");

const client = new DynamoDBClient({region: "us-east-1"});

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "user_table";

// CRUD operations on users

// create user (role, user_id (auto-gen uuid), username, password (hashed))
    // verify that user_id not already in table (happens in service layer)
    // unique username (service layer)
async function postUser(user){
    const command = new PutCommand({
        TableName,
        Item: {
            user_id: user.user_id,
            role: user.role || "employee", //defaut user role as employee
            ...user // spread operator to fill other provided attributes
        }});
    try{
        const data = await documentClient.send(command);
        logger.info(`PUT command to database complete ${JSON.stringify(data)}`);
        return data;
    } catch(err){
        logger.error(err);
        return null;
    }
}
//
//postUser({user_id:"a0272efc-9971-4366-ad36-092c50b0a6a4", role:"employee", username:"user1", password:"pass1"});

// get user by id 
async function getUserById(user_id){
    const command = new GetCommand({
        TableName, 
        Key: {user_id}
    });
    try{
        const data = await documentClient.send(command);
         logger.info(`GET command to database complete ${JSON.stringify(data)}`);
        return data;
    } catch(err){
        logger.error(err);
        return null;
    }
}

//getUserById("a0272efc-9971-4366-ad36-092c50b0a6a4");

// get user by username 
async function getUserByUsername(username){
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username" : "username"}, // notation saying whenever you see #username, replace with actual attribute username
        ExpressionAttributeValues: {":username" : username} //notation saying when you see :username in expression, replace with the value of username var in code
    });
    try{
        const data = await documentClient.send(command);
        logger.info(`SCAN command to database complete ${JSON.stringify({data})}`);
        return data;
    } catch (err){
        logger.error(err);
        return null;
    }
}

//getUserByUsername("user1");

// edit user (edit role, change password, usrname can't be edited?)
async function editUser(user_id, attribute, edit){
    const command = new UpdateCommand({
        TableName,
        Key: {user_id},
        //ConditionExpression: "attribute_exists",
        ExpressionAttributeNames: {"#attribute" : attribute},
        ExpressionAttributeValues: {":edit":edit},
        UpdateExpression: "set #attribute = :edit",
        ReturnValues: "ALL_NEW"
    });
    try{
        const data = await documentClient.send(command);
        logger.info(`UPDATE command completed ${JSON.stringify(data)}`);
        return data;
    } catch (err){
        logger.error(err);
        return null;
    }
}
//editUser("a0272efc-9971-4366-ad36-092c50b0a6a4", "password", "newPass");

// delete user by id
async function deleteUserbyId(user_id){
    const command = new DeleteCommand({
        TableName, 
        Key: {user_id}
    });
    try{
        const data = await documentClient.send(command);
        logger.info(`Delete command completed ${JSON.stringify({data})}`);
        return data;
    } catch (err){
        logger.error(err);
        return null;
    }
}
//deleteUserbyId("a0272efc-9971-4366-ad36-092c50b0a6a4");

// SUbmit Tickets
module.exports = {postUser, getUserById, getUserByUsername, deleteUserbyId};


