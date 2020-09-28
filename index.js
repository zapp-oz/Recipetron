const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const { v1: uuidv1 } = require("uuid")
const cron = require('cron')
const path = require('path')

const User = require("./src/models/user")
const Recipe = require('./src/models/recipe')

const recipeRoutes = require("./src/routes/recipe")
const userRoutes = require("./src/routes/user")
const scraper = require('./src/scraper/scrape')

const app = express()
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useUnifiedTopology: true
});

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(cookieParser())

const scrape = new cron.CronJob('0 0 0 * * *', async () => {
    await scraper.initialize()
    await Recipe.remove({})
    let content = await scraper.getResults(60);
    content.forEach(async (recipe) => {
        try{
            await Recipe.create({
                name: recipe.title
            })
        } catch(e){
        }
    })
})

scrape.start()

app.get("/api/home", async (req, res) => {
    try{
        let flag = 0;
        if(!req.cookies.id){
            flag = 1
        } else {
            const user = await User.findOne({sessionId: req.cookies.id})

            if(!user){
                flag = 1
            }
        }

        if(flag == 1){
            const id = uuidv1();
            res.cookie("id", id, {
                maxAge: 2.592e+9,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"? true: false
            })

            const newUser = new User({
                sessionId: id,
                savedRecipes: []
            })
            await newUser.save()
        } 
        res.status(200).send()

    } catch(e){
        res.status(500).send()
    }
})

app.use("/api/", recipeRoutes);
app.use("/api/", userRoutes);

app.get('/*', async (req, res) => {
    try{
        res.sendFile(path.join(__dirname, 'public/index.html'))
    } catch(e){
        res.status(500).send()
    }
})

app.listen(process.env.PORT, () => {
    console.log(`Running on port ${process.env.PORT}`)
})