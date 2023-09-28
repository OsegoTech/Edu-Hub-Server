import mongoose from "mongoose";

const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
  },
  answer: {
    type: String,
    default: "",
    // required: [true, "Answer is required"],
  },
});

const Questions = mongoose.model("Questions", questionSchema);
export default Questions;
