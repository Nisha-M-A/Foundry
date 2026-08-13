import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PromptInput from '../components/PromptInput';
import AgentCard from '../components/AgentCard';
import HistoryDrawer from '../components/HistoryDrawer';
import SettingsDrawer from '../components/SettingsDrawer';
import ExportBlueprintMenu from '../components/ExportBlueprintMenu';
import { generateBlueprint, getProjects, deleteProject, duplicateProject } from '../api/project';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // History State
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(localStorage.getItem('currentProjectId') || null);

  // Generation State
  const [isLoading, setIsLoading] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [agents, setAgents] = useState({
    productManager: null,
    systemArchitect: null,
    uiDesigner: null,
    backendEngineer: null,
  });

  const currentProject = projects.find(project => project._id === currentProjectId) || null;

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getProjects();
      if (response.success) {
        setProjects(response.projects);
        
        // Restore currently opened project if available
        const savedId = localStorage.getItem('currentProjectId');
        if (savedId) {
          const projectToRestore = response.projects.find(p => p._id === savedId);
          if (projectToRestore) {
            setAgents(projectToRestore.agentResponses);
          } else {
            localStorage.removeItem('currentProjectId');
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const handleGenerate = async (prompt) => {
    setIsLoading(true);
    setGenerationError('');
    
    try {
      const response = await generateBlueprint(prompt);
      if (response.success) {
        setAgents(response.agents);
        
        // Ensure new project exists in history and is marked as current
        if (response.project && response.project._id) {
          const newProject = {
            _id: response.project._id,
            projectName: response.project.title,
            prompt: response.project.prompt,
            agentResponses: response.agents,
            createdAt: response.project.createdAt || new Date().toISOString()
          };
          setProjects(prev => [newProject, ...prev]);
          setCurrentProjectId(response.project._id);
          localStorage.setItem('currentProjectId', response.project._id);
        }
      }
    } catch (err) {
      setGenerationError(
        err.response?.data?.message || 'Failed to generate blueprint. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenProject = (project) => {
    setAgents(project.agentResponses);
    setCurrentProjectId(project._id);
    localStorage.setItem('currentProjectId', project._id);
    setIsHistoryOpen(false);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      setProjects(prev => prev.filter(p => p._id !== projectId));
      
      if (currentProjectId === projectId) {
        setAgents({
          productManager: null,
          systemArchitect: null,
          uiDesigner: null,
          backendEngineer: null,
        });
        setCurrentProjectId(null);
        localStorage.removeItem('currentProjectId');
      }
    } catch (err) {
      console.error('Failed to delete project', err);
    }
  };

  const handleDuplicateProject = async (projectId) => {
    try {
      const response = await duplicateProject(projectId);
      if (response.success && response.project) {
        setProjects(prev => [response.project, ...prev]);
        // Open the duplicated project automatically
        handleOpenProject(response.project);
      }
    } catch (err) {
      console.error('Failed to duplicate project', err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden text-gray-900 dark:text-gray-200 transition-colors duration-300">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
        
        <main className="flex-1 flex flex-col items-center overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-16 relative">
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-16 pb-20">
            {/* Header/Title Area */}
            <div className="text-center space-y-4 pt-10">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                What are we building today?
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Describe your app idea in plain English, and our specialized AI agents will create a complete blueprint.
              </p>
            </div>

            {/* Error Message Display */}
            {generationError && (
              <div className="w-full max-w-4xl mx-auto bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">{generationError}</p>
              </div>
            )}

            {/* Input Area */}
            <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />

            {/* Agents Grid */}
            <div className="w-full max-w-4xl mx-auto">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-500 uppercase tracking-wider mb-4 px-1">
                Your AI Team
              </h3>
              {/* Top row: 3 agents */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <AgentCard role="Product Manager" agentData={agents.productManager} isLoading={isLoading} projectId={currentProjectId} />
                <AgentCard role="System Architect" agentData={agents.systemArchitect} isLoading={isLoading} projectId={currentProjectId} />
                <AgentCard role="UI Designer" agentData={agents.uiDesigner} isLoading={isLoading} projectId={currentProjectId} />
              </div>
              {/* Bottom row: Backend Engineer — full width */}
              <AgentCard role="Backend Engineer" agentData={agents.backendEngineer} isLoading={isLoading} projectId={currentProjectId} />
            </div>

            <ExportBlueprintMenu project={currentProject} />
          </div>
        </main>

        <HistoryDrawer
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          projects={projects}
          onOpenProject={handleOpenProject}
          onDeleteProject={handleDeleteProject}
          onDuplicateProject={handleDuplicateProject}
          currentProjectId={currentProjectId}
        />

        <SettingsDrawer
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
