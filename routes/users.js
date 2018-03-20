const express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router();

// User login route
router.get('/login', (req, res)=>{
    res.send('login');
});

// User registration route
router.get('/register', (req, res)=>{
    res.send('register');
});

module.exports = router;