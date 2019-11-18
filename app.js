const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load routes
const notes = require('./routes/notes');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/database');

// MongoDB Init
mongoose.connect('mongodb+srv://c0d3mchn:%2Ad3v%211D%2A@cluster0-bfftn.mongodb.net/test?retryWrites=true&w=majority', {
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

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride('_method'));

// Express sessions middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash());

// Global variables
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
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

const port = process.env. PORT || 5000;

app.listen(port, (req, res) => {
    console.log(`***SERVER STARTED ON PORT ${port}***`);
})