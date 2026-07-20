/**
 * Generates a mock blueprint response.
 * This establishes the permanent API contract for the AI generation flow.
 * In future stages, this will be replaced with actual Gemini SDK calls
 * while maintaining this exact return structure.
 */
const generateBlueprint = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
    return res.status(400).json({ message: 'A prompt of at least 10 characters is required' });
  }

  // Simulate network/processing delay (e.g. 2.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 2500));

  try {
    // Return the exact structure expected by the frontend
    res.status(200).json({
      success: true,
      project: {
        title: "Marketplace App",
        prompt: prompt.trim()
      },
      agents: {
        productManager: {
          status: "completed",
          summary: "Identified core user flows, defined MVP scope, and created user stories for the marketplace."
        },
        systemArchitect: {
          status: "completed",
          summary: "Designed microservices architecture, selected tech stack, and outlined data flow diagrams."
        },
        uiDesigner: {
          status: "completed",
          summary: "Created wireframes, established design system, and defined component hierarchy."
        },
        backendEngineer: {
          status: "completed",
          summary: "Defined database schema, designed RESTful API endpoints, and planned authentication flow."
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate blueprint' });
  }
};

module.exports = {
  generateBlueprint
};
