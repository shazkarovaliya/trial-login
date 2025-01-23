const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2');

const { setUser, getUser, clearUser } = require('../frontend/src/components/variables');

const app = express();
app.use(bodyParser.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://trial-login-production-c2f7.up.railway.app",
  "https://trial-login.netlify.app",
  "https://accounting-app-6e5bh.ondigitalocean.app/"
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
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: true, // Change to true if using HTTPS
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  },
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

// const con = mysql.createConnection({
//   host: "sql5.freesqldatabase.com",
//   user: "sql5740447",
//   password: "rZkA74RPjE",
//   database: "sql5740447",
//   port: "3306"
// });

 const con = mysql.createConnection({
  user: "doadmin",
  password: "AVNS_hn-9j4TZtNHDs1L0MDF",
  host: "db-mysql-nyc3-12891-do-user-13444788-0.j.db.ondigitalocean.com",
  port: "25060",
  database: "defaultdb",
 })

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
  const { name, username, password, phone, email, business, address } = req.body;
  const records = [[name, username, password, phone, email, business, address]];

  if (records[0][0] != null) {
    con.query("INSERT INTO Login (name, username, password, phone, email, business, address) VALUES ?", [records], function(err, result) {
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

  const query = "SELECT user_id, username FROM Login WHERE username = ? AND password = ?";
  con.query(query, [name, password], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error');
    }

    if (result.length > 0) {
      const userData = {
        user_id: result[0].user_id,
        username: result[0].username,
      };
      setUser(userData);
      res.status(200).json({ message: 'Login successful', user: userData });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

app.get('/checkSession', (req, res) => {
  if (getUser != null) {
    // User is logged in
    res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    // User is not logged in
    res.json({ isLoggedIn: false });
  }
});

app.get('/settings', (req, res) => {
  if (req.session.user) {
    const userId = req.session.user.user_id;
    con.query("SELECT * FROM TDOptions WHERE user_id = ?", [userId], function(err, results) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching options' });
      }
      res.json({ td_options: results });
    });
  } else {
    res.status(401).json({
      message: 'Unauthorized access:',
      error: 'Session not found or expired',
    });
  }
});

app.post('/settings', (req, res) => {
  const { dd_option } = req.body;
  const userId = req.session.user.user_id; // Get the logged-in user's ID

  if (dd_option != null && userId) {
    const records = [[dd_option, userId]];

    con.query("INSERT INTO TDOptions (dd_option, user_id) VALUES ?", [records], function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database insertion error', err });
      }
      console.log(result);
      res.json("Form received");
    });
  } else {
    res.status(400).json({ message: 'Invalid input data or unauthorized user' });
  }
});

app.delete('/settings/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.user_id;

  if (userId) {
    con.query("DELETE FROM TDOptions WHERE id = ? AND user_id = ?", [id, userId], function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error deleting option', err });
      }
      res.json({ message: 'Option deleted successfully' });
    });
  } else {
    res.status(401).json({ message: 'Unauthorized access' });
  }
});

app.put('/settings/:id', (req, res) => {
  const { id } = req.params;
  const { dd_option } = req.body;
  const userId = req.session.user.user_id;

  if (userId) {
    con.query(
      "UPDATE TDOptions SET dd_option = ? WHERE id = ? AND user_id = ?",
      [dd_option, id, userId],
      function(err, result) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error updating option', err });
        }
        res.json({ message: 'Option updated successfully' });
      }
    );
  } else {
    res.status(401).json({ message: 'Unauthorized access' });
  }
});

// Update description or bank options
app.put('/editOption/:id', (req, res) => {
  const { id } = req.params;
  const { bank, dd_option } = req.body; // Assuming the request body will have either 'bank' or 'dd_option'
  const userId = req.session.user.user_id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  let tableName = '';
  let fieldToUpdate = '';
  let newValue = '';

  if (bank) {
    tableName = 'BankOptions';
    fieldToUpdate = 'bank';
    newValue = bank;
  } else if (dd_option) {
    tableName = 'TDOptions';
    fieldToUpdate = 'dd_option';
    newValue = dd_option;
  } else {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  // Update the option in the corresponding table
  const updateQuery = `UPDATE ${tableName} SET ${fieldToUpdate} = ? WHERE id = ? AND user_id = ?`;
  
  con.query(updateQuery, [newValue, id, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database update error', err });
    }

    // If updating a bank or description option, update the Transactions table accordingly
    if (tableName === 'BankOptions') {
      con.query(
        'UPDATE Transactions SET account = ? WHERE account = ? AND user_id = ?',
        [newValue, req.body.originalValue, userId],
        (err) => {
          if (err) {
            console.error('Error updating Transactions:', err);
            return res.status(500).json({ message: 'Error updating transactions' });
          }
        }
      );
    } else if (tableName === 'TDOptions') {
      con.query(
        'UPDATE Transactions SET description = ? WHERE description = ? AND user_id = ?',
        [newValue, req.body.originalValue, userId],
        (err) => {
          if (err) {
            console.error('Error updating Transactions:', err);
            return res.status(500).json({ message: 'Error updating transactions' });
          }
        }
      );
    }

    res.json({ message: 'Option updated successfully' });
  });
});

app.get('/getBankOptions', (req, res) => {
  if (req.session.user) {
    const userId = req.session.user.user_id;
    con.query("SELECT * FROM BankOptions WHERE user_id = ?", [userId], function(err, results) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching options' });
      }
      console.log('Bank options:', results);  // Log the results to check if data is fetched correctly
      res.json({ bankOptions: results });  // Ensure the correct property is sent to the frontend
    });
  } else {
    res.status(401).json({
      message: 'Unauthorized access:',
      error: 'Session not found or expired',
    });
  }
});

app.post('/addBankOptions', (req, res) => {
  const { bank } = req.body;
  const userId = req.session.user.user_id; // Get the logged-in user's ID

  if (bank != null && userId) {
    const records = [[userId, bank]];

    con.query("INSERT INTO BankOptions (user_id, bank) VALUES ?", [records], function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database insertion error', err });
      }
      console.log(result);
      res.json("Form received");
    });
  } else {
    res.status(400).json({ message: 'Invalid input data or unauthorized user' });
  }
});

app.delete('/getBankOptions/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.user_id;

  if (userId) {
    con.query("DELETE FROM BankOptions WHERE id = ? AND user_id = ?", [id, userId], function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error deleting bank option', err });
      }
      res.json({ message: 'Bank option deleted successfully' });
    });
  } else {
    res.status(401).json({ message: 'Unauthorized access' });
  }
});

app.put('/getBankOptions/:id', (req, res) => {
  const { id } = req.params;
  const { bank } = req.body;
  const userId = req.session.user.user_id;

  if (userId) {
    con.query(
      "UPDATE BankOptions SET bank = ? WHERE id = ? AND user_id = ?",
      [bank, id, userId],
      function(err, result) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error updating bank option', err });
        }
        res.json({ message: 'Bank option updated successfully' });
      }
    );
  } else {
    res.status(401).json({ message: 'Unauthorized access' });
  }
});

app.put('/editBankOption/:id', (req, res) => {
  const { id } = req.params;
  const { newBank } = req.body;
  const userId = req.session.user.user_id;

  if (newBank && userId) {
    con.beginTransaction((err) => {
      if (err) {
        return res.status(500).json({ message: 'Transaction error', err });
      }

      // Update BankOptions table
      con.query(
        "UPDATE BankOptions SET bank = ? WHERE id = ? AND user_id = ?",
        [newBank, id, userId],
        function (err, result) {
          if (err) {
            return con.rollback(() => res.status(500).json({ message: 'Bank option update error', err }));
          }

          // Update Transactions table
          con.query(
            "UPDATE Transactions SET account = ? WHERE account = (SELECT bank FROM BankOptions WHERE id = ? AND user_id = ?)",
            [newBank, id, userId],
            function (err, result) {
              if (err) {
                return con.rollback(() => res.status(500).json({ message: 'Transaction update error', err }));
              }

              con.commit((err) => {
                if (err) {
                  return con.rollback(() => res.status(500).json({ message: 'Commit error', err }));
                }
                res.json({ message: 'Bank option and transactions updated successfully' });
              });
            }
          );
        }
      );
    });
  } else {
    res.status(400).json({ message: 'Invalid input or unauthorized user' });
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    const userId = req.session.user.user_id; // Access the user ID from session
    const query = `
      SELECT category, SUM(amount) AS total_amount
      FROM Transactions
      WHERE user_id = ?  
      GROUP BY category;
    `;

    con.query(query, [userId], function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Error fetching transactions' });
      }

      //console.log("Category Totals:", result);  // Log result to verify
      res.json({
        message: `Welcome ${req.session.user.name}`, // Display the username
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
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized access' });
  }

  const { date, category, description, account, transmeth, checkNum, memo, amount } = req.body;
  const userId = req.session.user.user_id; // Get the user ID from session
  const records = [[date, category, description, account, transmeth, checkNum, memo, amount, userId]];

  if (records[0][0] != null) {
    con.query("INSERT INTO Transactions (date, category, description, account, transmeth, checkNum, memo, amount, user_id) VALUES ?", [records], function(err, result) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database insertion error', err });
      }
      console.log(result);
      res.json("Transaction added successfully");
    });
  } else {
    res.status(400).json({ message: 'Invalid input data' });
  }
});

app.get('/category/:category', (req, res) => {
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
    console.log('Unauthorized request:', req.session);
    return res.status(401).json({ message: 'Unauthorized: No active user session' });
  }

  const { category } = req.params; // Get the category from the URL parameter
  const userId = req.session.user.user_id; // Access the user ID from the session object

  console.log('Fetching category for userId:', userId); // Debug logging

  // Query to get the sum of amounts for each description in the given category
  const query = `
    SELECT description, SUM(amount) AS total
    FROM Transactions
    WHERE category = ? AND user_id = ?
    GROUP BY description;
  `;

  con.query(query, [category, userId], function (err, result) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to fetch transactions' });
    }

    // Send the result as a JSON response with summed amounts for each description
    res.json(result);
  });
});

app.get('/description/:description', (req, res) => {
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
    console.log('Unauthorized request:', req.session);
    return res.status(401).json({ message: 'Unauthorized: No active user session' });
  }

  const { description } = req.params;
  const userId = req.session.user.user_id;

  console.log('Fetching transactions for description:', description, 'userId:', userId);

  const query = `
    SELECT id, date, category, description, account, memo, amount,
    CASE 
      WHEN category = 'Paid-Out' THEN -amount
      ELSE amount
    END as adjusted_amount
    FROM Transactions
    WHERE description = ? AND user_id = ?
  `;

  con.query(query, [description, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err.message); // Log the error
      return res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
    }

    console.log('Query results:', result); // Debug the data returned
    const total = result.reduce((sum, row) => sum + row.adjusted_amount, 0);

    res.json({
      transactions: result,
      total: total,
    });
  });
});

app.put('/transactions/:id', (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'Unauthorized: No active user session' });
  }

  const { id } = req.params;
  const { date, category, description, account, amount, memo } = req.body;

  const query = `
    UPDATE Transactions
    SET date = ?, category = ?, description = ?, account = ?, amount = ?, memo = ?
    WHERE id = ? AND user_id = ?
  `;

  const userId = req.session.user.user_id;

  con.query(query, [date, category, description, account, amount, memo, id, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Failed to update transaction' });
    }

    res.json({ message: 'Transaction updated successfully' });
  });
});

app.delete('/transactions/:id', (req, res) => {
  const { id } = req.params;
  const userId = req.session?.user?.user_id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized: No active user session' });
  }

  const query = 'DELETE FROM Transactions WHERE id = ? AND user_id = ?';

  con.query(query, [id, userId], (err, result) => {
    if (err) {
      console.error('Error deleting transaction:', err.message);
      return res.status(500).json({ message: 'Failed to delete transaction' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Transaction not found or unauthorized' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  });
});

app.get('/totalByBank', (req, res) => {
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
    console.log('Unauthorized request:', req.session);
    return res.status(401).json({ message: 'Unauthorized: No active user session' });
  }

  const userId = req.session.user.user_id; // Access the logged-in user's ID from the session

  console.log('Fetching total by bank for userId:', userId); // Debug logging

  const query = `
    SELECT account, category, SUM(amount) AS total
    FROM Transactions
    WHERE user_id = ?
    GROUP BY account, category;
  `;

  con.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database query error in /totalByBank:', err.message, err.stack);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Process results to combine Paid-In and Paid-Out amounts for the same account
    const combinedTotals = {};

    results.forEach(row => {
      // Initialize account if not already in the combinedTotals object
      if (!combinedTotals[row.account]) {
        combinedTotals[row.account] = 0;
      }

      // Adjust total based on category
      if (row.category === 'Paid-Out') {
        combinedTotals[row.account] -= Math.abs(row.total); // Subtract Paid-Out amounts
      } else if (row.category === 'Paid-In') {
        combinedTotals[row.account] += Math.abs(row.total); // Add Paid-In amounts
      }
    });

    // Convert the combined totals object into an array of results
    const finalResults = Object.keys(combinedTotals).map(account => ({
      account,
      total: combinedTotals[account] // Only include account and total in the response
    }));

    res.json(finalResults);
  });
});

app.get('/report/bank/:bank', (req, res) => {
  // Check if the user is logged in
  if (!req.session || !req.session.user) {
    console.log('Unauthorized request:', req.session);
    return res.status(401).json({ message: 'Unauthorized: No active user session' });
  }

  const { bank } = req.params; // Get the bank parameter from the URL
  const userId = req.session.user.user_id; // Extract the logged-in user's ID from the session

  console.log('Fetching report for bank:', bank, 'for userId:', userId); // Debug logging

  const query = `
    SELECT date, category, description, amount, memo
    FROM Transactions
    WHERE account = ? AND user_id = ?
  `;

  con.query(query, [bank, userId], (err, result) => {
    if (err) {
      console.error('Error fetching bank report:', err);
      return res.status(500).json({ message: 'Failed to fetch bank report' });
    }

    res.json({ report: result });
  });
});

app.post('/transfer', (req, res) => {
  const { date, fromAccount, toAccount, method, checkNumber, amount, memo } = req.body;
  const userId = req.session.user.user_id;

  if (!userId || !date || !fromAccount || !toAccount || !amount) {
    return res.status(400).json({ message: 'Invalid input data or unauthorized user' });
  }

  const fromTransaction = {
    user_id: userId, date, category: 'Paid-Out', description: 'transfer', account: fromAccount, method, check_number: method === 'check' ? checkNumber : null, memo,  amount: amount, //-Math.abs(amount),
  };

  const toTransaction = {
    user_id: userId, date, category: 'Paid-In', description: 'transfer', account: toAccount, method, check_number: method === 'check' ? checkNumber : null, memo,  amount: amount, //Math.abs(amount),
  };

  const sql = "INSERT INTO Transactions (user_id, date, category, description, account, transmeth, checkNum, memo, amount) VALUES ?";
  const values = [
    [fromTransaction.user_id, fromTransaction.date, fromTransaction.category, fromTransaction.description, fromTransaction.account, fromTransaction.method, fromTransaction.check_number, fromTransaction.memo, fromTransaction.amount],
    [toTransaction.user_id, toTransaction.date, toTransaction.category, toTransaction.description, toTransaction.account, toTransaction.method, toTransaction.check_number, toTransaction.memo, toTransaction.amount],
  ];  

  con.query(sql, [values], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database insertion error', err });
    }
    res.json({ message: 'Transfer successful' });
  });
});

app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).send('Error logging out');
    } else {
      clearUser();
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: 'Logout successful'});
    }
  });
});
