const express =require("express")
const {registerUser, getStock, getSingleStock} = require("../controllers/user.controller")
const verifyJWT = require ("../middlewares/verifyJWT")
const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.get("/get-stocks", verifyJWT, getStock)
userRouter.get("/get-stock/:id", verifyJWT, getSingleStock)

module.exports = userRouter