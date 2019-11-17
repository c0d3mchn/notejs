const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// Load routes
const notes = require('./routes/notes');
const users = require('./routes/users');

// MongoDB Init
mongoose.connect('mongodb://localhost/notejs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('>>> MongoDB connected >>>'))
    .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

// Express sessions middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Connect flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

/**********************
 *******ROUTING********
 **********************/

app.get('/', (req, res) => {
    let title = 'Note JS';
    res.render('index', {
        title: title
    });
})

app.get('/about', (req, res) => {
    res.render('about');
})

/**********************
 *****SERVER START*****
 **********************/

app.use('/notes', notes);
app.use('/users', users);

const port = 5000;

app.listen(port, (req, res) => {
    console.log(`***SERVER STARTED ON PORT ${port}***`);
})