const mongoose = require('mongoose');

const versionSchema = new mongoose.Schema({
  versionNumber: { type: Number, required: true },
  featureDescription: { type: String, required: true },
  prompt: { type: String, required: true },
  agentResponses: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    agentResponses: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    versions: [versionSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
