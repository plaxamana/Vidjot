const express = require('express'),
    mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    passport = require('passport'),
    router = express.Router();

// Load user model
require('../models/User');
const User = mongoose.model('users');

// User login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

// User registration route
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Register Form POST
router.post('/register', (req, res) => {
    let errors = [];

    if (req.body.password != req.body.password2) {
        errors.push({ text: 'Passwords do not match' });
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' });
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({ email: req.body.email })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Email is already in use');
                    res.redirect('/users/register');
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You\'re now registered and can now login');
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                    console.log(newUser);
                }
            })
    }
});

module.exports = router;