// import required dependencies 
const express = require('express')
const utilities = require("./utility");
const passport = require('passport');
require('../config/passport')(passport);

// add van router 
const vanRouter = express.Router()

// add the van controller and order router
const vanController = require('../controllers/vanController.js')
const orderRouter = require('./orderRouter.js')

// POST login form to authenticate user
vanRouter.post('/login', passport.authenticate('local-van-login', {
    successRedirect: '/vendor/send_location', // redirect to the homepage
    failureRedirect: '/vendor', // redirect back to the login page if there is an error
    failureFlash: true // allow flash messages
}));

// handle the GET request to the vender register page
vanRouter.get("/register", (req, res) => {
    res.render('vendorRegister', { layout: "initial", "message": req.flash('signupMessage') });
});

// POST - user submits the signup form -- signup a new user
vanRouter.post('/register', passport.authenticate('local-van-register', {
    successRedirect: '/vendor/send_location', // redirect to the homepage
    failureRedirect: '/vendor/register', // redirect to signup page
    failureFlash: true // allow flash messages
}));

// handle the GET request to send locations
vanRouter.get("/send_location", utilities.isLoggedIn, (req, res) => {
    res.render('setLocation', { layout: "vendorNoLocation.hbs" });
});

// handle the POST request to send locations
vanRouter.post('/send_location', utilities.isLoggedIn, (req, res) => vanController.updateLocation(req, res))

// go to home page
vanRouter.get("/home", utilities.isLoggedIn, (req, res) => vanController.getOneVan(req, res))

// update van status
vanRouter.post('/home/updateVanStatus', utilities.isLoggedIn, (req, res) => vanController.updateVanStatus(req, res))

// logout
vanRouter.get('/logout', (req, res) => vanController.logout(req, res))

vanRouter.use('/', orderRouter)

// export the router
module.exports = vanRouter