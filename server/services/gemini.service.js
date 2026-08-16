const { GoogleGenAI } = require('@google/genai');

// Delay helper for exponential backoff
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
 * Generates an agent response using Gemini 2.5 Flash, with automatic retries and JSON validation.
 */
const generateAgentResponse = async (fullPrompt, schema = null) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

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

      if (schema) {
        const validationResult = schema.safeParse(jsonData);
        if (!validationResult.success) {
          console.error(`[Gemini Service] Schema validation failed for prompt prefix: "${fullPrompt.substring(0, 50)}..."`);
          console.error(validationResult.error.toString());
          throw new Error('Gemini returned data that failed schema validation.');
        }
        return validationResult.data;
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
      throw new Error(error.message || 'Failed to generate response from AI.');
    }
  }
};

module.exports = {
  generateAgentResponse,
};
