// controller layer 
const express = require('express');
const router = express.Router();

const ticketService = require('../service/ticketService');
const userService = require("../service/userService")
const uuid = require('uuid');
const {logger} = require("../util/logger");
const bcrypt = require('bcrypt');

const {authenticateToken} = require("../util/jwt");

// Submit ticket
router.post("/", authenticateToken, onlyEmployee, async (req, res) => {
    const currUser = req.user;
    const data = await ticketService.submitTicket(currUser.id, req.body);
    if (data){
        res.status(201).json({message: `Reimbursement request submitted successfully.`, data:data.Attributes});
    } else {
        res.status(400).json({message: `Failed to submit reimbursement request, missing fields.`, data:req.body});
    }
})

// get all tickets from particular user aka ticket history 
router.get("/ticket-history", authenticateToken, authorizeTicketAccess, async (req, res) => {
    const user_id = req.query.user;
    logger.info(user_id);
    const data = await ticketService.getAllUserTickets(user_id);
    if (data){
        res.status(200).json({message:`Ticket history for user: ${user_id}`, data:data.Items});
    } else{
        res.status(400).json({message:`Unable to retrive ticket history for user ${user_id}`});
    }
})

//filter tickets by status
router.get("/", authenticateToken, authorizedUser, async (req, res) => {
    const status = req.query.status;
    const data = await ticketService.filterStatus(status);
    if (data){
        res.status(200).json({message:`Filtered ${status} tickets. There are ${data.Count} ${status} tickets.`, data:data.Items});
    } else{
        res.status(400).json({message:`Unable to filter ${status} tickets.`});
    }
})

// edit ticket status (only managers)
router.put("/:ticket_id/status", authenticateToken, authorizedUser, async (req, res) => {
    const {status} = req.body;
    const {ticket_id} = req.params;

    if (status === "approved" || status === "declined"){
        const data = await ticketService.editStatus(ticket_id, status);
        logger.info("data", data);
        if (data){
            res.status(200).json({message: "Ticket status updated", data:data.Attributes});
        } else {
            res.status(400).json({message: "Failure to update ticket status", data});
        }
    } else{
        res.status(400).json({message:"Status can only be changed to approved or declined."});
    }
    
})

//middleware goes here
function onlyEmployee(req, res, next){
    const user = req.user;
    if (user.role == "employee"){
        next();
    } else {
        res.status(403).json({message:"Action not permitted. Only employees can submit tickets.", data: user.role})
    }
}
// func chceck if user authorized to see all ticket history
function authorizeTicketAccess(req, res, next){
    const user = req.user;
    const requestedUserId = req.query.user;

    if (user.role === "manager" || user.id == requestedUserId){
        next();
    } else {
        return res.status(403).json({message:"Action not permitted. User does not have necesary permissions.", data: user.role})
    }
}
// func check if user authorized to edit/filter by status 
function authorizedUser(req, res, next){
    const user = req.user;
    if (user.role == "manager"){
        next();
    } else {
        res.status(403).json({message:"Action not permitted. User does not have necessary permissions.", data: user.role})
    }
}

module.exports = router;