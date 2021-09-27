// import required dependencies 
const mongoose = require("mongoose")
const bcrypt = require('bcrypt-nodejs')

// schema of shopping cart of each customer
const cartSchema = new mongoose.Schema({
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    quantity: Number
})

// schema of customer
const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: String,
    firstName: String,
    lastName: String,
    cart: [cartSchema]
})

customerSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checks if password is valid
customerSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// compile the Schemas into Models
const Customer = mongoose.model("Customer", customerSchema)
const Cart = mongoose.model("Cart", cartSchema)

// export schema
module.exports = { Customer, Cart }