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
  "summary": "[Insert Backend Engineer's summary here. Keep it concise but detailed.]",
  "tasks": [
    "Task 1",
    "Task 2",
    "Task 3"
  ],
  "blueprint": {
    "type": "flowchart",
    "nodes": [
      {
        "id": "[lowercase-unique-id]",
        "title": "[Step title]",
        "description": "[Short description of this processing step]",
        "details": [
          "[Detail bullet 1]",
          "[Detail bullet 2]"
        ]
      }
    ],
    "edges": [
      {
        "from": "[source-node-id]",
        "to": "[target-node-id]"
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
- type must be exactly "flowchart"
- nodes represent real backend processing steps in execution order
- each node must have: id (lowercase unique string), title (string), description (string), details (array of 2–5 plain strings)
- edges must only reference ids that exist in the nodes array
- each edge must have: from (string id), to (string id)
- the edges together must form a logical execution flow
- extract information from your summary — do not invent unrelated concepts
- all values must be plain strings — no markdown, no HTML
`;

module.exports = {
  buildBackendEngineerPrompt,
};
