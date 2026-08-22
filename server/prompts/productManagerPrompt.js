const buildProductManagerPrompt = (userPrompt, existingContext = null) => {
  const contextString = existingContext 
    ? `EXISTING BLUEPRINT DATA (JSON):\n${JSON.stringify(existingContext, null, 2)}\n\nYou are adding a new feature to the existing blueprint. Use the existing blueprint data as context and produce an updated blueprint that incorporates the new feature request while preserving the core structure.`
    : `A user has requested a software application.`;

  return `
You are an expert Product Manager. ${contextString}

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
  ],
  "blueprint": {
    "type": "mindmap",
    "center": "[Project name as the central node]",
    "branches": [
      {
        "title": "[Primary branch title]",
        "description": "[Short explanation of this branch]",
        "children": [
          {
            "title": "[Child node title]",
            "description": "[Short explanation]"
          }
        ]
      }
    ]
  }
}

The tasks array MUST satisfy ALL of the following:
- contain between 3 and 6 tasks
- each task is a plain string
- each task is under 8 words
- each task is an actionable planning task
- no numbering, no markdown, no objects, no priority, no estimates, no status, no extra fields

The blueprint MUST satisfy ALL of the following:
- type must be exactly "mindmap"
- center must be the project name
- branches must have between 2 and 6 items
- each branch must have: title (string), description (string), children (array)
- children may contain objects with title and description
- do NOT exceed three hierarchy levels (branches > children > grandchildren)
- extract information from your summary — do not invent unrelated concepts
- all values must be plain strings — no markdown, no HTML, no nested objects beyond the schema
`;
};

module.exports = {
  buildProductManagerPrompt,
};
