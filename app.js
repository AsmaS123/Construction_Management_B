const express = require('express');
var http = require('http');
const app = express();
var events = require('events');
var eventEmitter = new events.EventEmitter();
const cron = require('node-cron');
const nodemailer = require('nodemailer');

// Configure the email transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email provider's SMTP
  auth: {
    user: 'asmanoushin.786@gmail.com', // Your email address
    pass: 'anassohail@786', // Your email password or app-specific password
  },
  tls: {
    rejectUnauthorized: false, // Disable certificate validation
  }
});

// Define the email options
const mailOptions = {
  from: 'asmanoushin.786@gmail.com', // Sender address
  to: 'noushinshaikh937@gmail.com', // List of recipients
  subject: 'Daily Reminder',
  text: 'This is your daily email notification!',
};

// Schedule the task
cron.schedule('*/1 * * * *', () => {
  console.log('Running email notification task...');

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
});

console.log('Email scheduler is running...');

app.get('/', (req, res) => {
  const obj = {
    "name":'asma'
  }
  res.send(obj);
});

app.listen(3005, () => {
  console.log('Server is running on port 3005');
});

