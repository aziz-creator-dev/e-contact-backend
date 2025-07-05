const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: 'Hash error' });

    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'DB error' });

        const newUser = {
          id: result.insertId,
          name,
          email
        };

        const token = generateToken(newUser.id);

        res.status(201).json({
          message: 'User registered',
          token,
          user: newUser
        });
      }
    );
  });
};


exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(user.id);
      res.json({ 
        message: 'Login successful', 
        token, 
        user: { id: user.id, name: user.name, email: user.email }
      });
    });
  });
};
