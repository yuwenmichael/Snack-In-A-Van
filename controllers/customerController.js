// import required dependencies and models
const Food = require("../models/food")
const customer = require("../models/customer")
const Customer = customer.Customer
const order = require("../models/order")
const Order = order.Order
const van = require("../models/van")
const Van = van.Van
const constants = require("../public/constant")

// this function will find the shopping cart of a given customer id
const findCart = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        const cart = customer.cart
        const cartFood = []
        var total_price = 0
        // find the detail of foods
        for (var i = 0; i < cart.length; i++) {
            var oneFood = await Food.findOne({ "_id": cart[i].foodId }).lean()
            oneFood["quantity"] = cart[i].quantity
            cartFood.push(oneFood)
            total_price = total_price + Number(oneFood.price) * cart[i].quantity;
        }
        if (customer === null) {
            res.status(404)
            return res.send('Food not found')
        }
        res.render('shoppingCart', { "thiscustomer": customer, "cartFood": cartFood, "total_price": total_price })
    } catch (err) {
        console.log(err)
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Cannot find the shopping cart.' })
    }
}

// function that change the quanlity of food in the shopping cart
const editQuantity = async(req, res) => {
    try {
        // if the quantity is 0, remove the food
        if (req.body.quantity == 0) {
            await Customer.updateOne({ "email": req.session.email }, { $pull: { cart: { "foodId": req.body.item_id } } }).lean()
        // update the quantity
        } else { 
            await Food.updateOne({ name: 'Beer' }, { description: 'changed the beer' })
            await Customer.updateOne({ "email": req.session.email, "cart.foodId": req.body.item_id }, {
                $set: {
                    "cart.$.quantity": req.body.quantity
                }
            })
        }
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        const cart = customer.cart
        const cartFood = []
        var total_price = 0
        // find the detail of foods and calculate the total price
        for (var i = 0; i < cart.length; i++) {
            var oneFood = await Food.findOne({ "_id": cart[i].foodId }).lean()
            oneFood["cartId"] = cart[i]._id
            oneFood["quantity"] = cart[i].quantity
            cartFood.push(oneFood)
            total_price = total_price + Number(oneFood.price) * cart[i].quantity;
        }
        if (customer === null) {
            res.status(404)
            return res.send('Food not found')
        }
        res.render('shoppingCart', { "thiscustomer": customer, "cartFood": cartFood, "total_price": total_price })
    // return error message if error has been catched
    } catch (err) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Cannot edit this item' })
    }
}

// add one customer in the register
const changeInfo = async(req, res) => {
    // handle invalid input
    if (req.body.password2 === "" || req.body.password === "" || req.body.first_name === "" || req.body.last_name === "") {
        res.status(404)
        return res.render('changeinfofail', { "message": "blank input, type again please" })
    }
    if (!req.body.password2 === req.body.password) {
        res.status(404)
        return res.render('changeinfofail', { "message": "Please input the same passowrd twice." })
    }
    // find the customer in database
    try {
        var oneCustomer = new Customer();
        var passw = oneCustomer.generateHash(req.body.password)
        await Customer.findOneAndUpdate({ "email": req.session.email }, { "password": passw, "lastName": req.body.last_name, "firstName": req.body.first_name }).lean()
        var oneCustomer = await Customer.findOne({ "email": req.session.email })
        return res.render('successchange', { "thiscustomer": oneCustomer.toJSON() }) // return saved object to sender
    // error detected
    } catch (err) { 
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

// function that handle the get request to change the customer profile
const changeInfo1 = async(req, res) => {
    try {
        var oneCustomer = await Customer.findOne({ "email": req.session.email })
        return res.render('changeinfo', { "thiscustomer": oneCustomer.toJSON() }) // return saved object to sender
    } catch (error) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

// find all the order the current customer has ordered
const getAllCustomernewOrders = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        //display the name of each order from newest to oldest
        const newOrders = await Order.find({ "customerId": customer._id }).sort({ dateCompare: 'desc' }).lean()
        for (var i = 0; i < newOrders.length; i++) {
            var foodnames = []
            for (var j = 0; j < newOrders[i].items.length; j++) {
                var thisfood = await Food.findOne({ "_id": newOrders[i].items[j].foodId })
                var foodname_quantity = {
                    foodname: thisfood.name,
                    quantity: newOrders[i].items[j].quantity
                }
                foodnames.push(foodname_quantity)
            }
            newOrders[i]["foodnames"] = foodnames
        }
        return res.render('orderlist', { "thiscustomer": customer, "newOrders": newOrders, "cancel_time": constants.CHANGE_TIME})
    // error detected
    } catch (err) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

// place the shopping cart item into orders
const placeOrder = async(req, res) => {
    const customer = await Customer.findOne({ "email": req.session.email }).lean()
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ':' + today.getMinutes();
    var year_month_day = today.toISOString().split('T')[0];
    var time = today.toISOString().split('T')[1].split('.')[0]
    // shopping cart of current customer
    const cart = customer.cart
    if (cart.length == 0) {
        return res.render('shoppingCart', { "thiscustomer": customer })
    }
    //calculate the total price of this order
    var total_p = 0
    for (var i = 0; i < cart.length; i++) {
        var oneFood = await Food.findOne({ "_id": cart[i].foodId }).lean()
        oneFood["quantity"] = cart[i].quantity
        total_p = total_p + Number(oneFood.price) * cart[i].quantity;
    }
    var postData = {
        vanId: req.session.vanId,
        time: date,
        dateCompare: today,
        dateUTC: year_month_day + 'T' + time + 'Z',
        customerId: String(customer._id),
        items: customer.cart,
        total: total_p,
        status: "Outstanding",
    };

    var order = new Order(postData)
    // handle when nothing is in the shopping cart
    try {
        await Customer.updateOne({ "email": req.session.email }, { "cart": [] }).lean()
        await order.save()
        return res.render('orderSuccess.hbs', { "thiscustomer": customer })
    // error detected
    } catch (err) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'placing order fails' })
    }
}

// function that get the chosen van
const getVans = async(req, res, next) => {
    try {
        const vans = await Van.find({ "status": "open" });
        return res.status(200).json({
            success: true,
            count: vans.length,
            data: vans
        })
    // error detected
    } catch (err) {
        console.error(err)
        return res.status(500).render('error', { errorCode: '500', layout: 'initial', message: 'Server error' })
    }
}

// function handle the post request to the chosen van
const chooseVan = async(req, res) => {
    try {
        req.session.vanId = req.body.van_id
        return res.render('selectVanSuccess', { "vanId": req.session.vanId, layout: thelayout })
    // error detected
    } catch (err) {
        console.error(err)
        return res.status(500).render('error', { errorCode: '500', layout: 'initial', message: 'Server error' })
    }
}

// handle cancel one order but not delete it from the database
const cancelOrder = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
        //set the visibility to false
        await Order.updateOne({ "_id": req.body.orderId }, { "$set": { "visibility": false } });
        // display from newest to olderest
        const newOrders = await Order.find({ "customerId": customer._id }).sort({ dateCompare: 'desc' }).lean()
        for (var i = 0; i < newOrders.length; i++) {
            var foodnames = []
            for (var j = 0; j < newOrders[i].items.length; j++) {
                var thisfood = await Food.findOne({ "_id": newOrders[i].items[j].foodId })
                var foodname_quantity = {
                    foodname: thisfood.name,
                    quantity: newOrders[i].items[j].quantity
                }
                foodnames.push(foodname_quantity)
            }
            newOrders[i]["foodnames"] = foodnames
        }
        // console.log(newOrders)
        return res.render('orderlist', { "thiscustomer": customer, "newOrders": newOrders, "cancel_time": constants.CHANGE_TIME })
    } catch (err) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'cannot cancel the order' })
    }
}

// function that change the order detail
const changeOrder = async(req, res) => {
    try {
        const customer = await Customer.findOne({ "email": req.session.email }).lean()
            // var oneFood = await Food.findOne({ "_id": cart[i].foodId }).lean()
        const order = await Order.findOne({ "_id": req.body.orderId }).lean()
        const items = order.items
            // console.log(items)
        var newItems = []
        var cartFood = []
        total_price = 0;
        for (var i = 0; i < items.length; i++) {
            var oneFood = await Food.findOne({ "_id": items[i].foodId }).lean()
            var oneItem = {
                foodId: items[i].foodId,
                quantity: items[i].quantity
            }
            oneFood["quantity"] = items[i].quantity
            total_price += Number(oneFood.price) * items[i].quantity
            cartFood.push(oneFood)
            newItems.push(oneItem)
        }
        await Customer.updateOne({ "email": req.session.email }, { "$set": { "cart": newItems } }).lean();
        const newCustomer = await Customer.findOne({ "email": req.session.email }).lean()
        //set the visibility to false
        await Order.updateOne({ "_id": req.body.orderId }, { "$set": { "visibility": false } });
        //put back this order to the shopping cart of this customer
        return res.render('shoppingCart', { "thiscustomer": newCustomer, "cartFood": cartFood, "total_price": total_price })
    // error detected
    } catch (err) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'cannot change the order' })
    }
}

// function that get the customer info
const getInfo = async(req, res) => {
    try {
        const oneCustomer = await Customer.findOne({ "email": req.session.email })
        if (oneCustomer === null) { // no author found in database
            res.status(404)
            return res.render('loginNotSuccess', { layout: "beforeLogin" })
        }
        return res.render('customerinfo', { "thiscustomer": oneCustomer.toJSON() })
    } catch (error) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

//export the functions
module.exports = {
    findCart,
    changeInfo,
    getAllCustomernewOrders,
    placeOrder,
    getVans,
    chooseVan,
    cancelOrder,
    changeOrder,
    editQuantity,
    changeInfo1,
    getInfo
}