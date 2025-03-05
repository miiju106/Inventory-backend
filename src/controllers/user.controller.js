const User = require("../models/user.model");
const Stock = require("../models/stock.model");
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
require("dotenv").config();



function validEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validPassword(pass) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(pass);
}

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function registerUser(req, res) {
  try {
    const { firstname, lastname, email, password, role } = req.body;
    if (!firstname || !lastname) {
      return res.status(400).json({
        message: "Kindly input your firstname or lastname",
      });
    }

    if (!email || !validEmail(email)) {
      return res.status(400).json({
        message:
          "Kindly input the right email structure e.g xxx@emailprovider.com",
      });
    }

    if (!password || !validPassword(password)) {
      return res.status(400).json({
        message:
          "Your password must be at least eight characters which must include an uppercase letter, lowercase letter and a number",
      });
    }

    if (!role || (role != "admin" && role != "user")) {
      return res.status(400).json({
        message: "Kindly fill role and the role must be either admin or user",
      });
    }

    // check for existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // create a new user
    const user = new User({ firstname, lastname, email, password, role });
    

     // Generate Token for Email Confirmation
     const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "2h" });

     // Send Confirmation Email
     const confirmLink = `http://localhost:${process.env.PORT}/verify/${token}`;
     await transporter.sendMail({
       from: process.env.EMAIL_USER,
       to: email,
       subject: "Email Confirmation",
       html: `<h3>Click the link to verify your email:</h3><a href=${confirmLink}>Verify Email</a>`,
     });

     // save to database
     const savedUser = await user.save();

    // respond
    res.status(200).json({
      message: "Account Created Successfully, Email not yet verified",
      user: {
        firstname: savedUser.firstname,
        lastname: savedUser.lastname,
        email: savedUser.email,
        role: savedUser.role,
        isVerified:savedUser.isVerified,
        token
      },
    });
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ message: "Server Error", error });
  }
}

async function getStock(req, res) {
  try {
    const savedUser = await User.findById(req.user.userId); // userId is from JWT payload

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // get all the stocks
    const stocks = await Stock.find();

    res.status(200).json({
      message: "Access Granted",
      stocks,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" }, error);
  }
}

async function getSingleStock(req, res) {
  try {
    const { id } = req.params;

    const savedUser = await User.findById(req.user.userId); // userId is from the JWT payload

    if (!savedUser) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // get single stock by id
    const singleStock = await Stock.findById(id);

    res.status(200).json({
      message: "Access Granted",
      stock: singleStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" }, error);
  }
}

module.exports = { registerUser, getStock, getSingleStock };
