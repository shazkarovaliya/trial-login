const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
// const mysql = require('mysql');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());
const allowedOrigins = [
  'http://localhost:3000',
  "https://trial-login-production-c2f7.up.railway.app",
  "https://trial-login.netlify.app",

];

// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", function () {
  console.log("Server running on port 3001");
});

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Check if the incoming origin is in the allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'));  
    }
  },
  credentials: true  
}));

const urlDB = `mysql://root:QjPtaHGxFzVMWVTfyLAwsPdsxdDsANwZ@junction.proxy.rlwy.net:57666/railway`;

const con = mysql.createConnection(urlDB);

module.exports = con;

con.connect(function(err) {
  if (err) {
    console.log('Database connection failed:', err);
    throw err;
  }
  console.log('Database connection successful');
});

app.get('/register', (req, res) => {
  res.json('OK');
});

app.post('/register', (req, res) => {
  const { name, password, phone, email, business, address } = req.body;
  const records = [[name, password, phone, email, business, address]];

  if (records[0][0] != null) {
    con.query("INSERT INTO Login (username, password, phone, email, business, address) VALUES ?", [records], function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database insertion error' });
      }
      console.log(result);
      res.json("Form received");
    });
  } else {
    res.status(400).json({ message: 'Invalid input data' });
  }
});

app.post('/login', (req, res) => {
  const { name, password } = req.body;
  
  console.log("Session before login:", req.session);

  con.query("SELECT * FROM Login WHERE username = ? AND password = ?", [name, password], function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Database error');
      return;
    }

    if (result.length > 0) {
      req.session.user = name;  
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

app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    con.query("SELECT * FROM Transactions", (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching transactions' });
      }
      res.json({
        message: `Welcome ${req.session.user}`,
        transactions: results  // Send transactions data in response
      });
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.post('/dashboard', (req, res) => {
  const { date, category, description, amount } = req.body;
  const records = [[date, category, description, amount]];

  if (records[0][0] != null) {
    con.query("INSERT INTO Transactions (date, category, description, amount) VALUES ?", [records], function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database insertion error', err });
      }
      console.log(result);
      res.json("Form received");
    });
  } else {
    res.status(400).json({ message: 'Invalid input data' });
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
      res.json({ message: 'Logout successful'});
    }
  });
});