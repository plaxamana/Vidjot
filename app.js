const express = require('express'),
    exphbs = require('express-handlebars'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

const app = express();

// Map global promise
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

// Load Idea model
require('./models/Idea')
const Idea = mongoose.model('Idea');

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body-parse middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Method override middleware
app.use(methodOverride('_method'));

// Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUnitialized: true
}));

// Flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
}); 

// Index routes
app.get('/', (req, res) =>{
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

// Add Idea Form
app.get('/ideas/add', (req, res) =>{
    res.render('ideas/add');
})

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) =>{
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
app.post('/ideas', (req, res) => {
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
app.put('/ideas/:id', (req, res)=> {
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
app.delete('/ideas/:id', (req, res)=>{
    Idea.remove({_id: req.params.id})
    .then(()=> {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    });
});

// About route
app.get('/about', (req, res) =>{
    res.render('about');
})

// Ideas route 
app.get('/ideas', (req, res) => {
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas =>{
        res.render('ideas/index',{
            ideas: ideas
        });
    });
});

const port = 3000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})