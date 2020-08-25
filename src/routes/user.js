const express = require("express")
const User = require("../models/user")
// const { delete, delete } = require("./recipe")

const router = express.Router()

router.get("/bookmarks", async (req, res) => {
    try {
        const user = await User.findOne({sessionId: req.cookies.id})

        if(!user){
            return res.status(400).send("User not found")
        }

        res.status(200).send({
            ...user.savedRecipes
        })
    } catch(e){
        res.status(500).send(e.message)
    }
})

router.post("/bookmarks", async (req, res) => {
    try{
        const recipeName = req.body.bookmark
        const user = await User.findOne({sessionId: req.cookies.id})

        if(!user){
            return res.status(400).send("User not found")
        }

        user.savedRecipes.push({
            name: recipeName
        })

        await user.save()

        res.status(201).send()
    } catch(e){
        res.status(500).send(e.message)
    }
})

router.delete("/bookmarks/:id", async (req, res) => {
    try{
        const user = await User.findOne({sessionId: req.cookies.id})

        if(!user){
            return res.status(400).send("User not found")
        }

        user.savedRecipes = user.savedRecipes.filter(bookmark => !(bookmark._id.equals(req.params.id)))

        await user.save()

        res.status(200).send()
    } catch(e){
        res.status(500).send(e)
    }
})

module.exports = router