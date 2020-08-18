const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const { v1: uuidv1 } = require("uuid")

const User = require("./src/models/user")

const recipeRoutes = require("./src/routes/recipe")
const userRoutes = require("./src/routes/user")

const app = express()
mongoose.connect("mongodb://127.0.0.1:27017/recipetron", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.json())
app.use(cookieParser())

app.get("/home", async (req, res) => {
    try{
        if(!req.cookies.id){
            const id = uuidv1();
            res.cookie("id", id, {
                maxAge: 2.628e9,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"? true: false
            })

            const newUser = new User({
                sessionId: id,
                savedRecipes: []
            })
            newUser.save((err) => {
                console.log("error:", err)
            })
        } 
        // else {
        //     const cookies = Object.entries(req.cookies)
        //     for(cookie of cookies){
        //         console.log(cookie[0], " -> ", cookie[1])
        //     }
        // }
        res.send()

    } catch(e){
        console.log(e)
    }
})

app.use("/", recipeRoutes);
app.use("/", userRoutes);

app.listen(3000, () => {
    console.log("Running on port 3000")
})