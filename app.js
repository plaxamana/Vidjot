const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Index route
app.get('/', (req, res) =>{
    res.render('index');
});

// About route
app.get('/about', (req, res) =>{
    res.send('about');
})

const port = 3000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})