const { GoogleGenAI } = require('@google/genai');
const { buildBlueprintPrompt } = require('../prompts/blueprintPrompt');

// Delay helper for exponential backoff
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Validate required JSON fields
const validateBlueprintJSON = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (!data.project || !data.project.title || !data.project.prompt) return false;
  
  const agents = data.agents;
  if (!agents || typeof agents !== 'object') return false;
  if (!agents.productManager || !agents.productManager.summary) return false;
  if (!agents.systemArchitect || !agents.systemArchitect.summary) return false;
  if (!agents.uiDesigner || !agents.uiDesigner.summary) return false;
  if (!agents.backendEngineer || !agents.backendEngineer.summary) return false;

  return true;
};

// Clean markdown from Gemini response
const cleanJsonResponse = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  
  return cleaned.trim();
};

/**
 * Generates a blueprint using Gemini 2.5 Flash, with automatic retries and JSON validation.
 */
const generateBlueprint = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const fullPrompt = buildBlueprintPrompt(prompt);
  const maxRetries = 3;
  const backoffDelays = [1000, 2000, 4000]; // 1s, 2s, 4s

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
      });

      const rawText = response.text;
      
      if (!rawText) {
        throw new Error('Gemini returned an empty response.');
      }

      const cleanedText = cleanJsonResponse(rawText);
      let jsonData;

      try {
        jsonData = JSON.parse(cleanedText);
      } catch (parseError) {
        throw new Error('Gemini returned malformed JSON.');
      }

      if (!validateBlueprintJSON(jsonData)) {
        throw new Error('Gemini returned JSON that does not match the required schema.');
      }

      // Success
      return jsonData;

    } catch (error) {
      // Check if it's a rate limit or service unavailable error (429 or 503 from the SDK)
      const isRetryableStatus = error.status === 429 || error.status === 503;
      
      if (isRetryableStatus && attempt < maxRetries) {
        const waitTime = backoffDelays[attempt];
        console.warn(`[Gemini Service] HTTP ${error.status} encountered. Retrying in ${waitTime}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await delay(waitTime);
        continue; // Retry
      }

      // If we exhausted retries or it's a non-retryable error, throw a clean error
      console.error(`[Gemini Service] Generation failed: ${error.message}`);
      throw new Error(error.message || 'Failed to generate blueprint from AI.');
    }
  }
};

module.exports = {
  generateBlueprint,
};
