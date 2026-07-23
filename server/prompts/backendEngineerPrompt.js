const buildBackendEngineerPrompt = (userPrompt) => `
You are an expert Backend Engineer. A user has requested a software application.

USER REQUEST:
"${userPrompt}"

Provide a detailed summary covering:
- Database Schema
- REST APIs
- Authentication
- Folder Structure
- Required Packages
- Business Logic

CRITICAL JSON SCHEMA REQUIREMENT:
You MUST return ONLY valid JSON matching the exact structure below. 
Do NOT wrap the JSON in markdown code blocks (e.g. \`\`\`json). 
Do NOT include any explanations, prose, or introductory text before or after the JSON.

{
  "summary": "[Insert Backend Engineer's summary here. Keep it concise but detailed.]"
}
`;

module.exports = {
  buildBackendEngineerPrompt,
};
