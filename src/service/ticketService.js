// service layer 
const ticketDAO = require('../repository/ticketDAO');
//const uuid = require('uuid');
const {logger} = require("../util/logger");
//const bcrypt = require('bcrypt');

function validateTicket(ticketInfo){
    const descriptionResult = ticketInfo.description.length > 0;
    const amountResult = ticketInfo.amount != null || ticketInfo.amount > 0;
    return (descriptionResult && amountResult);
}

// submit tickets
async function submitTicket(ticketInfo){
    if (validateTicket){
        const data = await ticketDAO.putTicket({
            ticket_id: crypto.randomUUID(), //generate random ticket id
            ...ticketInfo
        });
        if (data){
            logger.info(`Successfully submitted ticket ${JSON.stringify(data)}`);
            return data;
        } else {
            logger.error(`Failure to submit ticket ${JSON.stringify(data)}`);
            return null;
        }
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
async function filterByStatus(status){
    const data = await ticketDAO.filterByStatus(status);
    if (data){
        logger.info(`Tickets filtered by status ${JSON.stringify(data)}`);
        return data; 
    } else {
        logger.error(`Unabe to filter tickets by status ${JSON.stringify(data)}`);
        return null;
    }
}
// edit ticket status
 async function editStatus(user_id, ticket_id, newStatus){
    const data = await ticketDAO.editStatus(user_id, ticket_id, newStatus);
    if (data){
        logger.info(`Successfully edited ticket status ${JSON.stringify(data)}`);
        return data; 
    } else {
        logger.error(`Unabe to edit ticket status ${JSON.stringify(data)}`);
        return null;
    }
 }

 module.exports = {submitTicket, getAllUserTickets, filterByStatus, editStatus}