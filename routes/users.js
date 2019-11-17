const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


// User login route
router.get('/login', (req, res) => {
    res.send('login');
});

// User register route
router.get('/register', (req, res) => {
    res.send('register');
});

module.exports = router;