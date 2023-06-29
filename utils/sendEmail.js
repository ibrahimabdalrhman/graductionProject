const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com", // hostname
    service: "outlook", // service name
    secureConnection: true,
    port:587,
    tls: {
      ciphers: "SSLv3", // tls version
    }, // use TLS
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
// const sendEmail = async (options) => {
//   const transporter = nodemailer.createTransport({
//     service: process.env.EMAIL_HOST,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   }
//   );

  const mailerOptions = {
    from: `Travel Planner <${process.env.EMAIL_USERNAME}>`,
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
