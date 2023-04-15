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
      tagLine: {
        type: String,
          max: [50,"limit exceeded!!!"]
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
      type: Object,
        default: {}
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
