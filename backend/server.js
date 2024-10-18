const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const mysql = require('mysql');

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // React app's URL
  credentials: true
}));

app.use(session({
  secret: 'your_secret_key', // Replace with your actual secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true in production with HTTPS
}));

const urlDB = `mysql://root:QjPtaHGxFzVMWVTfyLAwsPdsxdDsANwZ@mysql.railway.internal:3306/railway`

const con = mysql.createConnection(urlDB);

con.connect(function(err) {
  if (err) {
    console.log(err);
    throw err;
  }
  console.log('connection successful');
});

app.get('/register', (req, res) => {
  res.json('OK');
});

app.post('/register', (req, res) => {
  const { name, password, phone, email, business, address } = req.body;
  const records = [[name, password, phone, email, business, address]];

  if (records[0][0] != null) {
    con.query("INSERT INTO Login (username, password, phone, email, business, address) VALUES ?", [records], function(err, result) {
      if (err) throw err;
      console.log(result);
    });
  }
  res.json("Form received");
});

app.post('/login', (req, res) => {
  const { name, password } = req.body;

  con.query("SELECT * FROM Login WHERE username = ? AND password = ?", [name, password], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Database error');
      return;
    }

    if (result.length > 0) {
      req.session.user = name; // Store username in session
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

// Define /dashboard route
app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    // Render or send data for dashboard here
    res.json({ message: `Welcome ${req.session.user}` });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: 'Logout successful' });
    }
  });
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});