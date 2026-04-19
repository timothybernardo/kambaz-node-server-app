/**
 * Express HTTP endpoints for the quizzes feature.
 * Wires each route to a DAO function and handles the req/res/session
 * layer. Covers quiz CRUD plus two attempt routes: submitAttempt
 * (scores server-side and enforces the attempt limit with a 403 when
 * exceeded) and getMyAttempts (returns the current user's attempts).
 */

import QuizzesDao from "./dao.js";

export default function QuizRoutes(app) {
  const dao = QuizzesDao();

  // ── Quizzes ──────────────────────────────────────────

  const findQuizzesForCourse = async (req, res) => {
    const { courseId } = req.params;
    const quizzes = await dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  const createQuiz = async (req, res) => {
    const { courseId } = req.params;
    const quiz = { ...req.body, course: courseId };
    const newQuiz = await dao.createQuiz(quiz);
    res.json(newQuiz);
  };

  const updateQuiz = async (req, res) => {
    const { quizId } = req.params;
    const updated = await dao.updateQuiz(quizId, req.body);
    res.json(updated);
  };

  const deleteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const status = await dao.deleteQuiz(quizId);
    res.json(status);
  };

  const publishQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { published } = req.body;
    const updated = await dao.publishQuiz(quizId, published);
    res.json(updated);
  };

  const getQuizById = async (req, res) => {
    const { quizId } = req.params;
    const quiz = await dao.findQuizById(quizId);
    if (!quiz) return res.sendStatus(404);
    res.json(quiz);
  };

  // ── Attempts ─────────────────────────────────────────

  const submitAttempt = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);

    const quiz = await dao.findQuizById(quizId);
    if (!quiz) return res.sendStatus(404);

    // Check attempt limit
    const attemptCount = await dao.countAttemptsForStudent(
      quizId,
      currentUser._id
    );
    if (!quiz.multipleAttempts && attemptCount >= 1) {
      return res.status(403).json({ message: "No attempts remaining" });
    }
    if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
      return res.status(403).json({ message: "No attempts remaining" });
    }

    // Score the attempt
    const { answers } = req.body;
    let score = 0;
    for (const question of quiz.questions) {
      const answer = answers[question._id];
      if (question.type === "Multiple Choice") {
        const correct = question.choices?.find((c) => c.isCorrect);
        if (correct && answer === correct.id) score += question.points;
      } else if (question.type === "True/False") {
        if (answer === question.correctAnswer) score += question.points;
      } else if (question.type === "Fill in the Blank") {
        const match = question.possibleAnswers?.some(
          (a) => a.toLowerCase() === String(answer).toLowerCase()
        );
        if (match) score += question.points;
      }
    }

    const attempt = await dao.createAttempt(
      quizId,
      currentUser._id,
      answers,
      score
    );
    res.json(attempt);
  };

  const getMyAttempts = async (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const attempts = await dao.findAttemptsForStudent(
      quizId,
      currentUser._id
    );
    res.json(attempts);
  };

  // ── Register Routes ───────────────────────────────────

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuiz);
  app.get("/api/quizzes/:quizId", getQuizById);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId/publish", publishQuiz);
  app.post("/api/quizzes/:quizId/attempts", submitAttempt);
  app.get("/api/quizzes/:quizId/attempts/mine", getMyAttempts);
}