const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const {
  resume,
  selfDescription,
  jobDescription,
} = require("./temp");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});
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
    .describe("List of 8 major candidate strengths"),

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
    .describe("Five important improvement areas for the candidate"),

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
    .describe("Technical assessment covering 10 important skills"),

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
    .describe("Ten technical interview questions with explanations"),

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
    .describe("Five behavioral interview questions"),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("Day number in the preparation schedule"),

        focus: z
          .string()
          .describe("Main focus area for that preparation day"),

        tasks: z
          .array(z.string())
          .min(3)
          .describe("Minimum three tasks to complete on this day"),
      })
    )
    .length(14)
    .describe("14-day preparation plan for the candidate"),
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

    const today = new Date().toISOString().split("T")[0];

    const prompt = `
You are an expert Technical Recruiter, Senior Software Engineer and ATS evaluator.

Analyze the following:

==========================
RESUME
==========================

${resume}

==========================
SELF DESCRIPTION
==========================

${selfDescription}

==========================
JOB DESCRIPTION
==========================

${jobDescription}

Your task is to generate a complete interview report.

Guidelines:

• Return ONLY JSON.

• Do not use markdown.

• Do not wrap the JSON in backticks.

• Never invent experience.

• If something is missing write:

"Not explicitly mentioned in the resume."

Evaluate the candidate using

• Skills

• Projects

• Internship

• Education

• DSA

• Resume Quality

• Job Description

Compute

1. matchScore (0-100)

2. atsScore (0-100)

3. hiringProbability (0-100)

Determine interviewDifficulty

Choose only one

Easy

Medium

Hard

Generate

overall_recommendation

rating must be one of

Strong Hire

Hire

Strong Consider

Consider

Reject

Reason should clearly justify the decision.

Generate EXACTLY

• 8 strengths

Each must include

title

description

evidence

Evidence must reference the resume.

Generate EXACTLY

5 improvement areas

Each must include

skill

priority

reason

recommendation

Priority can only be

Critical

Important

Nice to Have

Generate EXACTLY

10 technical assessments

Each must include

skill

score

level

confidence

evidence

assessment

Level must be one of

Excellent

Good

Average

Needs Improvement

Generate EXACTLY

10 personalized technical interview questions.

Each should include

question

intention

ideal answer

Generate EXACTLY

5 behavioral interview questions.

Answers should follow the STAR approach.

Generate EXACTLY

14 preparation days.

Each day should contain

day

focus

minimum 3 tasks

The study plan should progressively improve the candidate for this job role.

Do not repeat tasks.

Return only valid JSON matching the required schema.
`;

    console.log("Generating Interview Report from Gemini...");
    const jsonSchema = zodToJsonSchema(interviewReportSchema, { target: "openApi3" });
    function cleanSchema(schema) {
      if (typeof schema !== 'object' || schema === null) return;
      
      const allowedKeys = ['type', 'description', 'properties', 'required', 'items', 'enum'];
      for (const key in schema) {
        if (key === 'properties') {
          for (const propName in schema.properties) {
            cleanSchema(schema.properties[propName]);
          }
        } else if (key === 'items') {
          cleanSchema(schema.items);
        } else if (!allowedKeys.includes(key)) {
          delete schema[key];
        }
      }
    }
    cleanSchema(jsonSchema);

        const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",

      contents: prompt,

      config: {
        temperature: 0.2,

        responseMimeType: "application/json",

        responseSchema: jsonSchema,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    const json = response.text.trim();

    let parsed;

    try {
      parsed = JSON.parse(json);
    } catch (err) {
      console.error("Invalid JSON returned by Gemini:");
      console.log(json);

      throw new Error("Gemini returned invalid JSON.");
    }

    const validation = interviewReportSchema.safeParse(parsed);

    if (!validation.success) {
      console.error("\n========= ZOD VALIDATION FAILED =========\n");

      console.dir(validation.error.format(), {
        depth: null,
        colors: true,
      });

      throw new Error("Interview report failed schema validation.");
    }

    const report = validation.data;

    console.log("\n========= INTERVIEW REPORT =========\n");

    console.dir(report, {
      depth: null,
      colors: true,
    });

    console.log("\n=====================================\n");

    return report;

  } catch (error) {

    console.error("\nInterview Report Generation Failed\n");

    console.error(error);

    throw error;
  }
}

module.exports = {
  generateInterviewReport,
};