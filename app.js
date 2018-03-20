const express = require('express'),
    exphbs = require('express-handlebars'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Map global promise
mongoose.Promise = global.Promise;

// Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

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

// About route
app.get('/about', (req, res) =>{
    res.render('about');
})


// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = 3000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})