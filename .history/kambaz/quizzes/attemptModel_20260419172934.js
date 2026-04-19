/**
 * Mongoose schema and model for student quiz attempts.
 * Each attempt stores the quiz ID, student ID, the answers object,
 * the computed score, and a submission timestamp.
 * Attempts live in their own "attempts" collection since they grow
 * independently of quizzes and are queried per-student.
 */

import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, required: true },
    student: { type: String, required: true },
    answers: { type: mongoose.Schema.Types.Mixed, default: {} },
    score: { type: Number, default: 0 },
    submittedAt: { type: String, default: () => new Date().toISOString() },
  },
  { collection: "attempts" }
);

const AttemptModel = mongoose.model("AttemptModel", attemptSchema);
export default AttemptModel;