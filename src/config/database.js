const mongoose = require('mongoose') //importing the mongoose library to connect to mongodb database


async function connectDB() {
   try{ 
    await mongoose.connect(process.env.MONGO_URI)

    console.log("Connected to Database")
   }
   catch(err){
    console.log(err)
   }

}
module.exports = connectDB