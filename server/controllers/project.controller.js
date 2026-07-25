const geminiService = require('../services/gemini.service');
const { buildProductManagerPrompt } = require('../prompts/productManagerPrompt');
const { buildArchitectPrompt } = require('../prompts/architectPrompt');
const { buildUIDesignerPrompt } = require('../prompts/uiDesignerPrompt');
const { buildBackendEngineerPrompt } = require('../prompts/backendEngineerPrompt');

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
    const cleanPrompt = prompt.trim();

    // Launch all 4 requests simultaneously
    const pmPromise = geminiService.generateAgentResponse(buildProductManagerPrompt(cleanPrompt))
      .catch(err => ({ error: true, summary: "Error: Product Manager failed to generate a response." }));
    
    const archPromise = geminiService.generateAgentResponse(buildArchitectPrompt(cleanPrompt))
      .catch(err => ({ error: true, summary: "Error: System Architect failed to generate a response." }));
      
    const uiPromise = geminiService.generateAgentResponse(buildUIDesignerPrompt(cleanPrompt))
      .catch(err => ({ error: true, summary: "Error: UI Designer failed to generate a response." }));
      
    const backendPromise = geminiService.generateAgentResponse(buildBackendEngineerPrompt(cleanPrompt))
      .catch(err => ({ error: true, summary: "Error: Backend Engineer failed to generate a response." }));

    const [pmResult, archResult, uiResult, backendResult] = await Promise.all([
      pmPromise,
      archPromise,
      uiPromise,
      backendPromise
    ]);

    const title = pmResult.title || "Untitled Project";

    const responseData = {
      success: true,
      project: {
        title: title,
        prompt: cleanPrompt
      },
      agents: {
        productManager: {
          status: pmResult.error ? "error" : "completed",
          summary: pmResult.summary || "No summary provided.",
          tasks: pmResult.tasks || []
        },
        systemArchitect: {
          status: archResult.error ? "error" : "completed",
          summary: archResult.summary || "No summary provided.",
          tasks: archResult.tasks || []
        },
        uiDesigner: {
          status: uiResult.error ? "error" : "completed",
          summary: uiResult.summary || "No summary provided.",
          tasks: uiResult.tasks || []
        },
        backendEngineer: {
          status: backendResult.error ? "error" : "completed",
          summary: backendResult.summary || "No summary provided.",
          tasks: backendResult.tasks || []
        }
      }
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to generate blueprint' });
  }
};

module.exports = {
  generateBlueprint
};
