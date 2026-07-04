require('dotenv').config() //importing the dotenv library to use environment variables
//basically to create dotenv file and have .env variables access

const app = require('./src/app') //importing the app from app.js file
const connectDB = require('./src/config/database')

connectDB()

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})