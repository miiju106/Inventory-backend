const express = require("express")
const {loginUser, verifyEmailJWT} = require("../controllers/auth.controller")


const authRouter = express.Router()


authRouter.get("/verifyEmail/:token", verifyEmailJWT)
authRouter.post("/login", loginUser)

module.exports = authRouter