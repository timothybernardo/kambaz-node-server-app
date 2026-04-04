import QuizModel from "./model.js";
import AttemptModel from "./attemptModel.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao() {
  // ── Quizzes ──────────────────────────────────────────

  const findQuizzesForCourse = (courseId) =>
    QuizModel.find({ course: courseId });

  const findQuizById = (quizId) =>
    QuizModel.findById(quizId);

  const createQuiz = (quiz) =>
    QuizModel.create({
      _id: uuidv4(),
      title: "New Quiz",
      description: "",
      quizType: "Graded Quiz",
      assignmentGroup: "Quizzes",
      points: 0,
      shuffleAnswers: true,
      timeLimit: 20,
      hasTimeLimit: true,
      multipleAttempts: false,
      howManyAttempts: 1,
      showCorrectAnswers: false,
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      dueDate: "",
      availableDate: "",
      untilDate: "",
      published: false,
      questions: [],
      ...quiz,
    });

  const updateQuiz = async (quizId, updates) => {
    // Auto-calculate points from questions
    if (updates.questions) {
      updates.points = updates.questions.reduce(
        (sum, q) => sum + (q.points || 0),
        0
      );
    }
    return QuizModel.findByIdAndUpdate(quizId, { $set: updates }, { new: true });
  };

  const deleteQuiz = (quizId) =>
    QuizModel.deleteOne({ _id: quizId });

  const publishQuiz = (quizId, published) =>
    QuizModel.findByIdAndUpdate(quizId, { $set: { published } }, { new: true });

  // ── Attempts ─────────────────────────────────────────

  const createAttempt = (quizId, studentId, answers, score) =>
    AttemptModel.create({
      _id: uuidv4(),
      quiz: quizId,
      student: studentId,
      answers,
      score,
      submittedAt: new Date().toISOString(),
    });

  const findAttemptsForStudent = (quizId, studentId) =>
    AttemptModel.find({ quiz: quizId, student: studentId });

  const countAttemptsForStudent = (quizId, studentId) =>
    AttemptModel.countDocuments({ quiz: quizId, student: studentId });

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    createAttempt,
    findAttemptsForStudent,
    countAttemptsForStudent,
  };
}