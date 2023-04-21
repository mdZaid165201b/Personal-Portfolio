const mongoose = require("mongoose");
const moment = require("moment");

const projectSchema = mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      max: [30, "length exceeded"],
    },
    assign: {
      type: String,
      default: "",
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Complete"],
      default: "Pending",
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
      set: function (value) {
        return moment(value, "DD-MM-YYYY");
      },
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    coverImage: {
      type: Object,
      required: true,
    },
    projectImages: [
      {
        type: Object,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
