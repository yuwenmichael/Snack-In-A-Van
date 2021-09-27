// import required dependencies 
const express = require('express')
const utilities = require("./utility");
// add our router 
const foodRouter = express.Router()

// add the food controller
const foodController = require('../controllers/foodController.js')

// handle the GET request to get all foods
foodRouter.get('/menu', utilities.isSelectedVan, foodController.getAllFoods)

// handle the GET request to find one food
foodRouter.get('/menu/:foodId', utilities.isSelectedVan, foodController.getOneFood)

// handle the GET request to add one food
foodRouter.get('/menu/:foodId/add', utilities.isLoggedInCustomer, foodController.addFood)

// display the select quantity page
foodRouter.get('/menu/:foodId/select_quantity', utilities.isLoggedInCustomer, foodController.selectQuantity)

// handle the POST request to add the record quantity to the database
foodRouter.post('/menu/:foodId/add_quantity', utilities.isLoggedInCustomer, foodController.addFoodQuantity)

// export the router
module.exports = foodRouter