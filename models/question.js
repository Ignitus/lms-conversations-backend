const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const questionSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    answers: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);
