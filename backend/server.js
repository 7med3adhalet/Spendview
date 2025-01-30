const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a connection to your MySQL database
const db = mysql.createConnection({
  host: 'localhost', // Your database host, default is 'localhost'
  user: 'root', // Your database username
  password: '', // Your database password
  database: 'banking_system', // The name of your database
});
// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});
// Signup route
app.post('/api/signup', (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(401).json({ message: 'All fields are required: fullName, email, and password' });
  }

  // Check if the user already exists
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('Error querying database for existing user:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (result.length > 0) {
      return res.status(401).json({ message: 'User already exists' });
    }

    // Insert the new user into the database
    db.query(
      'INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)',
      [fullName, email, password], // No hashing here
      (err, result) => {
        if (err) {
          console.error('Error inserting user:', err); // More detailed error logging
          return res.status(500).json({ message: 'Error signing up' });
        }

        // Get the user_id (last inserted user id)
        const userId = result.insertId;

        // Insert user info into the userinfo table
        const userInfoQuery = 'INSERT INTO userinfo (user_id, balance, monthly_income, phone_number, address, account_creation_date) VALUES (?, ?, ?, ?, ?, ?)';
        const userInfoValues = [userId, 0, 0, 0, '', new Date()];

        db.query(userInfoQuery, userInfoValues, (err) => {
          if (err) {
            console.error('Error inserting user info:', err);
            console.error('Query:', userInfoQuery);
            console.error('Values:', userInfoValues);
            return res.status(500).json({ message: 'Error creating user info' });
          }

          res.status(201).json({ message: 'Signup successful' });
        });
      }
    );
  });
});
// Login route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (result.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result[0];

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Respond with the user info (you can add more user data to the response if needed)
    res.json({ message: 'Login successful',id: user.id });
  });
});
//display the logged in user's balance 
app.get('/api/display-user-info/:id', (req, res) => {
  const userId = req.params.id; // Check if this is properly parsed

  const query = 'SELECT balance FROM userinfo WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user info:', err); // Log the actual error
      res.status(500).json({ message: 'Error fetching user info' });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json({ balance: results[0].balance });
    }
  });
});
// Endpoint to get all user information by user ID
app.get('/api/get-info/:id', (req, res) => {
  const userId = req.params.id;

  // Query to retrieve all user-related data by joining users and userinfo tables
  db.query(
    `SELECT users.id, users.fullName, users.email, users.password, userinfo.date_of_birth, 
            userinfo.balance, userinfo.monthly_income, userinfo.phone_number, userinfo.address
     FROM users 
     INNER JOIN userinfo ON users.id = userinfo.user_id 
     WHERE users.id = ?`,
    [userId],
    (err, result) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ message: 'Error fetching user data' });
      }

      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(result[0]); // Send all the user's information as a JSON response
    }
  );
});
// Update logged in user's information 
app.put('/api/update-user/:id', (req, res) => {
  const userId = req.params.id;
  const { fullName, email, password, date_of_birth, balance, monthly_income, phone_number, address } = req.body;

  // Query to check if the user exists
  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, result) => {
    if (err) {
      console.error('Error checking user existence:', err);
      return res.status(500).json({ message: 'Error checking user existence' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare the update query
    const updateQuery = `
      UPDATE users 
      SET fullName = ?, email = ?, password = ?
      WHERE id = ?
    `;
    const updateValues = [fullName, email, password, userId];

    db.query(updateQuery, updateValues, (err) => {
      if (err) {
        console.error('Error updating user data:', err);
        return res.status(500).json({ message: 'Error updating user data' });
      }

      // Update userinfo table with the new data
      const updateUserInfoQuery = `
        UPDATE userinfo
        SET date_of_birth = ?, balance = ?, monthly_income = ?, phone_number = ?, address = ?
        WHERE user_id = ?
      `;
      const updateUserInfoValues = [date_of_birth, balance, monthly_income, phone_number, address, userId];

      db.query(updateUserInfoQuery, updateUserInfoValues, (err) => {
        if (err) {
          console.error('Error updating user info:', err);
          return res.status(500).json({ message: 'Error updating user info' });
        }

        res.status(200).json({ message: 'User updated successfully' });
      });
    });
  });
});
//transfer money from the logged in user's account to the recievers email account
app.post('/api/transfer', (req, res) => {
  const { senderEmail, receiverEmail, amount, password } = req.body;

  // Ensure the sender exists and validate the password
  const senderQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(senderQuery, [senderEmail], (err, senderResult) => {
    if (err || senderResult.length === 0) {
      return res.status(404).json({ message: 'Sender not found' });
    }

    const sender = senderResult[0];

    // Fetch sender's balance from the userinfo table
    const senderBalanceQuery = 'SELECT balance FROM userinfo WHERE user_id = ?';
    db.query(senderBalanceQuery, [sender.id], (err, balanceResult) => {
      if (err || balanceResult.length === 0) {
        return res.status(404).json({ message: 'Sender balance not found' });
      }

      const senderBalance = balanceResult[0].balance;

      if (senderBalance < amount) {
        return res.status(401).json({ message: 'Insufficient balance' });
      }

      // Verify password (you should hash the password in production)
      if (password !== sender.password) {
        return res.status(401).json({ message: 'Invalid password' });
      }

      // Proceed to update sender and receiver balances
      const receiverQuery = 'SELECT * FROM users WHERE email = ?';
      db.query(receiverQuery, [receiverEmail], (err, receiverResult) => {
        if (err || receiverResult.length === 0) {
          return res.status(404).json({ message: 'Receiver not found' });
        }

        const receiver = receiverResult[0];

        // Fetch receiver's balance from the userinfo table
        const receiverBalanceQuery = 'SELECT balance FROM userinfo WHERE user_id = ?';
        db.query(receiverBalanceQuery, [receiver.id], (err, receiverBalanceResult) => {
          if (err || receiverBalanceResult.length === 0) {
            return res.status(404).json({ message: 'Receiver balance not found' });
          }

          const receiverBalance = receiverBalanceResult[0].balance;

          // Start a transaction to update both sender's and receiver's balances
          db.beginTransaction((err) => {
            if (err) {
              return res.status(500).json({ message: 'Transaction initiation failed', error: err });
            }

            // Deduct from sender's balance
            const updateSenderQuery = 'UPDATE userinfo SET balance = balance - ? WHERE user_id = ?';
            db.query(updateSenderQuery, [amount, sender.id], (err, senderUpdateResult) => {
              if (err) {
                db.rollback(() => {
                  return res.status(500).json({ message: 'Error updating sender balance', error: err });
                });
              }

              // Add to receiver's balance
              const updateReceiverQuery = 'UPDATE userinfo SET balance = balance + ? WHERE user_id = ?';
              db.query(updateReceiverQuery, [amount, receiver.id], (err, receiverUpdateResult) => {
                if (err) {
                  db.rollback(() => {
                    return res.status(500).json({ message: 'Error updating receiver balance', error: err });
                  });
                }

                // Log the transaction
                const transactionQuery = 'INSERT INTO transactions (sender_id, receiver_id, amount) VALUES (?, ?, ?)';
                db.query(transactionQuery, [sender.id, receiver.id, amount], (err, transactionResult) => {
                  if (err) {
                    db.rollback(() => {
                      return res.status(500).json({ message: 'Error logging transaction', error: err });
                    });
                  }

                  // Commit the transaction
                  db.commit((err) => {
                    if (err) {
                      db.rollback(() => {
                        return res.status(500).json({ message: 'Error committing transaction', error: err });
                      });
                    }

                    res.status(200).json({ message: 'Transfer successful!' });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
//display  all the transactions for the logged in user
app.get('/api/transactions', (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Using the callback version of the query
  db.query(
    `
      SELECT t.id, u.email AS recipient_email, t.amount, t.transaction_date
      FROM transactions t
      JOIN users u ON t.receiver_id = u.id
      WHERE t.sender_id = ?
      ORDER BY t.transaction_date DESC
    `,
    [userId],
    (err, transactions) => {
      if (err) {
        console.error('Error fetching transactions:', err);
        return res.status(500).json({ error: 'Failed to fetch transactions' });
      }

      // Send the response with the fetched transactions
      res.json(transactions);
    }
  );
});
// display the 3 most frequent users in dashboard
app.get('/api/frequent-users/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT 
      users.fullName AS name,
      users.email,
      COUNT(CASE WHEN transactions.sender_id = ? THEN 1 ELSE NULL END) + 
      COUNT(CASE WHEN transactions.receiver_id = ? THEN 1 ELSE NULL END) AS transaction_count
    FROM 
      users
    LEFT JOIN 
      transactions ON users.id = transactions.sender_id OR users.id = transactions.receiver_id
    WHERE 
      users.id != ?  -- Exclude the logged-in user
    GROUP BY 
      users.id
    HAVING 
      transaction_count > 0  -- Only include users with transactions
    ORDER BY 
      transaction_count DESC
    LIMIT 3;
  `;

  db.query(query, [userId, userId, userId], (err, results) => {
    if (err) {
      console.error('Error fetching favorites:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    // If there are no frequent users (no transactions), return an empty array
    if (results.length === 0) {
      return res.json([]); // No favorites to display
    }

    return res.json(results);
  });
});
// display the 3 last transactions of the logged in user in dashboard
app.get('/api/last-transactions/:userId', (req, res) => {
  const { userId } = req.params;

  // SQL query to get the last 3 transactions involving the logged-in user and include receiver's email
  const query = `
    SELECT 
      transactions.id,
      transactions.sender_id,
      transactions.receiver_id,
      transactions.amount,
      transactions.transaction_date,
      users.email AS receiverEmail, -- Select receiver's email from the users table
      CASE 
        WHEN transactions.sender_id = ? THEN 'Sent'
        WHEN transactions.receiver_id = ? THEN 'Received'
      END AS transaction_type
    FROM 
      transactions
    JOIN 
      users ON users.id = transactions.receiver_id -- Join the users table to get receiver's email
    WHERE 
      transactions.sender_id = ? OR transactions.receiver_id = ?
    ORDER BY 
      transactions.transaction_date DESC
    LIMIT 3;
  `;

  // Execute the query using the logged-in user's ID
  db.query(query, [userId, userId, userId, userId], (err, results) => {
    if (err) {
      console.error('Error fetching last transactions:', err);
      res.status(500).json({ error: 'Database query error' });
    } else {
      res.json(results); // Send the last 3 transactions back as the response
    }
  });
});
// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

