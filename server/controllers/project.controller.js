const geminiService = require('../services/gemini.service');

/**
 * Generates a blueprint using the Gemini AI service.
 * Connects the frontend to the multi-agent AI flow while maintaining the strict JSON contract.
 */
const generateBlueprint = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'A prompt of at least 10 characters is required' });
  }

  try {
    const blueprintData = await geminiService.generateBlueprint(prompt.trim());
    
    // Ensure the success flag is present (the service returns the data structure directly, but we can enforce it here or rely on the prompt)
    if (!blueprintData.success) {
      blueprintData.success = true;
    }

    res.status(200).json(blueprintData);
  } catch (error) {
    // If the error message comes from our validation (e.g., malformed JSON), send a 400
    if (error.message.includes('malformed') || error.message.includes('schema')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    
    // Otherwise, it's a server/API error
    res.status(500).json({ success: false, message: error.message || 'Failed to generate blueprint' });
  }
};

module.exports = {
  generateBlueprint
};
