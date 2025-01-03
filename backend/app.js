const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectToDB = require("./db/db");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user-routes");
const captianRoutes = require("./routes/captian-routes");

connectToDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/captains", captianRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});

module.exports = app;
