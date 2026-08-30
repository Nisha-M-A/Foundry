require('dotenv').config();
const { generateAgentResponse } = require('./services/gemini.service');
const { buildUIDesignerPrompt } = require('./prompts/uiDesignerPrompt');
const { uiDesignerSchema } = require('./schemas/agent.schema');
const { buildProductManagerPrompt } = require('./prompts/productManagerPrompt');
const { productManagerSchema } = require('./schemas/agent.schema');
const { buildArchitectPrompt } = require('./prompts/architectPrompt');
const { systemArchitectSchema } = require('./schemas/agent.schema');
const { buildBackendEngineerPrompt } = require('./prompts/backendEngineerPrompt');
const { backendEngineerSchema } = require('./schemas/agent.schema');

const prompt = 'Local Eats Delivery Platform';

async function testV1() {
  console.log('Testing V1 Generation for all 4 agents...');
  try {
    const pmPromise = generateAgentResponse(buildProductManagerPrompt(prompt), productManagerSchema);
    const archPromise = generateAgentResponse(buildArchitectPrompt(prompt), systemArchitectSchema);
    const uiPromise = generateAgentResponse(buildUIDesignerPrompt(prompt), uiDesignerSchema);
    const backendPromise = generateAgentResponse(buildBackendEngineerPrompt(prompt), backendEngineerSchema);

    const [pmResult, archResult, uiResult, backendResult] = await Promise.all([
      pmPromise, archPromise, uiPromise, backendPromise
    ]);

    console.log('\n--- UI Designer Result ---');
    console.log(JSON.stringify(uiResult.blueprint.screens, null, 2));

    console.log('\nTest Passed! All agents generated successfully.');
  } catch (error) {
    console.error('Test Failed:', error.message);
  }
}

testV1();
