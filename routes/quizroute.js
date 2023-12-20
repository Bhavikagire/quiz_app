const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const Quiz = require('../models/quizmodel');

// Middleware for extracting JWT token from headers
const extractToken = (req, res, next) => {
  const token = req.header('x-auth-token');
  req.token = token; // Make the token available in the request object
  next();
};

// Middleware for JWT authentication
const authenticate = (req, res, next) => {
  const token = req.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'bhavika_secret_key');
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

const quizRoutes = express.Router();

// Apply rate limiting middleware to all routes in quizRoutes
quizRoutes.use(limiter);

// Apply extractToken and authenticate middlewares to specific routes
quizRoutes.use(['/create-quiz', '/get-active-quiz', '/get-quiz-result/:id', '/get-all-quizzes'], extractToken, authenticate);

// Swagger Options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz Application API',
      version: '1.0.0',
      description: 'RESTful API for a quiz application',
    },
    servers: [
      {
        url: 'http://localhost:8000', // Update with your actual server URL
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/quiz.js'], // Path to the API routes file
};

const swaggerSpec = swaggerJsdoc(options);
quizRoutes.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         question:
 *           type: string
 *           description: The text of the question.
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of strings representing answer options.
 *         rightAnswer:
 *           type: integer
 *           description: The index of the correct answer in the options array.
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: The date and time (ISO format) when the quiz should start.
 *         endDate:
 *           type: string
 *           format: date-time
 *           description: The date and time (ISO format) when the quiz should end.
 *         status:
 *           type: string
 *           enum: ['active', 'finished']
 *           description: The status of the quiz.
 *         _id:
 *           type: string
 *           description: The unique identifier of the quiz.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the quiz was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the quiz was last updated.
 */

// Create Quiz Endpoint
/**
 * @swagger
 * /create-quiz:
 *   post:
 *     summary: Create a new quiz
 *     description: Endpoint to create a new quiz.
 *     tags:
 *       - Quiz
 *     requestBody:
 *       description: Quiz data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quiz'
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *         content:
 *           application/json:
 *             example:
 *               question: 'What is the capital of France?'
 *               options: ['Paris', 'Berlin', 'Madrid', 'Rome']
 *               rightAnswer: 0
 *               startDate: '2023-01-01T12:00:00Z'
 *               endDate: '2023-01-01T13:00:00Z'
 *               status: 'active'
 *               _id: '60f7f3a3e145290015f41ae7'
 *               createdAt: '2021-07-21T12:34:27.371Z'
 *               updatedAt: '2021-07-21T12:34:27.371Z'
 *       500:
 *         description: Internal Server Error
 */
quizRoutes.post('/create-quiz', async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Active Quiz Endpoint
/**
 * @swagger
 * /get-active-quiz:
 *   get:
 *     summary: Get the currently active quiz
 *     description: Endpoint to retrieve the currently active quiz.
 *     tags:
 *       - Quiz
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               question: 'What is the capital of France?'
 *               options: ['Paris', 'Berlin', 'Madrid', 'Rome']
 *               rightAnswer: 0
 *               startDate: '2023-01-01T12:00:00Z'
 *               endDate: '2023-01-01T13:00:00Z'
 *               status: 'active'
 *               _id: '60f7f3a3e145290015f41ae7'
 *               createdAt: '2021-07-21T12:34:27.371Z'
 *               updatedAt: '2021-07-21T12:34:27.371Z'
 *       404:
 *         description: No active quiz currently
 *       500:
 *         description: Internal Server Error
 */
quizRoutes.get('/get-active-quiz', async (req, res) => {
  try {
    const now = new Date();
    const activeQuiz = await Quiz.findOne({ startDate: { $lte: now }, endDate: { $gte: now } });
    if (!activeQuiz) {
      return res.status(404).json({ message: 'No active quiz currently' });
    }
    res.json(activeQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Quiz Result Endpoint
/**
 * @swagger
 * /get-quiz-result/{id}:
 *   get:
 *     summary: Get the result of a quiz
 *     description: Endpoint to retrieve the result of a quiz.
 *     tags:
 *       - Quiz
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the quiz.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               correctAnswer: 'Paris'
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Internal Server Error
 */
quizRoutes.get('/get-quiz-result/:id', async (req, res) => {
  try {
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const correctAnswerIndex = quiz.rightAnswer;
    const correctAnswer = quiz.options[correctAnswerIndex];

    res.json({ correctAnswer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All Quizzes Endpoint
/**
 * @swagger
 * /get-all-quizzes:
 *   get:
 *     summary: Get all quizzes
 *     description: Endpoint to retrieve all quizzes.
 *     tags:
 *       - Quiz
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - question: 'What is the capital of France?'
 *                 options: ['Paris', 'Berlin', 'Madrid', 'Rome']
 *                 rightAnswer: 0
 *                 startDate: '2023-01-01T12:00:00Z'
 *                 endDate: '2023-01-01T13:00:00Z'
 *                 status: 'active'
 *                 _id: '60f7f3a3e145290015f41ae7'
 *                 createdAt: '2021-07-21T12:34:27.371Z'
 *                 updatedAt: '2021-07-21T12:34:27.371Z'
 *               - question: 'What is the capital of Germany?'
 *                 options: ['Paris', 'Berlin', 'Madrid', 'Rome']
 *                 rightAnswer: 1
 *                 startDate: '2023-01-02T12:00:00Z'
 *                 endDate: '2023-01-02T13:00:00Z'
 *                 status: 'finished'
 *                 _id: '60f7f3a3e145290015f41ae8'
 *                 createdAt: '2021-07-21T12:34:27.371Z'
 *                 updatedAt: '2021-07-21T12:34:27.371Z'
 *       500:
 *         description: Internal Server Error
 */
quizRoutes.get('/get-all-quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = quizRoutes;
// ... (rest of the code remains unchanged)
