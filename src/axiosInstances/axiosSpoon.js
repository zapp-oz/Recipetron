const axios = require("axios")

const axiosSpoon = axios.create({
    baseURL: "https://api.spoonacular.com/recipes/complexSearch",
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
      }
})

// const reqInterceptor = axiosRecipe.interceptors.request.use(req => {
//     console.log("req", req)
//     return Promise.resolve(req)
// }, err => {
//     console.log("err", err)
//     return Promise.reject(err)
// })

// const resInterceptor = axiosRecipe.interceptors.response.use(res => {
//     // console.log("res", res.data.results)
//     return Promise.resolve(res)
// }, err => {
//     console.log("err", err)
//     return Promise.reject(err)
// })

module.exports = axiosSpoon