const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const generateOTP = require("./generateOTP");
dotenv.config();
let sentOTP = ''; // Global variable to store the OTP sent via email

let transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("first")
  console.log(email);

  let otp = generateOTP();
  sentOTP=otp
  var mailOptions = {
    from: 'Dania <d.altarifi@qtech.com>',
    to: email,
    subject: "OTP form Callback Coding",
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent successfully!");
      res.json({info})
    }
  });
});
const verifyOTP = (userOTP) => {
  return userOTP === sentOTP; // Compare the OTP entered by the user with the sent OTP
};


module.exports = { sendEmail,sentOTP,verifyOTP };

//merge the signup with sendemail and verifyotp:
// const signUpAndSendOTP = async (req, res) => {
//   const sql = "INSERT INTO login (`name`,`email`,`password`,`role`) VALUES (?)";
//   const { name, email, password } = req.body;

//   // Hash the password
//   bcrypt.hash(password.toString(), salt, async (err, hash) => {
//     if (err) return res.json({ Error: "Error hashing password" });

//     const values = [
//       name,
//       email,
//       hash,
//       "user" // Set a default role for new users
//     ];

//     try {
//       // Insert user data into the database
//       await db.query(sql, [values]);

//       // Generate OTP
//       const otp = generateOTP();

//       // Store the OTP in a global variable (consider using a more secure storage method)
//       global.sentOTP = otp;

//       // Send OTP via email
//       const mailOptions = {
//         from: 'Dania <d.altarifi@qtech.com>',
//         to: email,
//         subject: "OTP from Callback Coding",
//         text: `Your OTP is: ${otp}`,
//       };

//       transporter.sendMail(mailOptions, function (error, info) {
//         if (error) {
//           console.log(error);
//           return res.status(500).json({ error: "Failed to send OTP" });
//         } else {
//           console.log("Email sent successfully!");
//           return res.json({ message: "Email sent successfully" });
//         }
//       });
//     } catch (error) {
//       return res.status(500).json({ Error: "Error inserting data in server" });
//     }
//   });
// };

// const verifyAndSaveData = async (req, res) => {
//   const { userEnteredOTP, name, email, password } = req.body;

//   // Verify entered OTP
//   if (userEnteredOTP !== global.sentOTP) {
//     return res.status(400).json({ error: "Incorrect OTP" });
//   }

//   const sql = "INSERT INTO login (`name`,`email`,`password`,`role`) VALUES (?)";

//   // Hash the password
//   bcrypt.hash(password.toString(), salt, async (err, hash) => {
//     if (err) return res.json({ Error: "Error hashing password" });

//     const values = [
//       name,
//       email,
//       hash,
//       "user" // Set a default role for new users
//     ];

//     try {
//       // Insert user data into the database after successful OTP verification
//       await db.query(sql, [values]);
//       return res.json({ Status: "Success" });
//     } catch (error) {
//       return res.status(500).json({ Error: "Error inserting data in server" });
//     }
//   });
// };

// module.exports = { signUpAndSendOTP, verifyAndSaveData };