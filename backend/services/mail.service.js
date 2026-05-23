// const nodemailer = require("nodemailer");

// // Gmail transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS // Gmail App Password
//   }
// });

// // Send OTP Email
// exports.sendOTPEmail = async (email, code) => {
//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your OTP Verification Code",
//       html: `
//         <div style="font-family: Arial; padding: 10px;">
//           <h2>OTP Verification</h2>
//           <p>Your verification code is:</p>
//           <h1 style="color:#2b6cb0">${code}</h1>
//           <p>This code will expire soon.</p>
//         </div>
//       `
//     });

//     console.log("OTP EMAIL SENT TO:", email);
//     return true;

//   } catch (err) {
//     console.error("EMAIL ERROR:", err.message);
//     return false;
//   }
// };


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOTP = async (email, code) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP Verification",
    html: `<h2>Your OTP is ${code}</h2>`
  });
};

exports.sendOTPEmail = exports.sendOTP;
