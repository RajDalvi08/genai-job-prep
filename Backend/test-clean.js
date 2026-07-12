const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const interviewReportSchema = z.object({
  candidate_name: z.string().describe("Full name of the candidate being interviewed"),
  matchScore: z.number().min(0).max(100).describe("Overall job match score percentage from 0 to 100"),
  strengths: z.array(
    z.object({
      title: z.string().describe("Name of candidate strength")
    })
  ).length(8).describe("List of 8 major candidate strengths")
});

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
console.dir(jsonSchema, { depth: null });
