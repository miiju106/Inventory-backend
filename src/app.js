const express = require("express")
const cors = require("cors")
const userRouter = require("./routes/user.routes")
const authRouter = require("./routes/auth.routes")
const adminRouter = require("./routes/admin.routes")

const app = express()

app.use(express.json())

//Allow CORS for all origins and methods
app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

app.use("/user", userRouter)
app.use("/auth", authRouter)
app.use("/admin", adminRouter)


module.exports = app;