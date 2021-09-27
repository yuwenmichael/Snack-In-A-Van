// import required dependencies 
const express = require('express')
const utilities = require("./utility");
const passport = require('passport');
require('../config/passport')(passport);

// add our router 
const customerRouter = express.Router()

// add the customer controller
const customerController = require('../controllers/customerController.js');
const foodRouter = require('./foodRouter.js');
const orderRouter = require('./orderRouter.js');

customerRouter.get("/login", (req, res) => {
    res.render('login', { layout: 'beforeLogin.hbs', message: req.flash('loginMessage') });
});

//handle the POST request for login
customerRouter.post('/login', passport.authenticate('local-login', {
    successRedirect: '/customer', // redirect to the homepage
    failureRedirect: '/customer/login', // redirect back to the login page if there is an error
    failureFlash: true // allow flash messages
}));

//handle the GET request to register
customerRouter.get('/register', function(req, res) {
    res.render('register', { layout: 'beforeLogin.hbs', message: req.flash('signupMessage') })
});

//handle the POST request to register
customerRouter.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/customer', // redirect to the homepage
    failureRedirect: '/customer/register', // redirect to signup page
    failureFlash: true // allow flash messages
}));

//handle the GET request to get the chosen van
customerRouter.get('/chooseVan', customerController.getVans)

//handle the POST request to get the chosen van
customerRouter.post('/chooseVan', customerController.chooseVan)

//handle the GET request to get the customer profile
customerRouter.get('/getinfo', utilities.isLoggedInCustomer, customerController.getInfo)

//handle the GET request to change the customer profile
customerRouter.get('/changeinfo', utilities.isLoggedInCustomer, (req, res) =>
    customerController.changeInfo1(req, res)
);

//handle the POST request to change the customer profile
customerRouter.post('/changeinfo', utilities.isLoggedInCustomer, (req, res) => customerController.changeInfo(req, res))

//handle the GET request to get the Shopping Cart by the customer id
customerRouter.get('/shopping-cart', utilities.isLoggedInCustomer, utilities.isSelectedVan, customerController.findCart)

// handle the POST request to edit one quantity one food from Shopping Cart by the customer id
customerRouter.post('/shopping-cart', utilities.isLoggedInCustomer, (req, res) => customerController.editQuantity(req, res))

// handle the GET request to go to the detail of a customer's newOrders
customerRouter.get('/newOrders', utilities.isLoggedInCustomer, customerController.getAllCustomernewOrders)

// handle the POST request to add the neworder to orders
customerRouter.post('/newOrders', utilities.isLoggedInCustomer, (req, res) => customerController.placeOrder(req, res))

// handle the POST request to cancel the neworder in orders
customerRouter.post('/newOrders/cancel_order', utilities.isLoggedInCustomer, (req, res) => customerController.cancelOrder(req, res))

// handle the POST request to change the neworder in orders
customerRouter.post('/newOrders/change_order', utilities.isLoggedInCustomer, (req, res) => customerController.changeOrder(req, res))

// use the foodRouter to handle food detail
customerRouter.use('/', foodRouter)

// use the orderRouter to handle order detail
customerRouter.use('/orders', orderRouter)


//logout
customerRouter.get('/logout', function(req, res) {
    delete req.session.email;
    delete req.session.vanId;
    req.logout();
    res.redirect('/customer');
})


// export the router
module.exports = customerRouter