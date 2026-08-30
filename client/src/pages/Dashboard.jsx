import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PromptInput from '../components/PromptInput';
import AgentCard from '../components/AgentCard';
import HistoryDrawer from '../components/HistoryDrawer';
import SettingsDrawer from '../components/SettingsDrawer';
import ExportBlueprintMenu from '../components/ExportBlueprintMenu';
import { generateBlueprint, addFeature, getProjects, deleteProject, duplicateProject } from '../api/project';
import { AlertCircle, History, Plus } from 'lucide-react';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // History State
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(localStorage.getItem('currentProjectId') || null);
  const [selectedVersionNumber, setSelectedVersionNumber] = useState(null);

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
  
  // Safe versions array for current project
  const versions = currentProject?.versions?.length > 0 
    ? currentProject.versions 
    : (currentProject ? [{
        versionNumber: 1,
        featureDescription: 'Initial blueprint',
        prompt: currentProject.prompt,
        agentResponses: currentProject.agentResponses
      }] : []);

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
            const projVersions = projectToRestore.versions?.length > 0 ? projectToRestore.versions : [{
              versionNumber: 1,
              agentResponses: projectToRestore.agentResponses
            }];
            
            const vParam = searchParams.get('v');
            let selectedV = projVersions[projVersions.length - 1]; // latest by default
            if (vParam) {
              const parsedV = parseInt(vParam, 10);
              const foundV = projVersions.find(v => v.versionNumber === parsedV);
              if (foundV) {
                selectedV = foundV;
              }
            }
            
            setSelectedVersionNumber(selectedV.versionNumber);
            setAgents(selectedV.agentResponses);
            setSearchParams({ v: selectedV.versionNumber }, { replace: true });
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
      if (currentProject) {
        // Add Feature Flow
        const response = await addFeature(currentProjectId, prompt, selectedVersionNumber);
        if (response.success && response.project) {
          setProjects(prev => prev.map(p => p._id === currentProjectId ? response.project : p));
          setAgents(response.newVersion.agentResponses);
          setSelectedVersionNumber(response.newVersion.versionNumber);
          setSearchParams({ v: response.newVersion.versionNumber });
        }
      } else {
        // New Project Flow
        const response = await generateBlueprint(prompt);
        if (response.success) {
          setAgents(response.agents);
          
          if (response.project && response.project._id) {
            const newProject = {
              ...response.project,
              agentResponses: response.agents,
              versions: [{
                versionNumber: 1,
                prompt: response.project.prompt,
                featureDescription: 'Initial blueprint',
                agentResponses: response.agents
              }]
            };
            setProjects(prev => [newProject, ...prev]);
            setCurrentProjectId(response.project._id);
            setSelectedVersionNumber(1);
            localStorage.setItem('currentProjectId', response.project._id);
            setSearchParams({ v: 1 });
          }
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
    const projVersions = project.versions?.length > 0 ? project.versions : [{
      versionNumber: 1,
      agentResponses: project.agentResponses
    }];
    const latestVersion = projVersions[projVersions.length - 1];
    
    setAgents(latestVersion.agentResponses);
    setSelectedVersionNumber(latestVersion.versionNumber);
    setCurrentProjectId(project._id);
    localStorage.setItem('currentProjectId', project._id);
    setSearchParams({ v: latestVersion.versionNumber });
    setIsHistoryOpen(false);
  };

  const handleSelectVersion = (versionNum) => {
    const version = versions.find(v => v.versionNumber === versionNum);
    if (version) {
      setSelectedVersionNumber(version.versionNumber);
      setAgents(version.agentResponses);
      setSearchParams({ v: version.versionNumber });
    }
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
        setSelectedVersionNumber(null);
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
        handleOpenProject(response.project);
      }
    } catch (err) {
      console.error('Failed to duplicate project', err);
    }
  };

  const selectedVersionObj = versions.find(v => v.versionNumber === selectedVersionNumber);

  // Mock project object for ExportBlueprintMenu with selected version
  const projectForExport = currentProject ? {
    ...currentProject,
    prompt: selectedVersionObj ? selectedVersionObj.prompt : currentProject.prompt,
    agentResponses: agents,
    versions: versions, // to keep it if needed
    selectedVersionNumber: selectedVersionNumber
  } : null;

  const handleNewBlueprint = () => {
    setCurrentProjectId(null);
    setSelectedVersionNumber(null);
    setAgents({
      productManager: null,
      systemArchitect: null,
      uiDesigner: null,
      backendEngineer: null,
    });
    localStorage.removeItem('currentProjectId');
    setSearchParams({});
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
          onNewBlueprint={handleNewBlueprint}
        />
        
        <main className="flex-1 flex flex-col items-center overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-16 relative">
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 pb-20">
            {/* Header/Title Area */}
            <div className="text-center space-y-4 pt-10">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {currentProject ? currentProject.projectName : 'What are we building today?'}
              </h1>
              <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                {currentProject 
                  ? 'Add a new feature to generate an updated version of your blueprint.' 
                  : 'Describe your app idea in plain English, and our specialized AI agents will create a complete blueprint.'}
              </p>
            </div>

            {/* Version History UI */}
            {currentProject && versions.length > 0 && (
              <div className="w-full max-w-4xl mx-auto flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <History size={18} />
                  <span>Version History</span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {versions.map(v => (
                    <button
                      key={v.versionNumber}
                      onClick={() => handleSelectVersion(v.versionNumber)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedVersionNumber === v.versionNumber 
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800' 
                          : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
                      }`}
                      title={v.featureDescription}
                    >
                      V{v.versionNumber} {selectedVersionNumber === v.versionNumber && '(Current)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message Display */}
            {generationError && (
              <div className="w-full max-w-4xl mx-auto bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">{generationError}</p>
              </div>
            )}

            {/* Input Area */}
            <div className="w-full max-w-4xl mx-auto">
               <PromptInput 
                 onGenerate={handleGenerate} 
                 isLoading={isLoading} 
                 placeholder={currentProject ? "e.g. Add real-time location tracking for drivers" : undefined}
                 title={currentProject ? "Add a new feature" : "Describe your blueprint"}
                 icon={currentProject ? Plus : undefined}
                 buttonText={currentProject ? "Add Feature" : "Generate Blueprint"}
               />
            </div>

            {/* Agents Grid */}
            {(currentProject || isLoading) && (
              <div className="w-full max-w-4xl mx-auto mt-4">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-500 uppercase tracking-wider">
                    Your AI Team {selectedVersionNumber ? `(V${selectedVersionNumber})` : ''}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AgentCard role="Product Manager" agentData={agents.productManager} isLoading={isLoading} projectId={currentProjectId} version={selectedVersionNumber} />
                  <AgentCard role="System Architect" agentData={agents.systemArchitect} isLoading={isLoading} projectId={currentProjectId} version={selectedVersionNumber} />
                  <AgentCard role="UI Designer" agentData={agents.uiDesigner} isLoading={isLoading} projectId={currentProjectId} version={selectedVersionNumber} />
                  <AgentCard role="Backend Engineer" agentData={agents.backendEngineer} isLoading={isLoading} projectId={currentProjectId} version={selectedVersionNumber} />
                </div>
              </div>
            )}

            {currentProject && <ExportBlueprintMenu project={projectForExport} />}
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
