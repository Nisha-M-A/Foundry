import api from './axios';

/**
 * Sends a prompt to generate a new blueprint.
 * Future stages will replace the backend logic to use real AI SDKs,
 * but this frontend API layer will remain identical.
 * 
 * @param {string} prompt - The user's project idea description.
 * @returns {Promise<Object>} The generated blueprint and agent statuses.
 */
export const generateBlueprint = async (prompt) => {
  const { data } = await api.post('/project/generate', { prompt });
  return data;
};

export const getProjects = async () => {
  const { data } = await api.get('/project');
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/project/${id}`);
  return data;
};

export const duplicateProject = async (id) => {
  const { data } = await api.post(`/project/${id}/duplicate`);
  return data;
};

export const getProjectById = async (id) => {
  const { data } = await api.get(`/project/${id}`);
  return data;
};

