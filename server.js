const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const app = express();
const port = process.env.PORT || 3000;
const recipientEmail = process.env.RECIPIENT_EMAIL || "17.meenamehta@gmail.com";
const recipientWhatsapp = process.env.RECIPIENT_WHATSAPP || "whatsapp:+919381061818";

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function requireValue(value, name) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function buildMessage(data) {
  return [
    "New enquiry from Little Loops by Meena",
    "",
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Category: ${data.category}`,
    "",
    "Message:",
    data.message
  ].join("\n");
}

async function sendEmail(messageBody, data) {
  const smtpUser = requireValue(process.env.SMTP_USER, "SMTP_USER");
  const smtpPass = requireValue(process.env.SMTP_PASS, "SMTP_PASS");
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT || 465);

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || smtpUser,
    to: recipientEmail,
    replyTo: data.email,
    subject: `New website enquiry: ${data.category}`,
    text: messageBody
  });
}

async function sendWhatsapp(messageBody) {
  const accountSid = requireValue(process.env.TWILIO_ACCOUNT_SID, "TWILIO_ACCOUNT_SID");
  const authToken = requireValue(process.env.TWILIO_AUTH_TOKEN, "TWILIO_AUTH_TOKEN");
  const whatsappFrom = requireValue(process.env.TWILIO_WHATSAPP_FROM, "TWILIO_WHATSAPP_FROM");

  const client = twilio(accountSid, authToken);

  await client.messages.create({
    from: whatsappFrom,
    to: recipientWhatsapp,
    body: messageBody
  });
}

app.post("/api/enquiry", async (req, res) => {
  const { name, phone, email, category, message } = req.body || {};

  if (!name || !phone || !email || !category || !message) {
    return res.status(400).json({ error: "Please fill in all the form fields." });
  }

  const messageBody = buildMessage({ name, phone, email, category, message });

  try {
    await sendEmail(messageBody, { name, phone, email, category, message });
    await sendWhatsapp(messageBody);
    res.json({ ok: true });
  } catch (error) {
    console.error("Enquiry delivery failed:", error);
    res.status(500).json({
      error: "The form is ready, but the email/WhatsApp service is not configured yet. Add the backend credentials and try again."
    });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Little Loops site running on http://localhost:${port}`);
});
