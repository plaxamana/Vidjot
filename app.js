const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

// Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    useMongoClient: true
});

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Index route
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

const port = 3000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})