const express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router();

// Load Idea model
require('../models/Idea')
const Idea = mongoose.model('Idea');

// Ideas route 
router.get('/', (req, res) => {
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas =>{
        res.render('ideas/index',{
            ideas: ideas
        });
    });
});

// Add Idea Form
router.get('/add', (req, res) =>{
    res.render('ideas/add');
})

// Edit Idea Form
router.get('/edit/:id', (req, res) =>{
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    });
});

// Process Form
router.post('/', (req, res) => {
    let errors = [];

    if(!req.body.title){
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add details'});
    }
    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
        .save()
        .then(Idea => {
            req.flash('success_msg', 'Video idea added');
            res.redirect('/ideas');
        })
    }
});

// Edit Form Process
router.put('/:id', (req, res)=> {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        // new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        idea.save()
        .then(idea =>{
            req.flash('success_msg', 'Video idea updated');
            res.redirect('/ideas');
        })
    });
});

// Delete idea
router.delete('/:id', (req, res)=>{
    Idea.remove({_id: req.params.id})
    .then(()=> {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    });
});

module.exports = router;