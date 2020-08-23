const mongoose = require("mongoose")

const bookmarkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

const userSchema = new mongoose.Schema({
    sessionId: String,
    savedRecipes: [bookmarkSchema],
    checkedRecipes: [{
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "recipes"
        }
    }]
})

const User = mongoose.model("user", userSchema)

module.exports = User