const buildUIDesignerPrompt = (userPrompt, existingContext = null) => {
  const contextString = existingContext 
    ? `EXISTING BLUEPRINT DATA (JSON):\n${JSON.stringify(existingContext, null, 2)}\n\nCRITICAL RULE - INCREMENTAL EVOLUTION:\nYou are modifying an existing software blueprint to incorporate ONE new feature request. The existing blueprint is the source of truth and must be preserved wherever the new feature does not require a change.\n- Preserve existing screens.\n- Determine whether the feature modifies an existing screen, adds a new screen, or adds components to an existing screen.\n- Do NOT throw away the existing screen list.\n- The number of screens does not have to increase if the feature can be integrated into existing screens.\n- Do NOT generate a new product blueprint from scratch.`
    : `A user has requested a software application.`;

  return `
You are an expert UI/UX Designer. ${contextString}

USER REQUEST:
"${userPrompt}"

Provide a detailed summary covering:
- Design Language
- Core User Flows
- Key Screens
- Component Breakdown
- Accessibility

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
        "description": "[Purpose of this screen]",
        "components": [
          {
            "title": "[Component title]",
            "description": "[Short description]"
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
- screens must contain a reasonable number of key screens, preserving existing ones if evolving a blueprint
- each screen must have: id (lowercase unique string), title (string), description (string), components (array)
- each component must have: title (string), description (string)
- extract information from your summary — do not invent unrelated concepts
- all values must be plain strings — no markdown, no HTML
`;
};

module.exports = {
  buildUIDesignerPrompt,
};
