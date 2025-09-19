// service layer 
const ticketDAO = require('../repository/ticketDAO');
const {logger} = require("../util/logger");

function validateTicket(ticketInfo){
    const descriptionResult = ticketInfo.description != null;
    const amountResult = ticketInfo.amount != null;
    return (descriptionResult && amountResult);
}

// submit tickets
async function submitTicket(currUser_id, ticketInfo){
    if (validateTicket(ticketInfo)){
        const timestamp = new Date();
        const data = await ticketDAO.putTicket({
            ticket_id: crypto.randomUUID(), //generate random ticket id
            status: "pending",
            user_id: currUser_id,
            submittedAt: timestamp.toISOString(),
            amount: ticketInfo.amount,
            description: ticketInfo.description
        });
        if (data){
            logger.info(`Successfully submitted ticket ${JSON.stringify(data)}`);
            return data;
        } else {
            logger.error(`Failure to submit ticket ${JSON.stringify(data)}`);
            return null;
        }
    } else {
        logger.error(`Failure to submit ticket. Missing amount or description. ${JSON.stringify(ticketInfo)}`);
        return null;
    }
}

// view all tickets from a certain user
async function getAllUserTickets(user_id){
    const data = await ticketDAO.getAllUserTickets(user_id);
    if (data){
        logger.info(`Submitted ticket history ${JSON.stringify(data)}`);
        return data; 
    } else {
        logger.error(`Unabe to retrive ticket history ${JSON.stringify(data)}`);
        return null;
    }
}

//filter tickets by status 
async function filterPending(status){
    const data = await ticketDAO.filterPending(status);
    if (data){
        logger.info(`Tickets filtered by status ${JSON.stringify(data)}`);
        return data; 
    } else {
        logger.error(`Unable to filter tickets by status ${JSON.stringify(data)}`);
        return null;
    }
}

// edit ticket status
 async function editStatus(ticket_id, newStatus){
    const data = await ticketDAO.editStatus(ticket_id, newStatus);
    if (data){
        logger.info(`Successfully edited ticket status ${JSON.stringify(data)}`);
        return data; 
    } else {
        logger.error(`Unable to edit ticket status ${data}`);
        return null;
    }
 }
//
 module.exports = {submitTicket, getAllUserTickets, filterPending, editStatus}