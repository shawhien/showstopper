const router = require('express').Router();
const db = require('../models');
require('dotenv').config();
const axios = require('axios');
const isLoggedIn = require('../middleware/isLoggedIn');

//shows an user's profile
router.get('/', isLoggedIn, (req,res) => {
    
    db.user.findByPk(req.user.id, {include: [db.artist,db.song]})
    .then(user => {
        res.render('profile', {user})
    })
    .catch(err => {
        console.log(err);
        res.redirect('/*')
    })
})

//change name form
router.get('/name', (req,res) => {
    res.render('profile/name')
})

//route to change name
router.put('/name', (req,res) => {
    let newName = req.body.name
    db.user.update({name: newName}, {where: {id: req.user.id}})
    .then(() => {
        res.redirect('/profile')
    })
    .catch(err => {
        console.log(err)
        res.redirect('/*')
    })
})


module.exports = router;