const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { ensureAuthenticated } = require('../helpers/auth');

// Load Schema Model
require('../models/Note');
const Note = mongoose.model('notes');

// Index page
router.get('/', ensureAuthenticated, (req, res) => {
    Note.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(notes => {
            res.render('notes/index', {
                notes: notes
            })
        })
})

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('notes/add');
})

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Note.findOne({
        _id: req.params.id
    })
        .then(note => {
            if (note.user != req.user.id) {
                req.flash('error_msg', 'Not authorized');
                res.redirect('/notes');
            } else {
                res.render('notes/edit', {
                    note: note
                });
            }

        })
})

router.post('/', ensureAuthenticated, (req, res) => {
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
            details: req.body.details,
            user: req.user.id
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
router.put('/:id', ensureAuthenticated, (req, res) => {
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

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Note.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash('error_msg', 'Note removed');
            res.redirect('/notes');
        });
});

module.exports = router;