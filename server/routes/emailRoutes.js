const express = require("express");
const router = express.Router();

const { sendEmail,verifyOTP } = require("../services/sendEmail");

router.post("/sendEmail", sendEmail);

// Assuming the user enters the OTP in a route like '/verifyOTP'
router.post('/verifyOTP', (req, res) => {
  const { userEnteredOTP } = req.body; // Get the OTP entered by the user
  const isVerified = verifyOTP(userEnteredOTP); // Verify the entered OTP

  if (isVerified) {
    // OTP is correct, allow login or perform necessary actions
    res.json({ message: "OTP verified successfully" });
  } else {
    // OTP is incorrect
    res.status(400).json({ error: "Incorrect OTP" });
  }
});
module.exports = router;
