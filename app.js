const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

// MongoDB Init
mongoose.connect('mongodb://localhost/notejs', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('>>> MongoDB connected >>>'))
    .catch(err => console.log(err));

// Load Schema Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

// Handlebars Middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

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
    Idea.find({})
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('notes/index', {
                ideas: ideas
            })
        })
})

app.get('/notes/add', (req, res) => {
    res.render('notes/add');
})

app.get('/notes/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            res.render('notes/edit', {
                idea: idea
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
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/notes');
            })
    }
})

// Edit form process
app.put('/notes/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            // New values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    res.redirect('/notes');
                });
        });
});

// Delete idea

app.delete('/notes/:id', (req, res) => {
    Idea.remove({ _id: req.params.id })
        .then(() => {
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