const express = require('express');

const app = express();

// Index route
app.get('/', (req, res) =>{
    res.send('index');
});

// About route
app.get('/about', (req, res) =>{
    res.send('about');
})

const port = 3000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
})