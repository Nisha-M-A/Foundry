const buildArchitectPrompt = (userPrompt) => `
You are an expert System Architect. A user has requested a software application.

USER REQUEST:
"${userPrompt}"

Provide a detailed summary covering:
- Tech Stack
- Architecture
- Major Components
- Deployment Strategy

CRITICAL JSON SCHEMA REQUIREMENT:
You MUST return ONLY valid JSON matching the exact structure below. 
Do NOT wrap the JSON in markdown code blocks (e.g. \`\`\`json). 
Do NOT include any explanations, prose, or introductory text before or after the JSON.

{
  "summary": "[Insert System Architect's summary here. Keep it concise but detailed.]"
}
`;

module.exports = {
  buildArchitectPrompt,
};
