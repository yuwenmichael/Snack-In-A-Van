// import required dependencies 
const express = require('express')
const utilities = require("./utility");
// add our router 
const orderRouter = express.Router()

// add the order controller
const orderController = require('../controllers/orderController.js')

// handle the GET request to get all newOrders
orderRouter.get('/:vanId/newOrders', (req, res) => orderController.getAllnewOrders(req, res))

// handle the GET request to get the order rating
orderRouter.get('/:orderId/rating', utilities.isLoggedInCustomer, orderController.getRating)

// handle the POST request to set the order rating
orderRouter.post('/:orderId/rating', utilities.isLoggedInCustomer, orderController.finishRating)

// handle the GET request to get the outstanding orders
orderRouter.get('/orders/outstanding', utilities.isLoggedIn, utilities.isSendLocation, (req, res) => orderController.viewOutstandingOrders(req, res))

// handle the GET request to get the finished orders
orderRouter.get('/orders/history', utilities.isLoggedIn, (req, res) => orderController.viewOrderHistory(req, res))

// handle the POST request to change the status of outstanding order to complete
orderRouter.post('/orders/outstanding/:_id/updateOrderStatus', utilities.isLoggedIn, utilities.isSendLocation, (req, res) => orderController.updateOrderStatus(req, res))

// export the router
module.exports = orderRouter