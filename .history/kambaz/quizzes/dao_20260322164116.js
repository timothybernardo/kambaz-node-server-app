import { v4 as uuidv4 } from "uuid";

let quizzes = [];
let attempts = [];

export default function QuizzesDao(db) {
  // ── Quizzes ──────────────────────────────────────────
  const findQuizzesForCourse = (courseId) =>
    quizzes.filter((q) => q.course === courseId);

  const findQuizById = (quizId) =>
    quizzes.find((q) => q._id === quizId);

  const createQuiz = (quiz) => {
    const newQuiz = {
      _id: uuidv4(),
      title: "New Quiz",
      description: "",
      quizType: "Graded Quiz",
      assignmentGroup: "Quizzes",
      points: 0,
      shuffleAnswers: true,
      timeLimit: 20,
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
    };
    quizzes.push(newQuiz);
    return newQuiz;
  };

  const updateQuiz = (quizId, updates) => {
  const points = updates.questions
    ? updates.questions.reduce((sum, q) => sum + (q.points || 0), 0)
    : undefined;
  const finalUpdates = points !== undefined ? { ...updates, points } : updates;
  quizzes = quizzes.map((q) =>
    q._id === quizId ? { ...q, ...finalUpdates, _id: quizId } : q
  );
  return findQuizById(quizId);
};

  const deleteQuiz = (quizId) => {
    quizzes = quizzes.filter((q) => q._id !== quizId);
    return { deleted: true };
  };

  const publishQuiz = (quizId, published) => {
    quizzes = quizzes.map((q) =>
      q._id === quizId ? { ...q, published } : q
    );
    return findQuizById(quizId);
  };

  // ── Attempts ─────────────────────────────────────────
  const createAttempt = (quizId, studentId, answers, score) => {
    const attempt = {
      _id: uuidv4(),
      quiz: quizId,
      student: studentId,
      answers,
      score,
      submittedAt: new Date().toISOString(),
    };
    attempts.push(attempt);
    return attempt;
  };

  const findAttemptsForStudent = (quizId, studentId) =>
    attempts.filter((a) => a.quiz === quizId && a.student === studentId);

  const countAttemptsForStudent = (quizId, studentId) =>
    attempts.filter((a) => a.quiz === quizId && a.student === studentId).length;

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