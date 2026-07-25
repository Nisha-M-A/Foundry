const buildProductManagerPrompt = (userPrompt) => `
You are an expert Product Manager. A user has requested a software application.

USER REQUEST:
"${userPrompt}"

Provide a concise, descriptive title for this project and a detailed summary covering:
- Product Vision
- Target Audience
- User Stories
- MVP Scope
- Future Features

CRITICAL JSON SCHEMA REQUIREMENT:
You MUST return ONLY valid JSON matching the exact structure below. 
Do NOT wrap the JSON in markdown code blocks (e.g. \`\`\`json). 
Do NOT include any explanations, prose, or introductory text before or after the JSON.

{
  "title": "[Insert concise title here]",
  "summary": "[Insert Product Manager's summary here. Keep it concise but detailed.]",
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
  buildProductManagerPrompt,
};
