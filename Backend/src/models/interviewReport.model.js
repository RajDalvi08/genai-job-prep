const mongoose = require('mongoose')

/**
 * - job description schema: String
 * - resume text: String
 * - Self description: String
 * 
 * -matchScore : Number
 * 
 * - Technical Questions :
 *       [{
 *         question:"",
 *           intention:"",
 *             answer:"",
 *            }]
 * - Behavioral questions : 
 *       [{
 *         question:"",
 *           intention:"",
 *             answer:"",
 *            }]
 * - Skill gaps : [{
 *           skill:"",
 *           severity:{
 *            type: String,
 *             enum: ["low", "medium","high"]
 * }
 * }]
 * - preparation plan : [{
 *          day: Number,
 *          focus: String,
 *          tasks:[String]
 * }]
 */

const technicalQuestionSchema = new mongoose.Schema({
       question:{
        type: String,
        required: [true, "Technical Question is required"]
       },
       intention:{
         type: String,
        required: [true, "Intention is required"]
       },
       answer:{
         type: String,
        required: [true, "Answer is required"]
       }
}, {
    _id: false //no need to generate id for any technical question
})

const behavioralQuestionSchema = new mongoose.Schema({
     question:{
        type: String,
        required: [true, "Technical Question is required"]
       },
       intention:{
         type: String,
        required: [true, "Intention is required"]
       },
       answer:{
         type: String,
        required: [true, "Answer is required"]
       }
},{
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        required: [true, "Skill is required"]
    },
    severity:{
        type: String,
        enum: ["low", "medium", "high"],
         required: [true, "Severity is required"]
    }
},{
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true, "Day is required"]
    },
    focus:{
        type: String,
        required: [true, "Focus is required"]

    },
    tasks:{
        type: [String],
        required: [true, "Tasks is required"]
    }
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription:{
        type: String,
        required: [true, "Job description is required"]

    },
    resume:{
        type: String,
    },
   matchScore: {
    type:Number,
    min:0,
    max:100,
    index:true
},


    technicalQuestions: {
    type: [technicalQuestionSchema],
    default: []
},

behavioralQuestions: {
    type: [behavioralQuestionSchema],
    default: []
},

skillGaps: {
    type: [skillGapSchema],
    default: []
},

preparationPlan: {
    type: [preparationPlanSchema],
    default: []
},

}, {
    timestamps: true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;

//Future work can create use case of which model was performing better for analysis of report like gemini, groq, anthropic