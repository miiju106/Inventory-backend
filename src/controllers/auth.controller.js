const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // check if the inputted email exist in the database
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // check if email exist
    if (email != user.email) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT payload
    const payload = { userId: user._id };

    // Generate JWT
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2hr",
    });

   

    // Respond with JWT
    res.json({
      message: "User Logged in successfully",
      accessToken,
      user: {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
}

async function verifyEmailJWT(req, res) {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const savedUser = await User.findOne({ email: decoded.email });
    if (!savedUser) {
      return res.status(400).json({
        message: "Invalid Token or User not found",
      });
    }

    savedUser.isVerified = true;
    await savedUser.save();

    res.json({
      msg: "Email verified successfully",
      user: {
        email: savedUser.email,
        role: savedUser.role,
        isVerified: savedUser.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
}

module.exports = { loginUser, verifyEmailJWT };
