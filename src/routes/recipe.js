const express = require("express")

const Recipe = require("../models/recipe")
const User = require("../models/user")
const axiosRecipe = require("../axiosInstances/axiosRecipe")
require("dotenv").config()

const router = express.Router()

router.get("/recipe", async (req, res) => {
    try{
        let num = Math.floor(Math.random()*(59));

        let user = await User.findOne({sessionId: req.cookies.id})

        let flag = 1
        let count = 0
        let r = null

        while(flag === 1 && count < 60){
            count++;
            r = await Recipe.findOne().skip(num).exec()
            const check = user.checkedRecipes.some((checkedRecipe) => r._id.equals(checkedRecipe.recipe));
            if(check === false){
                flag = 0                
            } else {
                num++
                num %= 60
            }
        }

        if(count === 60){
            return res.status(400).send()
        }

        user.checkedRecipes.push({
            recipe: r._id
        })
        await user.save()
        
        const url = "?query=" + r.name + "&apiKey=" + process.env.SPOON_API + "&offset=0&number=5&fillIngredients=true&addRecipeInformation=true"
        const recipeData = await axiosRecipe.get(url)

        res.status(200).send(recipeData.data)
    } catch(e){
        res.status(500).send(e)
    }
})



module.exports = router