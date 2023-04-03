const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;

// ------------------------------------------import routes-----------------------------------

const userRoute = require("./routes/user");
const projectRoute = require("./routes/project");

// ------------------------------------------end of routes-----------------------------------
dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// ------------------------------------------routes registration-----------------------------------
app.use("/api", userRoute);
app.use("/api", projectRoute);

// ------------------------------------------Database Connection-----------------------------------

const connectDB = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_CONNECTION_URI).then(() => {
      console.log("Database Connected");
      app.listen(PORT, () => {
        console.log("Server is listening on port :" + PORT);
      });
    });
  } catch (err) {
    console.log(err);
  }
};
connectDB();
