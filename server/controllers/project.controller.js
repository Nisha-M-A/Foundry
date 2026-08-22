const geminiService = require('../services/gemini.service');
const { buildProductManagerPrompt } = require('../prompts/productManagerPrompt');
const { buildArchitectPrompt } = require('../prompts/architectPrompt');
const { buildUIDesignerPrompt } = require('../prompts/uiDesignerPrompt');
const { buildBackendEngineerPrompt } = require('../prompts/backendEngineerPrompt');
const { productManagerSchema, systemArchitectSchema, uiDesignerSchema, backendEngineerSchema } = require('../schemas/agent.schema');
const Project = require('../models/Project');

/**
 * Generates a blueprint using the Gemini AI service.
 * Connects the frontend to the multi-agent AI flow while maintaining the strict JSON contract.
 */
const generateBlueprint = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'A prompt of at least 10 characters is required' });
  }

  try {
    const cleanPrompt = prompt.trim();

    // Launch all 4 requests simultaneously
    const pmPromise = geminiService.generateAgentResponse(buildProductManagerPrompt(cleanPrompt), productManagerSchema)
      .catch(err => ({ error: true, summary: "Error: Product Manager failed to generate a response." }));
    
    const archPromise = geminiService.generateAgentResponse(buildArchitectPrompt(cleanPrompt), systemArchitectSchema)
      .catch(err => ({ error: true, summary: "Error: System Architect failed to generate a response." }));
      
    const uiPromise = geminiService.generateAgentResponse(buildUIDesignerPrompt(cleanPrompt), uiDesignerSchema)
      .catch(err => ({ error: true, summary: "Error: UI Designer failed to generate a response." }));
      
    const backendPromise = geminiService.generateAgentResponse(buildBackendEngineerPrompt(cleanPrompt), backendEngineerSchema)
      .catch(err => ({ error: true, summary: "Error: Backend Engineer failed to generate a response." }));

    const [pmResult, archResult, uiResult, backendResult] = await Promise.all([
      pmPromise,
      archPromise,
      uiPromise,
      backendPromise
    ]);

    const title = pmResult.title || cleanPrompt.slice(0, 30) + (cleanPrompt.length > 30 ? '...' : '');

    const agents = {
      productManager: {
        status: pmResult.error ? "error" : "completed",
        summary: pmResult.summary || "No summary provided.",
        tasks: pmResult.tasks || [],
        blueprint: pmResult.blueprint || null
      },
      systemArchitect: {
        status: archResult.error ? "error" : "completed",
        summary: archResult.summary || "No summary provided.",
        tasks: archResult.tasks || [],
        blueprint: archResult.blueprint || null
      },
      uiDesigner: {
        status: uiResult.error ? "error" : "completed",
        summary: uiResult.summary || "No summary provided.",
        tasks: uiResult.tasks || [],
        blueprint: uiResult.blueprint || null
      },
      backendEngineer: {
        status: backendResult.error ? "error" : "completed",
        summary: backendResult.summary || "No summary provided.",
        tasks: backendResult.tasks || [],
        blueprint: backendResult.blueprint || null
      }
    };

    // Save project automatically
    const newProject = new Project({
      owner: req.user.id,
      projectName: title,
      prompt: cleanPrompt,
      agentResponses: agents,
      versions: [{
        versionNumber: 1,
        prompt: cleanPrompt,
        featureDescription: 'Initial blueprint',
        agentResponses: agents
      }]
    });
    
    await newProject.save();

    const responseData = {
      success: true,
      project: {
        _id: newProject._id,
        title: title,
        prompt: cleanPrompt,
        createdAt: newProject.createdAt
      },
      agents: agents
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to generate blueprint' });
  }
};

const addFeatureToBlueprint = async (req, res) => {
  const { featurePrompt, baseVersionNumber } = req.body;
  const projectId = req.params.id;

  if (!featurePrompt || typeof featurePrompt !== 'string' || featurePrompt.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'A feature request of at least 5 characters is required' });
  }

  try {
    const project = await Project.findOne({ _id: projectId, owner: req.user.id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const cleanPrompt = featurePrompt.trim();
    
    // Fallback to older agentResponses if versions array is empty (backwards compatibility)
    let versions = project.versions || [];
    if (versions.length === 0) {
      versions = [{
        versionNumber: 1,
        prompt: project.prompt,
        featureDescription: 'Initial blueprint',
        agentResponses: project.agentResponses
      }];
    }

    // Determine the base version to build upon
    let baseVersion = versions[versions.length - 1]; // Default to latest
    if (baseVersionNumber) {
      const foundVersion = versions.find(v => v.versionNumber === Number(baseVersionNumber));
      if (foundVersion) baseVersion = foundVersion;
    }
    
    const existingContext = baseVersion.agentResponses;
    const nextVersionNumber = versions.length > 0 ? Math.max(...versions.map(v => v.versionNumber)) + 1 : 2;

    // Launch all 4 requests simultaneously, providing existing context
    const pmPromise = geminiService.generateAgentResponse(buildProductManagerPrompt(cleanPrompt, existingContext), productManagerSchema)
      .catch(err => ({ error: true, summary: "Error: Product Manager failed to generate a response." }));
    
    const archPromise = geminiService.generateAgentResponse(buildArchitectPrompt(cleanPrompt, existingContext), systemArchitectSchema)
      .catch(err => ({ error: true, summary: "Error: System Architect failed to generate a response." }));
      
    const uiPromise = geminiService.generateAgentResponse(buildUIDesignerPrompt(cleanPrompt, existingContext), uiDesignerSchema)
      .catch(err => ({ error: true, summary: "Error: UI Designer failed to generate a response." }));
      
    const backendPromise = geminiService.generateAgentResponse(buildBackendEngineerPrompt(cleanPrompt, existingContext), backendEngineerSchema)
      .catch(err => ({ error: true, summary: "Error: Backend Engineer failed to generate a response." }));

    const [pmResult, archResult, uiResult, backendResult] = await Promise.all([
      pmPromise,
      archPromise,
      uiPromise,
      backendPromise
    ]);

    const agents = {
      productManager: {
        status: pmResult.error ? "error" : "completed",
        summary: pmResult.summary || "No summary provided.",
        tasks: pmResult.tasks || [],
        blueprint: pmResult.blueprint || null
      },
      systemArchitect: {
        status: archResult.error ? "error" : "completed",
        summary: archResult.summary || "No summary provided.",
        tasks: archResult.tasks || [],
        blueprint: archResult.blueprint || null
      },
      uiDesigner: {
        status: uiResult.error ? "error" : "completed",
        summary: uiResult.summary || "No summary provided.",
        tasks: uiResult.tasks || [],
        blueprint: uiResult.blueprint || null
      },
      backendEngineer: {
        status: backendResult.error ? "error" : "completed",
        summary: backendResult.summary || "No summary provided.",
        tasks: backendResult.tasks || [],
        blueprint: backendResult.blueprint || null
      }
    };

    // Construct the new version
    const newVersion = {
      versionNumber: nextVersionNumber,
      prompt: cleanPrompt,
      featureDescription: cleanPrompt,
      agentResponses: agents,
      createdAt: new Date()
    };
    
    project.versions = [...versions, newVersion];
    
    // Also update the top-level agentResponses so that older UI components fetching the project might still render something (optional, but good for robust compatibility)
    project.agentResponses = agents;
    
    await project.save();

    const responseData = {
      success: true,
      project: {
        _id: project._id,
        title: project.projectName,
        prompt: project.prompt,
        createdAt: project.createdAt,
        versions: project.versions
      },
      newVersion: newVersion
    };

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to add feature' });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete project' });
  }
};

const duplicateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.user.id });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    
    const newProject = new Project({
      owner: req.user.id,
      projectName: `${project.projectName} (Copy)`,
      prompt: project.prompt,
      agentResponses: project.agentResponses,
      versions: project.versions
    });
    
    await newProject.save();
    
    res.status(201).json({ success: true, project: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to duplicate project' });
  }
};

module.exports = {
  generateBlueprint,
  addFeatureToBlueprint,
  getProjects,
  getProjectById,
  deleteProject,
  duplicateProject
};
