const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
// const mysql = require('mysql');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://trial-login-production-c2f7.up.railway.app",
  "https://trial-login.netlify.app",

];

// Use PORT provided in environment or default to 3000
const port = process.env.PORT || 3000;

//for online server deployment use
// app.listen(port, "0.0.0.0", function () {
//   console.log("Server running on port 3001");
// });

//for localhost use
app.listen(3001, "0.0.0.0", function () {
  console.log("Server running on port 3001");
});

app.use(session({
  secret: 'h39cj3s0',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // Secure cookies in production
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'  // SameSite set to 'none' for cross-origin requests
  }
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

// const urlDB = `mysql://root:QjPtaHGxFzVMWVTfyLAwsPdsxdDsANwZ@junction.proxy.rlwy.net:57666/railway`;

// const con = mysql.createConnection(urlDB);

const con = mysql.createConnection({
  host: "sql5.freesqldatabase.com", //"jdbc:mysql://sql5.freesqldatabase.com:3306/sql5736909",
  user: "sql5740447",
  password: "rZkA74RPjE",
  database: "sql5740447",
  port: "3306"
});

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

  con.query("SELECT * FROM Login WHERE username = ? AND password = ?", [name, password], function(err, result) {
    if (err) {
      console.log('Database error:', err);
      return res.status(500).send('Database error');
    }

    if (result.length > 0) {
      req.session.user = name;
      console.log("User logged in:", req.session.user); // Debugging session
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});


app.get('/checkSession', (req, res) => {
  if (req.session && req.session.user) {
    // User is logged in
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    // User is not logged in
    res.json({ isLoggedIn: false });
  }
});

app.get('/settings' , (req, res) => {
  if (req.session.user) {
    con.query("SELECT * FROM TDOptions", function(err, results) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching options' });
      }
      res.json({
        td_options: results
      });
    });
  } else {
    res.status(401).json({
      message: 'Unauthorized access:',
      error: 'Session not found or expired'
    });
  }
});

app.post('/settings', (req, res) => {
  const { dd_option } = req.body;
  const records = [[dd_option]];

  if (records[0][0] != null) {
    con.query("INSERT INTO TDOptions (dd_option) VALUES ?", [records], function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database insertion error', err });
      }
      console.log(result);
      res.json("Form received");
    })
  } else {
    res.status(400).json({ message: 'Invalid input data' });
  }
});

app.get('/getBankOptions', (req, res) => {
  con.query('SELECT * FROM BankOptions', (err, result) => {
    if (err) {
      console.error('Error fetching bank options:', err);
      return res.status(500).json({ message: 'Error fetching bank options', err });
    }
    res.json({ bankOptions: result });
  });
});

app.post('/addBankOption', (req, res) => {
  const { bank } = req.body;
  const records = [[bank]];

  if (records[0][0] != null) {
    con.query("INSERT INTO BankOptions (bank) VALUES ?", [records], function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database insertion error', err });
      }
      console.log(result);
      res.json("Form received");
    })
  } else {
    res.status(400).json({ message: 'Invalid input data' });
  }
});


app.get('/dashboard', (req, res) => {
  console.log("Session data:", req.session); // Check session contents
  if (req.session.user) {
    const query = `
      SELECT category, SUM(amount) AS total_amount
      FROM Transactions
      GROUP BY category;
    `;

    con.query(query, function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching transactions' });
      }
      console.log("Category Totals:", result);  // Log result to verify
      res.json({
        message: `Welcome ${req.session.user}`,
        transactions: result
        
      });
    });
  } else {
    res.status(401).json({
      message: 'Unauthorized access: No active session found. Please log in to access the dashboard.',
      error: 'Session not found or expired'
    });
  }
});


app.post('/dashboard', (req, res) => {
  const { date, category, description, account, transmeth, checkNum, memo, amount } = req.body;
  const records = [[date, category, description, account, transmeth, checkNum, memo, amount]];

  if (records[0][0] != null) {
    con.query("INSERT INTO Transactions (date, category, description, account, transmeth, checkNum, memo, amount) VALUES ?", [records], function(err, result) {
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

app.get('/category/:category', (req, res) => {
  const { category } = req.params; // Get the category from the URL parameter

  // Query the Transactions table for rows with the given category
  const query = 'SELECT description, amount FROM Transactions WHERE category = ?';

  con.query(query, [category], function (err, result) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to fetch transactions' });
    }

    // Send the result as a JSON response
    res.json(result);
  });
});

app.get('/description/:description', (req, res) => {
  const { description } = req.params;

  const query = `
    SELECT date, category, description, memo, amount,
    CASE 
      WHEN category = 'Expense' OR category = 'Investment' THEN -amount
      ELSE amount
    END as adjusted_amount
    FROM Transactions
    WHERE description = ?
  `;

  con.query(query, [description], function (err, result) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to fetch transactions' });
    }

    // Calculate total, considering negative values for Expense and Investment
    const total = result.reduce((sum, row) => sum + row.adjusted_amount, 0);

    res.json({
      transactions: result,
      total: total
    });
  });
});

app.get('/totalByBank', (req, res) => {
  const query = `
    SELECT account, SUM(amount) AS total
    FROM Transactions
    GROUP BY account;
  `;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Database query error in /totalByBank:', err.message, err.stack);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(results);
    console.log("Bank Totals:", results);
  });
});

app.get('/report/bank/:bank', (req, res) => {
  const { bank } = req.params;

  const query = `
    SELECT date, category, description, amount, memo
    FROM Transactions
    WHERE account = ?
  `;

  con.query(query, [bank], (err, result) => {
    if (err) {
      console.error('Error fetching bank report:', err);
      return res.status(500).json({ message: 'Failed to fetch bank report' });
    }

    res.json({ report: result });
  });
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