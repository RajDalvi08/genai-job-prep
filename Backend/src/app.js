const express = require('express') //built in library
const cookieParser = require('cookie-parser') //built in library
const app = express() //access to library or instance of express

app.use(express.json()) //reading data in json format middleware(for using routes)
app.use(cookieParser()) //middleware for using cookies
/*requires all routes here */
const authRouter = require('./routes/auth.routes')

/*using all routes here */
app.use('/api/auth', authRouter)// access 

module.exports = app //exporting the app to be used in other files