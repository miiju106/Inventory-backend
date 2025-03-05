const express = require("express")
// const cors = require("cors")
const userRouter = require("./routes/user.routes")
const authRouter = require("./routes/auth.routes")
const adminRouter = require("./routes/admin.routes")

const app = express()

app.use(express.json())

app.use("/user", userRouter)
app.use("/auth", authRouter)
app.use("/admin", adminRouter)


module.exports = app;