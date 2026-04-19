/**
 * Registers the quiz schema as a Mongoose model named QuizModel.
 * Wraps quizSchema so the DAO can run find, create, update, and
 * delete operations against the quizzes collection in MongoDB.
 */

import mongoose from "mongoose";
import quizSchema from "./schema.js";

const QuizModel = mongoose.model("QuizModel", quizSchema);
export default QuizModel;