const router = require('express').Router();
const passport = require('passport');
const savePassword = require('../lib/passwordUtils').savePassword;
const connectdb = require('../config/database')
const User = connectdb.models.User;
const path = require('path')

 router.post('/login', passport.authenticate('local', { failureRedirect: '/wrong-password', successRedirect: '/protected-route' }));

 router.post('/register', (req, res, next) => {
    const checkname = req.body.username
    User.findOne({ username: checkname })
        .then((user) => {
            if (!user){
                const saltHash = savePassword(req.body.password);
                const salt = saltHash.salt;
                const hash = saltHash.hash;
                const newUser = new User({
                username: req.body.username,
                hash: hash,
                salt: salt,
                admin: true
                });

                newUser.save()
                .then((user) => {
                    console.log(user);
                });
                res.redirect('/');
            }
            else{
                res.redirect('/username-taken');
            }
        })
        .catch((err) => {   
            console.log(err)
    });
    
 });

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/login.html'))
});


router.get('/register', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/register.html'))
});


router.get('/protected-route', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.send('<h1>You are authenticated</h1><p><a href="/logout">Logout</a></p>');
    } else {
        res.send('<h1>You are not authenticated</h1><p><a href="/login">Login</a></p>');
    }
});

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/')
});


router.get('/wrong-password', (req, res, next) => {
    res.send('<h1>Login failed</h1>');
});
router.get('/username-taken', (req, res, next) => {
    res.send('<h1>Username already taken.</h1>');
});

module.exports = router;