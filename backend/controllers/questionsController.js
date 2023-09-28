import Questions from "../models/questionsModel.js";
import asyncHandler from "express-async-handler";
// import { makeVoice } from "../utils/africasTalking.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import { openChat } from "../utils/openAi.js";
// import Bard from "bard-ai";
dotenv.config();

// const COOKIE =
//   "bQgeX4TXofdew_GpshNLhUN7IJe-HIpbXTfTLTpILXSN_rWoA_E6jz97GXPeBbuNNEsJoA.";
// let myBard = new Bard(COOKIE);
// console.log(await myBard.ask("Hello, world!"));
const apiKey = process.env.OPEN_AI_API_KEY;
const client = new OpenAI({ apiKey });

// @desc Fetch all questions
// route GET /api/questions

const getQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Questions.find({});
  res.status(200).json(questions);
});

// @desc Fetch single question
// route GET /api/questions/:id

const getQuestionById = asyncHandler(async (req, res, next) => {
  const question = await Questions.findById(req.params.id);
  if (question) {
    res.status(200).json(question);
  } else {
    res.status(404);
    throw new Error("Question not found");
  }
});

// @desc Delete a question
// route DELETE /api/questions/:id
// access Private/Admin

const deleteQuestion = asyncHandler(async (req, res, next) => {
  const question = await Questions.findById(req.params.id);
  if (question) {
    await question.remove();
    res.status(200).json({ message: "Question removed" });
  } else {
    res.status(404);
    throw new Error("Question not found");
  }
});

// @desc Create a question
// route POST /api/questions
// access Private/Admin

const createQuestion = asyncHandler(async (req, res, next) => {
  const { question } = req.body;
  let { answer } = req.body;
  console.log(question);
  const response = openChat(question);

  const botResponse = await response;
  console.log(botResponse);
  answer = botResponse;
  const newQuestion = new Questions({
    question,
    answer,
  });
  console.log(response);
  // makeVoice("+254743168819", answer);
  const createdQuestion = await newQuestion.save();
  res.status(201).json(createdQuestion);
});

// @desc Update a question
// route PUT /api/questions/:id
// access Private/Admin

const updateQuestion = asyncHandler(async (req, res, next) => {
  const { question, answer } = req.body;
  const questionToUpdate = await Questions.findById(req.params.id);
  if (questionToUpdate) {
    questionToUpdate.question = question;
    questionToUpdate.answer = answer;
    const updatedQuestion = await questionToUpdate.save();
    res.status(200).json(updatedQuestion);
  } else {
    res.status(404);
    throw new Error("Question not found");
  }
});

export {
  getQuestions,
  getQuestionById,
  deleteQuestion,
  createQuestion,
  updateQuestion,
};
