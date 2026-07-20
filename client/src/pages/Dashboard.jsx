import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PromptInput from '../components/PromptInput';
import AgentCard from '../components/AgentCard';
import HistoryDrawer from '../components/HistoryDrawer';
import { generateBlueprint } from '../api/project';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Generation State
  const [isLoading, setIsLoading] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [agents, setAgents] = useState({
    productManager: null,
    systemArchitect: null,
    uiDesigner: null,
    backendEngineer: null,
  });

  const handleGenerate = async (prompt) => {
    setIsLoading(true);
    setGenerationError('');
    
    try {
      const response = await generateBlueprint(prompt);
      if (response.success) {
        setAgents(response.agents);
      }
    } catch (err) {
      setGenerationError(
        err.response?.data?.message || 'Failed to generate blueprint. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden text-gray-200">
      <Navbar />

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          setIsCollapsed={setIsSidebarCollapsed} 
          onOpenHistory={() => setIsHistoryOpen(true)}
        />
        
        <main className="flex-1 flex flex-col items-center overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-16 relative">
          <div className="w-full max-w-5xl mx-auto flex flex-col gap-16 pb-20">
            {/* Header/Title Area */}
            <div className="text-center space-y-4 pt-10">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                What are we building today?
              </h1>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Describe your app idea in plain English, and our specialized AI agents will create a complete blueprint.
              </p>
            </div>

            {/* Error Message Display */}
            {generationError && (
              <div className="w-full max-w-4xl mx-auto bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm">{generationError}</p>
              </div>
            )}

            {/* Input Area */}
            <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />

            {/* Agents Grid */}
            <div className="w-full max-w-4xl mx-auto">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-1">
                Your AI Team
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AgentCard role="Product Manager" agentData={agents.productManager} isLoading={isLoading} />
                <AgentCard role="System Architect" agentData={agents.systemArchitect} isLoading={isLoading} />
                <AgentCard role="UI Designer" agentData={agents.uiDesigner} isLoading={isLoading} />
                <AgentCard role="Backend Engineer" agentData={agents.backendEngineer} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </main>

        <HistoryDrawer 
          isOpen={isHistoryOpen} 
          onClose={() => setIsHistoryOpen(false)} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
