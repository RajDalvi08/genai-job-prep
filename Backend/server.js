const path = require('path');
// This forces Node to look in the exact root folder of your project, no matter where you run it from
require('dotenv').config({ path: path.resolve(__dirname, './.env') }); 


const app = require('./src/app');
const connectDB = require('./src/config/database');

connectDB();


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});