const axios = require("axios")

const axiosYouTube = axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3/search"
})

module.exports = axiosYouTube