import mongoose from "mongoose";

const choiceSchema = new mongoose.Schema(
  {
    id: String,
    text: String,
    isCorrect: Boolean,
  },
  { _id: false }
);

const blankSchema = new mongoose.Schema(
  {
    id: String,
    text: String,
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    type: {
      type: String,
      enum: ["Multiple Choice", "True/False", "Fill in the Blank"],
      default: "Multiple Choice",
    },
    points: { type: Number, default: 10 },
    question: String,
    choices: [choiceSchema],
    correctAnswer: mongoose.Schema.Types.Mixed, // boolean for T/F
    possibleAnswers: [String], // for Fill in the Blank
    blanks: [blankSchema],
    editing: { type: Boolean, default: false },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    course: { type: String, required: true },
    title: { type: String, default: "New Quiz" },
    description: { type: String, default: "" },
    quizType: {
      type: String,
      enum: ["Graded Quiz", "Practice Quiz", "Graded Survey", "Ungraded Survey"],
      default: "Graded Quiz",
    },
    assignmentGroup: {
      type: String,
      enum: ["Quizzes", "Exams", "Assignments", "Project"],
      default: "Quizzes",
    },
    points: { type: Number, default: 0 },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    hasTimeLimit: { type: Boolean, default: true },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: mongoose.Schema.Types.Mixed, default: false },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: String,
    availableDate: String,
    untilDate: String,
    published: { type: Boolean, default: false },
    questions: [questionSchema],
  },
  { collection: "quizzes" }
);

export default quizSchema;