const ticketModel = require("../models/ticket.model");

class TicketManager {
  constructor() {}

  async getTicketById(tid) {
    const ticket = await ticketModel.findById(tid);
    return ticket;
  }

  async getTicketByEmail(email) {
    const ticket = await ticketModel.find({ purchaser: email }).lean();
    return ticket;
  }

  async createTicket(ticket) {
    const newTicket = await ticketModel.create(ticket);
    return newTicket;
  }
}

module.exports = TicketManager;