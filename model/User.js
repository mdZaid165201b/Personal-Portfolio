const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 15,
    },
    lastName: {
      type: String,
      required: true,
      max: 15,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    //   min: [12, "length must be at least 12 character!!!"], // comment just for development
    },
    profilePic: {
      type: String,
    },
    githubLink: {
      type: "String",
      default: "",
    },
    facebookLink: {
      type: "String",
      default: "",
    },
    linkedinLink: {
      type: "String",
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
