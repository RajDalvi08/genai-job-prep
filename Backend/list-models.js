const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

async function listModels() {
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });
  const response = await ai.models.list();
  const models = [];
  for await (const m of await ai.models.list()) {
    models.push(m.name);
  }
  console.log(models);
}

listModels().catch(console.error);
