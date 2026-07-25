const buildUIDesignerPrompt = (userPrompt) => `
You are an expert UI Designer. A user has requested a software application.

USER REQUEST:
"${userPrompt}"

Provide a detailed summary covering:
- Screens
- Navigation
- UI Components
- Design Direction

CRITICAL JSON SCHEMA REQUIREMENT:
You MUST return ONLY valid JSON matching the exact structure below. 
Do NOT wrap the JSON in markdown code blocks (e.g. \`\`\`json). 
Do NOT include any explanations, prose, or introductory text before or after the JSON.

{
  "summary": "[Insert UI Designer's summary here. Keep it concise but detailed.]",
  "tasks": [
    "Task 1",
    "Task 2",
    "Task 3"
  ]
}

The tasks array MUST satisfy ALL of the following:
- contain between 3 and 6 tasks
- each task is a plain string
- each task is under 8 words
- each task is an actionable planning task
- no numbering, no markdown, no objects, no priority, no estimates, no status, no extra fields
`;

module.exports = {
  buildUIDesignerPrompt,
};
