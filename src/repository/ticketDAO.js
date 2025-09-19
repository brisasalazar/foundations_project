// DAO for tickets

// import aws sdk clients, dyanodb, and fs modules 
const { DynamoDBClient} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand, ScanCommand, UpdateCommand} = require("@aws-sdk/lib-dynamodb")

const {logger} = require("../util/logger");

const client = new DynamoDBClient({region: "us-east-1"});

const documentClient = DynamoDBDocumentClient.from(client);

// tickets_table has attributes: ticket_id, user_id (employee who submitted it), description, amount, status (pending, approved, denied)
const TableName = "ticket_table";

// create new ticket 
async function putTicket(ticketInfo){
    const command = new PutCommand({
        TableName,
        Item: {
            ticket_id: ticketInfo.ticket_id,
            status: ticketInfo.status || "pending", //defaut ticket status as pending from service layer
            user_id: ticketInfo.user_id,
            ...ticketInfo
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
 
//putTicket({ticket_id:"007", user_id:"d86515fd-ca29-489b-9d18-82c099706f0c", description:"Some Conference", amount:5.5})
// putTicket({ticket_id:"003", user_id:"a0272efc-9971-4366-ad36-092c50b0a6a4", description:"Some Conference", amount:50})

// view all tickets of a certain user (pending and already approved/denied tickets)
async function getAllUserTickets(user_id){
    const command = new QueryCommand({
        TableName,  
        ExpressionAttributeValues: {":user_id":user_id},
        KeyConditionExpression: "user_id = :user_id", //user_id is a GSI
    });
    try {
        const data = await documentClient.send(command);
        logger.info(`GET request successful ${JSON.stringify(data)}`);
        return data;
    } catch (err){
        logger.error(err);
        return null;
    }
}
//getAllUserTickets("d86515fd-ca29-489b-9d18-82c099706f0c");

//filter thorugh all tickets by attribute
async function filterPending(status){
    const command = new QueryCommand({
        TableName, 
        IndexName: "status-index",
        ExpressionAttributeNames: {"#status" : "status"},
        ExpressionAttributeValues: {":status": status},
        KeyConditionExpression: "#status = :status"
    });
     try {
        const data = await documentClient.send(command);
        logger.info(`GET request successful ${JSON.stringify(data)}`);
        return data;
    } catch (err){
        logger.error(err);
        return null;
    }
}
//filterTicketsByStatus("declined");
async function getTicketById(ticket_id){
    const command = new QueryCommand({
        TableName, 
        IndexName: "ticket_id-index",
        ExpressionAttributeValues: {":ticket_id":ticket_id},
        KeyConditionExpression: "ticket_id = :ticket_id"
    });
    try{
        const data = await documentClient.send(command);
        logger.info(data);
        return data;
    } catch(err){
        logger.error(err);
        return null;
    }
}

//edit ticket status (only Manager role can do this, but this handles in service layer)
async function editStatus(ticket_id, newStatus){
    const someData = await getTicketById(ticket_id);
    if (someData){
        const user = someData.Items[0];
        const user_id = user.user_id;
        console.log("user_id",user_id);
        const command = new UpdateCommand({
            TableName,
            Key: {user_id, ticket_id},
            ConditionExpression: "#status = :expectedStatus", // can only edit status if it's "pending"
            ExpressionAttributeNames: {"#status" :"status"},
            ExpressionAttributeValues: {":status" : newStatus, ":expectedStatus":"pending"},
            UpdateExpression: "set #status = :status",
            ReturnValues: "ALL_NEW"
        });
        try {
            const data = await documentClient.send(command);
            logger.info(`UPDATE command successful ${JSON.stringify(data)}`);
            return data;
        } catch (err){
            logger.error(err);
            return null;
        }
    } else {
        logger.warn("Ticket id not found in database.")
        return null;
    }
    
}
//editStatus("d86515fd-ca29-489b-9d18-82c099706f0c", "001", "denied");

//
module.exports = {putTicket, getAllUserTickets, editStatus, filterPending}

