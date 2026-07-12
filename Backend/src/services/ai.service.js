const Groq = require("groq-sdk");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const {
  resume,
  selfDescription,
  jobDescription
} = require("./temp");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),

  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question can be asked in the interview"),
      intention: z.string().describe("The intention of interviewer behind asking this question"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc. "),
    })
  ).describe("Interview questions that can be asked in the interview along with their intention and how to answer them"),

  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question can be asked in the interview"),
      intention: z.string().describe("The intention of interviewer behind asking this question"),
      answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc. "),
    })
  ).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),

  skillGaps: z.array(
    z.object({
      skill: z.string().describe("The skill which the candidate is lacking"), 
      severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e.low = minor improvement needed, medium = important skill to develop, high = critical skill missing for the job.")
    })
  ).describe("List of skill gaps in the candidate's profile along with their severity"),

  preparationPlan: z.array(
    z.object({
      day: z.number().describe("The day number in the preparation plan, starting from 1"),
      focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, Mock interview"),
      tasks: z.array(z.string().describe("A specific task for the day")).describe("List of tasks for this day")   
    })
  ).describe("A day-wise preparation plan for the candidate to follow in order to improve their skills and prepare effectively for the interview.")
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    console.log("Resume Loaded:", !!resume);
    console.log("Self Description Loaded:", !!selfDescription);
    console.log("Job Description Loaded:", !!jobDescription);

    // CHANGED: Added strict structural requirements to the instructions block
    const prompt = `
Return ONLY valid JSON in exactly this format:

{
  "matchScore": 0,
  "technicalQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "behavioralQuestions": [
    {
      "question": "",
      "intention": "",
      "answer": ""
    }
  ],
  "skillGaps": [
    {
      "skill": "",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "",
      "tasks": [
        ""
      ]
    }
  ]
}

CRITICAL QUANTITY CONSTRAINTS:
1. You MUST generate EXACTLY 10 distinct items in the "technicalQuestions" array.
2. You MUST generate EXACTLY 5 distinct items in the "behavioralQuestions" array.
3. You MUST generate a comprehensive plan containing EXACTLY 14 objects in the "preparationPlan" array (representing day 1 to day 14). Do not truncate it.
4. "matchScore" MUST be a dynamically calculated integer between 1 and 100 based on profile alignment (do not leave it as 0).
Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Do not change any key names.
Do not return markdown syntax blocks (like \`\`\`json).
Do not leave arrays empty.
`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", 
      messages: [
        {
          role: "system",
          content: "Return only valid raw JSON matching the requested structure and strict item counts.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3, 
    });

    const report = JSON.parse(response.choices[0].message.content);
    
    // FIX FOR [Array] CONSOLE LOG ISSUE:
    // This allows you to view all nested arrays perfectly in your terminal window.
    console.dir(report, { depth: null, colors: true });
    
    return report;
    
  } catch (error) {
    console.error("Error generating interview report:", error);
    throw error;
  }
}

module.exports = {
  generateInterviewReport
};