const path = require('path');
// This forces Node to look in the exact root folder of your project, no matter where you run it from
require('dotenv').config({ path: path.resolve(__dirname, './.env') }); 

const app = require('./src/app');
const connectDB = require('./src/config/database');

// 1. Import the service function and the mock data
const { generateInterviewReport } = require('./src/services/ai.service'); 
const { resume, selfDescription, jobDescription } = require('./src/services/temp'); // Adjust path to temp if necessary

// Connect to database
connectDB();

app.listen(3000, async () => {
    console.log('Server is running on port 3000');
    
    try {
        console.log('--- Triggering Test Interview Report Generation ---');
        const report = await generateInterviewReport({
            resume,
            selfDescription,
            jobDescription
        });
        console.log('--- Report Generated Successfully! ---');
        
        // =========================================================
        // ADD THIS LINE TO PRINT THE ENTIRE OBJECT IN THE TERMINAL
        // =========================================================
        console.dir(report, { depth: null, colors: true });

    } catch (error) {
        console.error('--- Report Generation Failed on Startup ---', error);
    }
});