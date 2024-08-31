const Ticket = require('../models/Ticket');

// Create a new ticket
async function createTicket(req, res) {
  const { event, date, location, venueId, userId } = req.body;
  try {
    const newTicket = new Ticket({ event, date, location, venueId, userId });
    await newTicket.save();
    res.status(201).send('Ticket created successfully');
  } catch (error) {
    res.status(400).send('Error creating ticket: ' + error.message);
  }
}

// Redeem a ticket
async function redeemTicket(req, res) {
  const { ticketId } = req.body;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).send('Ticket not found');
    }
    if (ticket.redeemed) {
      return res.status(400).send('Ticket has already been redeemed');
    }
    ticket.redeemed = true;
    await ticket.save();
    res.status(200).send('Ticket redeemed successfully');
  } catch (error) {
    res.status(500).send('Error redeeming ticket: ' + error.message);
  }
}

// Fetch tickets for a user
async function getUserTickets(req, res) {
  const { userId } = req.params;
  try {
    const tickets = await Ticket.find({ userId });
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).send('Error fetching tickets: ' + error.message);
  }
}

module.exports = {
  createTicket,
  redeemTicket,
  getUserTickets
};