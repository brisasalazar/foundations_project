// controller layer 
const express = require('express');
const router = express.Router();

const ticketService = require('../service/ticketService');
const uuid = require('uuid');
const {logger} = require("../util/logger");
const bcrypt = require('bcrypt');

const {authenticateToken} = require("../util/jwt/jwt")

// Submit ticket
router.post("/submitTicket", async (req, res) => {
    const data = await userService.submitTicket(req.body);
    if (data){
        res.status(201).json({message: `Reimbursement request submitted successfully ${JSON.stringify(data)}`});
    } else {
        res.status(400).json({message: `Failed to submit reimbursement request ${JSON.stringify(data)}`});
    }
})

// get all tikcets from particular user- employee role
router.get("/ticketHistory", authenticateToken, authorizeTicketAccess, async (req, res) => {
    const data = await ticketService.getAllUserTickets(req.body);
    if (data){
        res.status(200).json({message:`Ticket history for user ${JSON.stringify(user_id)}`});
    } else{
        res.status(400).json({message:`Unable to retrive ticket history for user ${JSON.stringify(user_id)}`});
    }
})

//filter tickets by status
router.get("/filterByStatus", authenticateToken, authorizedUser, async (req, res) => {
    const data = await ticketService.filterByStatus(req.body);
    if (data){
        res.status(200).json({message:`Filtered tickets by status ${JSON.stringify(data.status)}`});
    } else{
        res.status(400).json({message:`Unable to filter tickets by status ${JSON.stringify(data.status)}`});
    }
})

// edit ticket status (only managers)
router.put("/editStatus", authenticateToken, authorizedUser, async (req, res) => {
    // first ensure that user role is manager (use tokens) middleware?
    let {user_id, ticket_id, status} = req.body;
    const data = await ticketService.editStatus(user_id, ticket_id, status);
    if (data){
        res.status(200).json({message: "Ticket status updated", data});
    } else {
        res.status(400).json({message: "Failure to update ticket status", data});
    }
})

//middleware goes here
// func chceck if user authorized to see all ticket history
function authorizeTicketAccess(req, res, next){
    const requestedUserId = req.body;
    const user = req.user;
    if (user.role == "manager" || user.user_id == requestedUserId){
        next();
    } else {
        return res.status(403).json({message:"Action not permitted. User does not have necesary permissions.", data: user.role})
    }
}
// func check if user authorized to edit status 
function authorizedUser(req, res, next){
    const user = req.body;
    if (user.role == "manager"){
        next();
    } else {
        res.status(400).json({message:"Action not permitted. User does not have necessary permissions.", data: user.role})
    }
}

// TODO: implemetn view tickets restriction, a user cna only view their own ticket history. a manger can look at any and all employee ticket history
module.exports = router;