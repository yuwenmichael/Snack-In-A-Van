// import required dependencies 
const mongoose = require("mongoose")

// define food Schema
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    foodId: String,
    description: String,
    price: Number,
    photo: String,
})

const Food = mongoose.model("Food", foodSchema)

// export schema
module.exports = Food