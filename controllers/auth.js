const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const saltRounds = 12;

router.post('/sign-up', async (req, res) => {
    try {
      const userInDatabase = await User.findOne({ username: req.body.username });
      
      if (userInDatabase) {
        return res.status(409).json({err: 'Username already taken.'});
      }
      
      const user = await User.create({
        username: req.body.username,
        hashedPassword: bcrypt.hashSync(req.body.password, saltRounds)
      });
  
      // Construct the payload
      const payload = { username: user.username, _id: user._id };
  
      // Create the token, attaching the payload
      const token = jwt.sign({ payload }, process.env.JWT_SECRET);
  
      // Send the token instead of the user
      res.status(201).json({ token });
    } catch (err) {
      res.status(400).json({ err: err.message });
    }
  });





module.exports = router;