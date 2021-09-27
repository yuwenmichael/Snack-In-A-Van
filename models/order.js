// import required dependencies 
const mongoose = require("mongoose")

// define item schema for items in each order
const itemSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    quantity: Number
})

// define order schema
const newOrderschema = new mongoose.Schema({
    vanId: { type: String, require: true },
    time: { type: String, required: true },
    dateCompare: { type: Date, default: Date.now },
    dateUTC: String,
    customerId: { type: String, required: true },
    items: [itemSchema],
    total: { type: String, required: true },
    status: { type: String, required: true },
    visibility: { type: Boolean, default: true },
    rating: { type: String, default: "0" },
    discount:{ type: Boolean, default: false }
})

// export schema
const Order = mongoose.model("newOrders", newOrderschema)
const Item = mongoose.model("Item", itemSchema)
module.exports = { Order, Item }