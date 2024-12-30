const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./db/db");
const userRoutes = require("./routes/user-routes");
const cookieParser=require('cookie-parser')
connectToDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(cookieParser())

app.use("/users", userRoutes) ;

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
