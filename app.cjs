const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Database to store registered users
const users = [];

// Variable to track the last assigned user ID
let lastUserId = 0;

// Route for the index.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for the signup.html page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Handle user signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    res.send('Username already exists!');
  } else {
    // Generate a new user ID and increment the last assigned user ID
    const userId = ++lastUserId;

    // Register the new user
    users.push({ userId, username, password });
    res.redirect('/?message=signup-success');
  }
});

// Route for the signin.html page
app.get('/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signin.html'));
});

// Handle user login
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match
  const user = users.find((user) => user.username === username && user.password === password);
  if (user) {
    res.redirect('/question1'); // Redirect to question1.html on successful login
  } else {
    res.send('Invalid username or password!');
  }
});

// ...
// Route for the question1.html page
app.get('/question1', (req, res) => {
  const userId = req.query.userId; // Retrieve the user ID from the query parameters
  res.sendFile(path.join(__dirname, 'public', 'question1.html'));
});

// Handle form submission in question1.html
app.post('/question1', (req, res) => {
  // Handle the answer submission here
  const answer = req.body.question;
  console.log('Answer to Question 1:', answer);

  // Retrieve the user ID from the request object
  const userId = req.body.userId;

  // Redirect to question2.html with the user ID as a query parameter
  res.redirect('/question2');
});
// ...


// Route for the question2.html page
app.get('/question2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'question2.html'));
});

// Handle form submission in question2.html
app.post('/question2', (req, res) => {
  // Handle the answer submission here
  const answer = req.body.question;
  console.log('Answer to Question 2:', answer);

  // Perform the necessary evaluation of the answers
  res.redirect('/final'); 
});

app.get('/final', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'final.html'));
});

// Route for the sign-out
app.get('/users', (req, res) => {
  res.json(users);
});


// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log('Server is running on http://localhost:3001');
});
