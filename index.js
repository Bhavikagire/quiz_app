const express = require('express');
const rateLimit = require('express-rate-limit');
const connectDB = require('./db');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt'); // Updated import
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const quizRoutes = require('./routes/quizroute');
const app = express();
const PORT = process.env.PORT || 3000;
const userRoutes = require('./routes/userroute');


const secretKey = 'bhavika_secret_key';

require('dotenv').config();
// Connect to MongoDB
connectDB();


// Middleware
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/users', userRoutes);

app.get('/', (req, res) => res.send('Quiz Application API'));

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
        url: `http://localhost:${PORT}`, // Update with your actual server URL
        description: 'Development server',
      },
    ],
  },
  apis: ['./routes/quiz.js'], // Path to the API routes file
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// // Middleware for JWT authentication (exclude authentication for specified paths)
// // Middleware for JWT authentication
// app.use(
//   expressJwt({ secret: secretKey, algorithms: ['HS256'] })
// );

// app.use((err, req, res, next) => {
//   if (err.name === 'UnauthorizedError') {
//     console.error('Token verification error:', err);
//     return res.status(401).json({ error: 'Invalid token' });
//   }
//   next();
// });

// Routes

app.use('/quizzes', quizRoutes);



// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
