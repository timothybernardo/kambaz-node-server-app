import QuizzesDao from "./dao.js";

export default function QuizRoutes(app, db) {
  const dao = QuizzesDao(db);

  // ── Quizzes ──────────────────────────────────────────

  const findQuizzesForCourse = (req, res) => {
    const { courseId } = req.params;
    const quizzes = dao.findQuizzesForCourse(courseId);
    res.json(quizzes);
  };

  const createQuiz = (req, res) => {
    const { courseId } = req.params;
    const quiz = { ...req.body, course: courseId };
    const newQuiz = dao.createQuiz(quiz);
    res.json(newQuiz);
  };

  const updateQuiz = (req, res) => {
    const { quizId } = req.params;
    const updated = dao.updateQuiz(quizId, req.body);
    res.json(updated);
  };

  const deleteQuiz = (req, res) => {
    const { quizId } = req.params;
    const status = dao.deleteQuiz(quizId);
    res.json(status);
  };

  const publishQuiz = (req, res) => {
    const { quizId } = req.params;
    const { published } = req.body;
    const updated = dao.publishQuiz(quizId, published);
    res.json(updated);
  };

  const getQuizById = (req, res) => {
    const { quizId } = req.params;
    const quiz = dao.findQuizById(quizId);
    if (!quiz) return res.sendStatus(404);
    res.json(quiz);
  };

  // ── Attempts ─────────────────────────────────────────

  const submitAttempt = (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);

    const quiz = dao.findQuizById(quizId);
    if (!quiz) return res.sendStatus(404);

    // Check attempt limit
    const attemptCount = dao.countAttemptsForStudent(quizId, currentUser._id);
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

    const attempt = dao.createAttempt(quizId, currentUser._id, answers, score);
    res.json(attempt);
  };

  const getMyAttempts = (req, res) => {
    const { quizId } = req.params;
    const currentUser = req.session["currentUser"];
    if (!currentUser) return res.sendStatus(401);
    const attempts = dao.findAttemptsForStudent(quizId, currentUser._id);
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