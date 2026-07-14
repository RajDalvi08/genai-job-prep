const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const {
  resume,
  selfDescription,
  jobDescription,
} = require("./temp");

let ai;
function getAiClient() {
  if (!ai) {
    ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
      httpOptions: {
        timeout: 120000 // 120 seconds timeout for large structured responses
      }
    });
  }
  return ai;
}

// Simple retry helper function to resolve the missing "callWithRetry" error
async function callWithRetry(fn, retries = 3, delay = 3000) {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    console.warn(`API call failed. Retrying in ${delay}ms... (${retries - 1} retries left)`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return callWithRetry(fn, retries - 1, delay * 1.5);
  }
}

const interviewReportSchema = z.object({
  candidate_name: z
    .string()
    .describe("Full name of the candidate being interviewed"),

  position_applied: z
    .string()
    .describe("Job position or role the candidate applied for"),

  date_of_interview: z
    .string()
    .describe("Date when the interview was conducted"),

  interviewer_name: z
    .string()
    .describe("Name of the interviewer"),

  matchScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall job match score percentage from 0 to 100"),

  atsScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Applicant Tracking System compatibility score from 0 to 100"),

  hiringProbability: z
    .number()
    .min(0)
    .max(100)
    .describe("Probability of candidate getting hired from 0 to 100"),

  interviewDifficulty: z
    .enum(["Easy", "Medium", "Hard"])
    .describe("Difficulty level of the interview"),

  overall_recommendation: z
    .object({
      rating: z
        .enum([
          "Strong Hire",
          "Hire",
          "Strong Consider",
          "Consider",
          "Reject",
        ])
        .describe("Final hiring recommendation rating"),

      reason: z
        .string()
        .describe("Reason explaining the recommendation"),
    })
    .describe("Overall hiring recommendation"),

  strengths: z
    .array(
      z.object({
        title: z
          .string()
          .describe("Name of candidate strength"),

        description: z
          .string()
          .describe("Detailed explanation of the strength"),

        evidence: z
          .string()
          .describe("Interview evidence supporting this strength"),
      })
    )
    .length(8)
    .describe("List of EXACTLY 8 major candidate strengths"),

  areas_for_improvement: z
    .array(
      z.object({
        skill: z
          .string()
          .describe("Skill or area requiring improvement"),

        priority: z
          .enum([
            "Critical",
            "Important",
            "Nice to Have",
          ])
          .describe("Priority level of improvement"),

        reason: z
          .string()
          .describe("Why this improvement area matters"),

        recommendation: z
          .string()
          .describe("Suggested action to improve this skill"),
      })
    )
    .length(5)
    .describe("EXACTLY 5 important improvement areas for the candidate"),

  technical_assessment: z
    .array(
      z.object({
        skill: z
          .string()
          .describe("Technical skill being evaluated"),

        score: z
          .number()
          .min(0)
          .max(100)
          .describe("Skill score from 0 to 100"),

        level: z
          .enum([
            "Excellent",
            "Good",
            "Average",
            "Needs Improvement",
          ])
          .describe("Skill proficiency level"),

        confidence: z
          .number()
          .min(0)
          .max(100)
          .describe("Confidence score of this assessment from 0 to 100"),

        evidence: z
          .string()
          .describe("Interview evidence supporting this evaluation"),

        assessment: z
          .string()
          .describe("Detailed evaluation of the technical skill"),
      })
    )
    .length(10)
    .describe("Technical assessment covering EXACTLY 10 important skills"),

  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("Technical interview question"),

        intention: z
          .string()
          .describe("Purpose behind asking this question"),

        answer: z
          .string()
          .describe("Expected ideal answer"),
      })
    )
    .length(10)
    .describe("EXACTLY 10 technical interview questions with explanations"),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("Behavioral interview question"),

        intention: z
          .string()
          .describe("What interviewer evaluates through this question"),

        answer: z
          .string()
          .describe("Expected strong candidate response"),
      })
    )
    .length(5)
    .describe("EXACTLY 5 behavioral interview questions"),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("Day number in the preparation schedule from 1 to 14"),

        focus: z
          .string()
          .describe("Main focus area for that preparation day"),

        tasks: z
          .array(z.string())
          .min(3)
          .describe("Minimum three unique tasks to complete on this day"),
      })
    )
    .length(14)
    .describe("EXACTLY 14-day preparation plan for the candidate"),
});

// Recursive function to strip unsupported validation properties that cause Gemini to ignore array counts
function cleanSchemaForGemini(schema) {
  if (typeof schema !== "object" || schema === null) return schema;

  const cleaned = Array.isArray(schema) ? [] : {};

  for (const key in schema) {
    // Drop fields Gemini's OpenAPI generation parser chokes on or handles outside validation bounds
    if (["minItems", "maxItems", "additionalProperties", "$schema", "defaultConfiguration"].includes(key)) {
      continue;
    }
    
    if (typeof schema[key] === "object") {
      cleaned[key] = cleanSchemaForGemini(schema[key]);
    } else {
      cleaned[key] = schema[key];
    }
  }
  return cleaned;
}

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    console.log("Resume Loaded:", !!resume);
    console.log("Self Description Loaded:", !!selfDescription);
    console.log("Job Description Loaded:", !!jobDescription);

    const prompt = `
You are an expert Technical Recruiter, Senior Software Engineer and ATS evaluator.

Analyze the following parameters thoroughly:
RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

Generate an exhaustive, highly structured interview report in raw JSON. 
You must strictly fulfill the exact array structural criteria below to pass validation:

1. matchScore: Integer (0-100)
2. atsScore: Integer (0-100)
3. hiringProbability: Integer (0-100)
4. strengths: MUST contain EXACTLY 8 distinct object elements.
5. areas_for_improvement: MUST contain EXACTLY 5 distinct object elements.
6. technical_assessment: MUST contain EXACTLY 10 distinct object elements.
7. technicalQuestions: MUST contain EXACTLY 10 distinct object elements.
8. behavioralQuestions: MUST contain EXACTLY 5 distinct object elements.
9. preparationPlan: MUST contain EXACTLY 14 objects (Day 1 through Day 14 sequence) where each 'tasks' array contains at least 3 unique items.

Do not omit any fields or leave array structures shorter than specified. If info is missing write: "Not explicitly mentioned in the resume."
`;

    console.log("Generating Interview Report from Gemini...");

    const rawJsonSchema = zodToJsonSchema(interviewReportSchema);
    const cleanedSchema = cleanSchemaForGemini(rawJsonSchema);

    const response = await callWithRetry(() =>
      getAiClient().models.generateContent({
        model: "gemini-3.5-flash", // Updated to the current standard model
        contents: prompt,
        config: {
          temperature: 0.1, 
          responseMimeType: "application/json",
          responseSchema: cleanedSchema,
        },
      }),
      3,    // Max 3 retries
      3000  // Initial delay 3s
    );

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const json = response.text.trim();
    const parsed = JSON.parse(json);
    const validation = interviewReportSchema.safeParse(parsed);

    if (!validation.success) {
      console.warn("\n========= ZOD VALIDATION FAILED BUT RETURNING RAW DATA =========");
      console.dir(validation.error.format(), { depth: null, colors: true });
      return parsed; 
    }

    const report = validation.data;
    console.log("\n========= INTERVIEW REPORT VALIDATED SUCCESSFULLY =========\n");
    return report;

  } catch (error) {
    console.error("\nInterview Report Generation Failed\n");
    console.error(error);
    throw error;
  }
}

module.exports = {
  generateInterviewReport
};