const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const s = z.object({
  candidate_name: z.string().describe("Full name"),
});

console.dir(zodToJsonSchema(s, { target: "openApi3" }), { depth: null });
