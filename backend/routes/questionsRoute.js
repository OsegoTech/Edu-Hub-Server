import express from "express";

import {
  createQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestions,
  updateQuestion,
} from "../controllers/questionsController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(getQuestions).post(protect, createQuestion);
router
  .route("/:id")
  .get(protect, getQuestionById)
  .delete(protect, deleteQuestion)
  .put(protect, updateQuestion);

export default router;
