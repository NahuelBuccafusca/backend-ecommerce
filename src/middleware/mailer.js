const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 687,
  auth: {
    user: process.env.usermail,
    pass: process.env.pass,
  },
});

module.exports = { transport };