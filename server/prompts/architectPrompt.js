const buildArchitectPrompt = (userPrompt, existingContext = null) => {
  const contextString = existingContext 
    ? `EXISTING BLUEPRINT DATA (JSON):\n${JSON.stringify(existingContext, null, 2)}\n\nCRITICAL RULE - INCREMENTAL EVOLUTION:\nYou are modifying an existing software blueprint to incorporate ONE new feature request. The existing blueprint is the source of truth and must be preserved wherever the new feature does not require a change.\n- Preserve the V1 architecture.\n- Add or modify only the architectural components required for the feature.\n- Preserve existing services/components that remain relevant.\n- Update relevant connections/data flows.\n- Avoid unnecessary infrastructure expansion.\n- Do NOT generate a new product blueprint from scratch.`
    : `A user has requested a software application.`;

  return `
You are an expert System Architect. ${contextString}

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
  "summary": "[Insert System Architect's summary here. Keep it concise but detailed.]",
  "tasks": [
    "Task 1",
    "Task 2",
    "Task 3"
  ],
  "blueprint": {
    "type": "architecture",
    "components": [
      {
        "id": "[lowercase-unique-id]",
        "title": "[Component title]",
        "description": "[Short description of this component]"
      }
    ],
    "connections": [
      {
        "from": "[source-component-id]",
        "to": "[target-component-id]"
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
- type must be exactly "architecture"
- components must represent real system parts: services, databases, storage, gateways, external APIs
- each component must have: id (lowercase unique string), title (string), description (string)
- connections must only reference ids that exist in the components array
- each connection must have: from (string id), to (string id)
- extract information from your summary — do not invent unrelated concepts
- all values must be plain strings — no markdown, no HTML
`;
};

module.exports = {
  buildArchitectPrompt,
};
