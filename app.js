const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

// MongoDB Init
mongoose.connect('mongodb://localhost/notejs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('>>> MongoDB connected >>>'))
    .catch(err => console.log(err));

// Load Schema Model
require('./models/Note');
const Note = mongoose.model('notes');

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

app.get('/notes', (req, res) => {
    Note.find({})
        .sort({ date: 'desc' })
        .then(notes => {
            res.render('notes/index', {
                notes: notes
            })
        })
})

app.get('/notes/add', (req, res) => {
    res.render('notes/add');
})

app.get('/notes/edit/:id', (req, res) => {
    Note.findOne({
        _id: req.params.id
    })
        .then(note => {
            res.render('notes/edit', {
                note: note
            });
        })
})

app.post('/notes', (req, res) => {
    let errors = [];

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add details' });
    }

    if (errors.length > 0) {
        res.render('notes/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Note(newUser)
            .save()
            .then(note => {
                req.flash('success_msg', 'Note added');
                res.redirect('/notes');
            })
    }
})

// Edit form process
app.put('/notes/:id', (req, res) => {
    Note.findOne({
        _id: req.params.id
    })
        .then(note => {
            // New values
            note.title = req.body.title;
            note.details = req.body.details;

            note.save()
                .then(note => {
                    req.flash('success_msg', 'Note edited');
                    res.redirect('/notes');
                });
        });
});

// Delete note

app.delete('/notes/:id', (req, res) => {
    Note.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash('error_msg', 'Note removed');
            res.redirect('/notes');
        });
});

/**********************
 *****SERVER START*****
 **********************/

const port = 5000;

app.listen(port, (req, res) => {
    console.log(`***SERVER STARTED ON PORT ${port}***`);
})