const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailerOptions = {
    from: `Travel Planner <ibrahimabdalrhman@zohomail.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  try {
    await transporter.sendMail(mailerOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("There is an error in sending email");
  }
};

module.exports = sendEmail;
