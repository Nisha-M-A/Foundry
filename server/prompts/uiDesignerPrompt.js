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
  ],
  "blueprint": {
    "type": "wireframe",
    "screens": [
      {
        "id": "[lowercase-unique-id]",
        "title": "[Screen title]",
        "description": "[Short description of this screen's purpose]",
        "components": [
          {
            "title": "[UI component name]",
            "description": "[Short explanation of this component]"
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
- type must be exactly "wireframe"
- screens represent real UI screens/pages (e.g. login, dashboard, profile)
- each screen must have: id (lowercase unique string), title (string), description (string), components (array)
- each component must have: title (string), description (string)
- represent layout structure only — do NOT describe pixel measurements or exact styling
- extract information from your summary — do not invent unrelated concepts
- all values must be plain strings — no markdown, no HTML, no JSX
`;

module.exports = {
  buildUIDesignerPrompt,
};
