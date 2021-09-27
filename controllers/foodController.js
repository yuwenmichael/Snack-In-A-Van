// import required dependencies and models
const mongoose = require("mongoose")
const Food = mongoose.model("Food")
const Customer = mongoose.model("Customer")
const Cart = mongoose.model("Cart")

// function that get all food in the database
const getAllFoods = async(req, res) => {
    try {
        if (req.session.email == null) {
            thelayout = 'beforeLogin.hbs'
        } else { thelayout = 'main.hbs' }
        const foods = await Food.find().lean()
        res.render('foodlist', { "foods": foods, "vanId": req.session.vanId, layout: thelayout })
    } catch (err) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

//find one food by their id after the customer login
const getOneFood = async(req, res) => {
    try {
        if (req.session.email == null) {
            thelayout = 'beforeLogin.hbs'
        } else { thelayout = 'main.hbs' }
        //const customer = await Customer.findOne({ "_id": req.params._id }).lean()
        const oneFood = await Food.findOne({ "foodId": req.params.foodId }).lean()
        if (oneFood === null) { // no food found in database
            return res.status(404).render('error', { errorCode: '404', layout: 'initial', message: 'Food not found.' })
        }
        res.render('showFood', { "thisfood": oneFood, layout: thelayout })
    // error occurred
    } catch (err) { 
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

// add food to customer cart
const addFood = async(req, res) => {
    try {
        const thisCustomer = await Customer.findOne({ email: req.session.email })
        let addFood = await Food.findOne({ foodId: req.params.foodId })
            // add food to customer's order list
        orderRecord = new Cart({ foodId: addFood._id })
        thisCustomer.cart.push(orderRecord)
        await thisCustomer.save()
            // show the new customer record
        result = await Customer.findOne({ "email": req.session.email }).populate('cart.foodId', 'name')
        res.render("addToCart", { "thisfood": addFood.toJSON(), "thiscustomer": thisCustomer.toJSON() })
    } catch (error) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }

}

// select the quantity of food
const selectQuantity = async(req, res) => {
    try {
        const thisCustomer = await Customer.findOne({ email: req.session.email })
        let addFood = await Food.findOne({ foodId: req.params.foodId })
        res.render("selectQuantity", { "thisfood": addFood.toJSON(), "thiscustomer": thisCustomer.toJSON() })
    } catch (error) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

// add food to customer cart
const addFoodQuantity = async(req, res) => {
    try {
        // find the customer
        const thisCustomer = await Customer.findOne({ email: req.session.email })
        var shopping_cart = thisCustomer.cart
        // find the foodId
        let addFood = await Food.findOne({ foodId: req.params.foodId })
        // if there are food in shopping cart
        if (shopping_cart.length) {
            var flag = 1
            // if the food is already exist in the shopping cart, we add up the quantity
            for (var i = 0; i < shopping_cart.length; i++) {
                // compare object id using equals
                if (shopping_cart[i].foodId.equals(addFood._id)) {
                    shopping_cart[i].quantity += Number(req.body.quantity)
                    flag = 0;
                }
            }
            // cannot find the food
            if (flag) {
                // console.log("cannot find the food here")
                orderRecord = new Cart({ foodId: addFood._id, quantity: req.body.quantity })
                thisCustomer.cart.push(orderRecord)
            }
        // first time insertion
        } else { 
            orderRecord = new Cart({ foodId: addFood._id, quantity: req.body.quantity })
            thisCustomer.cart.push(orderRecord)
        }
        //find the customer's shopping cart and store the quantity
        await thisCustomer.save()
        return res.render("addToCart", { "thisfood": addFood.toJSON(), "quantity": req.body.quantity })
    } catch (error) {
        return res.status(400).render('error', { errorCode: '400', layout: 'initial', message: 'Database query failed' })
    }
}

// remember to export the functions
module.exports = {
    getAllFoods,
    getOneFood,
    addFood,
    addFoodQuantity,
    selectQuantity
}