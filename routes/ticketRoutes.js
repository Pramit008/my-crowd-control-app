const express = require('express');
const { createTicket, redeemTicket, getUserTickets } = require('../controllers/ticketController');

const router = express.Router();

// Route to create a new ticket
router.post('/create', createTicket);

// Route to redeem a ticket
router.post('/redeem', redeemTicket);

// Route to fetch all tickets for a user
router.get('/user/:userId', getUserTickets);

module.exports = router;

