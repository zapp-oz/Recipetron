const mongoose = require("mongoose")

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        // unique: true,
        required: true,
        trim: true
    },
    rating: {
        type: Number
    }
})

const Recipe = mongoose.model("Recipe", recipeSchema)

module.exports = Recipe

