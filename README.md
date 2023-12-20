<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
 
</head>

<body>

  <h1>Quiz Application</h1>

  <p>This is a RESTful API for a quiz application. The API allows users to register, login, create quizzes, retrieve active quizzes, get quiz results, and fetch a list of all quizzes. The application also provides Swagger documentation for easy exploration of the API.</p>

  <h2>Getting Started</h2>

  <h3>Prerequisites</h3>

  <p>Make sure you have Node.js and npm installed on your machine.</p>

  <h3>Installation</h3>

  <p>Clone the repository and install the dependencies:</p>

  <pre><code>git clone https://github.com/your-username/quiz-app.git
cd quiz-app
npm install
  </code></pre>

  <h3>Running the Server</h3>

  <p>Start the server:</p>

  <pre><code>npm start
  </code></pre>

  <p>The server will run on <code>http://localhost:8000</code>.</p>

  <h2>User Registration</h2>

  <h3>Endpoint</h3>

  <p>POST <code>/users/register</code></p>

  <h3>Request Body</h3>

  <pre><code>{
  "username": "your_username",
  "password": "your_password"
}
  </code></pre>

  <h2>User Login</h2>

  <h3>Endpoint</h3>

  <p>POST <code>/users/login</code></p>

  <h3>Request Body</h3>

  <pre><code>{
  "username": "your_username",
  "password": "your_password"
}
  </code></pre>

  <h2>Create Quiz</h2>

  <h3>Endpoint</h3>

  <p>POST <code>/quizzes/create-quiz</code></p>

  <h3>Request Headers</h3>

  <pre><code>x-auth-token: &lt;paste_your_token_here&gt;
  </code></pre>

  <h3>Request Body</h3>

  <pre><code>{
  "question": "What is the capital of France?",
  "options": ["Paris", "Berlin", "Madrid", "Rome"],
  "rightAnswer": 0,
  "startDate": "2023-01-01T12:00:00Z",
  "endDate": "2023-01-01T13:00:00Z",
  "status": "active"
}
  </code></pre>

  <h2>Get Active Quiz</h2>

  <h3>Endpoint</h3>

  <p>GET <code>/quizzes/get-active-quiz</code></p>

  <h3>Request Headers</h3>

  <pre><code>x-auth-token: &lt;paste_your_token_here&gt;
  </code></pre>

  <h2>Get Quiz Result</h2>

  <h3>Endpoint</h3>

  <p>GET <code>/quizzes/get-quiz-result/{quiz_id}</code></p>

  <h3>Request Headers</h3>

  <pre><code>x-auth-token: &lt;paste_your_token_here&gt;
  </code></pre>

  <h2>Get All Quizzes</h2>

  <h3>Endpoint</h3>

  <p>GET <code>/quizzes/get-all-quizzes</code></p>

  <h3>Request Headers</h3>

  <pre><code>x-auth-token: &lt;paste_your_token_here&gt;
  </code></pre>

  <h2>Swagger Documentation</h2>

  <p>Explore the API using Swagger documentation:</p>

  <a href="http://localhost:8000/api-docs" target="_blank">Swagger Docs</a>

  <h2>Description</h2>

  <p>This Quiz Application API is designed to provide a seamless experience for managing user accounts and quizzes. Users can register, login, and participate in quizzes. Quiz creation is straightforward, and results can be retrieved easily. </p>

  <h2>Troubleshooting</h2>

  <p>If you encounter any issues or have questions, feel free to contact me.</p>

  <p>Enjoy using the Quiz Application!</p>

</body>

</html>
