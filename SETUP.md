# Little Loops enquiry backend setup

The website now includes a real enquiry form on `contact.html`, but automatic delivery needs backend credentials before it can go live.

## What it can do

- Send an enquiry email to `17.meenamehta@gmail.com`
- Send the same enquiry as a WhatsApp message to `9381061818`

## What you need

1. A Gmail account or another SMTP mailbox for sending email
2. An app password for that mailbox if you use Gmail
3. A Twilio WhatsApp sender or another WhatsApp API setup

## Setup steps

1. Copy `.env.example` to `.env`
2. Fill in the SMTP and Twilio values
3. Install dependencies with `npm install`
4. Start the site with `npm start`
5. Open `http://localhost:3000`

## Notes

- The form sends to `/api/enquiry`, so it must run through `server.js`, not by opening the HTML file directly.
- WhatsApp automation cannot work from plain website HTML alone. It needs a backend provider and credentials.
- If you want, I can next help you install dependencies and test the flow once you are ready to share or enter the service credentials locally.
