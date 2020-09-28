const express = require("express")

const Recipe = require("../models/recipe")
const User = require("../models/user")
const axiosRecipe = require("../axiosInstances/axiosSpoon")
const axiosYoutube = require("../axiosInstances/axiosYouTube")

const router = express.Router()

router.get("/recipe", async (req, res) => {
    try{
        let num = Math.floor(Math.random()*(59));

        let user = await User.findOne({sessionId: req.cookies.id})

        if(!user){
            return res.status(400).send()   
        }

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
        
        const urlSpoon = "?query=" + r.name + "&apiKey=" + process.env.SPOON_API + "&offset=0&number=1&fillIngredients=true"
        const recipeData = await axiosRecipe.get(urlSpoon)

        const urlYouTube = "?key=" + process.env.YOUTUBE_API + "&q=" + r.name + " recipe&maxResults=5&type=video&part=snippet&regionCode=US"
        const videoSnippets = await axiosYoutube.get(urlYouTube)

        user.checkedRecipes.push({
            recipe: r._id
        })
        await user.save()

        let videosData = []

        for(let snippet of videoSnippets.data.items){
            let video = {}
            video.id = snippet.id.videoId
            video.title = snippet.snippet.title
            video.description = snippet.snippet.description
            video.channel = snippet.snippet.channelTitle
            video.thumbnail = snippet.snippet.thumbnails
            videosData.push(video)   
        }

        let recipeDataUpdated = null

        if(recipeData.data.totalResults !== 0){
            recipeDataUpdated = {}
            recipeDataUpdated.image = recipeData.data.results[0].image
            recipeDataUpdated.ingredients = []
    
            for(let i of recipeData.data.results[0].missedIngredients){
                recipeDataUpdated.ingredients.push({
                    name: i.name,
                    image: i.image
                })
            }
        }

        let data = {
            recipeTitle: r.name,
            recipeData: recipeDataUpdated,
            videosData: videosData
        }

        res.status(200).send(data)
    } catch(e){
        res.status(500).send()
    }
})

module.exports = router