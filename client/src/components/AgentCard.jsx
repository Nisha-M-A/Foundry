import { User, Cpu, PenTool, Database, Clock, CheckCircle2, Loader2, AlertCircle, Workflow, Brain, Layout } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from './KanbanBoard';

const icons = {
  'Product Manager': User,
  'System Architect': Cpu,
  'UI Designer': PenTool,
  'Backend Engineer': Database,
};

const delays = {
  'Product Manager': 200,
  'System Architect': 350,
  'UI Designer': 500,
  'Backend Engineer': 650,
};

// Map each role to its blueprint URL segment
const blueprintRouteSegment = {
  'Product Manager': 'product',
  'System Architect': 'architecture',
  'Backend Engineer': 'backend',
  'UI Designer': 'ui',
};

const AgentCard = ({ role, agentData, isLoading, projectId }) => {
  const Icon = icons[role] || User;
  const isBackendEngineer = role === 'Backend Engineer';
  const isProductManager  = role === 'Product Manager';
  const isSystemArchitect = role === 'System Architect';
  const isUIDesigner      = role === 'UI Designer';
  const navigate = useNavigate();

  // Local states for stagger effect
  const [localStatus, setLocalStatus] = useState('idle'); // idle, thinking, completed, error
  const [localSummary, setLocalSummary] = useState('');
  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    let timer;
    if (isLoading) {
      const delay = delays[role] || 0;
      timer = setTimeout(() => {
        setLocalStatus('thinking');
        setLocalSummary('');
        setLocalTasks([]);
      }, delay);
    } else if (agentData && (agentData.status === 'completed' || agentData.status === 'error')) {
      const delay = delays[role] || 0;
      timer = setTimeout(() => {
        setLocalStatus(agentData.status);
        setLocalSummary(agentData.summary);
        setLocalTasks(agentData.tasks || []);
      }, delay);
    } else {
      setLocalStatus('idle');
      setLocalSummary('');
      setLocalTasks([]);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, agentData, role]);

  const isCompleted = localStatus === 'completed';
  const isError     = localStatus === 'error';
  const isThinking  = localStatus === 'thinking';

  const hasBlueprint =
    isBackendEngineer &&
    isCompleted &&
    agentData?.blueprint?.nodes?.length > 0;

  const hasMindMap =
    isProductManager &&
    isCompleted &&
    agentData?.blueprint?.type === 'mindmap' &&
    Array.isArray(agentData?.blueprint?.branches) &&
    agentData.blueprint.branches.length > 0;

  const hasArchitecture =
    isSystemArchitect &&
    isCompleted &&
    agentData?.blueprint?.type === 'architecture' &&
    Array.isArray(agentData?.blueprint?.components) &&
    agentData.blueprint.components.length > 0;

  const hasWireframe =
    isUIDesigner &&
    isCompleted &&
    agentData?.blueprint?.type === 'wireframe' &&
    Array.isArray(agentData?.blueprint?.screens) &&
    agentData.blueprint.screens.length > 0;

  // Navigate to the dedicated blueprint page
  const handleViewBlueprint = () => {
    if (!projectId) return;
    const segment = blueprintRouteSegment[role];
    navigate(`/projects/${projectId}/blueprint/${segment}`);
  };

  let statusUI;
  if (isCompleted) {
    statusUI = (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
        <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Done</span>
      </div>
    );
  } else if (isError) {
    statusUI = (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
        <AlertCircle size={12} className="text-red-600 dark:text-red-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">Error</span>
      </div>
    );
  } else if (isThinking) {
    statusUI = (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20">
        <Loader2 size={12} className="text-indigo-600 dark:text-indigo-400 animate-spin" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Thinking</span>
      </div>
    );
  } else {
    statusUI = (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-950 border border-gray-200 dark:border-gray-800">
        <Clock size={12} className="text-gray-500" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Idle</span>
      </div>
    );
  }

  const borderClass     = isCompleted ? 'border-gray-200 dark:border-gray-700' : (isError ? 'border-red-300 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800');
  const iconBorderClass = isCompleted ? 'border-gray-200 dark:border-gray-700' : (isError ? 'border-red-300 dark:border-red-900/50' : 'border-gray-200 dark:border-gray-800');
  const iconColorClass  = isCompleted ? 'text-gray-600 dark:text-gray-300' : (isError ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500');

  const hasVisualization = hasBlueprint || hasMindMap || hasArchitecture || hasWireframe;

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.4, ease: 'easeInOut' } }}
      className={`bg-white dark:bg-gray-900 border ${borderClass} rounded-2xl p-5 flex flex-col transition-colors duration-300 relative overflow-hidden group shadow-sm`}
      style={{ minHeight: '21rem' }}
    >
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-950 border ${iconBorderClass} flex items-center justify-center transition-colors`}>
          <Icon size={20} className={iconColorClass} />
        </div>
        {statusUI}
      </div>

      <div className="mt-auto relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className={`font-medium text-sm transition-colors ${isCompleted ? 'text-gray-900 dark:text-gray-200' : 'text-gray-500 dark:text-gray-300'}`}>{role}</h3>

          {/* View Blueprint — Backend Engineer */}
          {hasBlueprint && (
            <motion.button
              onClick={handleViewBlueprint}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.25)',
                color: '#818cf8',
              }}
              aria-label="View backend blueprint"
            >
              <Workflow size={11} strokeWidth={2.5} />View Blueprint
            </motion.button>
          )}

          {/* View Blueprint — Product Manager */}
          {hasMindMap && (
            <motion.button
              onClick={handleViewBlueprint}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: 'rgba(45,212,191,0.08)',
                border: '1px solid rgba(45,212,191,0.22)',
                color: '#2dd4bf',
              }}
              aria-label="View mind map blueprint"
            >
              <Brain size={11} strokeWidth={2.5} />View Blueprint
            </motion.button>
          )}

          {/* View Blueprint — System Architect */}
          {hasArchitecture && (
            <motion.button
              onClick={handleViewBlueprint}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: 'rgba(6,182,212,0.08)',
                border: '1px solid rgba(6,182,212,0.22)',
                color: '#06b6d4',
              }}
              aria-label="View architecture blueprint"
            >
              <Cpu size={11} strokeWidth={2.5} />View Blueprint
            </motion.button>
          )}

          {/* View Blueprint — UI Designer */}
          {hasWireframe && (
            <motion.button
              onClick={handleViewBlueprint}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: 'rgba(236,72,153,0.08)',
                border: '1px solid rgba(236,72,153,0.22)',
                color: '#ec4899',
              }}
              aria-label="View wireframe blueprint"
            >
              <Layout size={11} strokeWidth={2.5} />View Blueprint
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isCompleted || isError ? (
            /* Hide summary when any visualization is present — it would be redundant */
            !hasVisualization && (
              <motion.div
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`${isError ? 'text-red-500 dark:text-red-400/80' : 'text-gray-500 dark:text-gray-400'} text-xs mt-1 line-clamp-3 leading-relaxed`}
              >
                {typeof localSummary === 'object' && localSummary !== null ? (
                  'Designs backend APIs, database, authentication, and business logic.'
                ) : (
                  localSummary
                )}
              </motion.div>
            )
          ) : (
            <motion.p
              key="status-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-gray-400 dark:text-gray-600 text-xs mt-1"
            >
              {isThinking ? 'Analyzing prompt...' : 'Waiting for prompt...'}
            </motion.p>
          )}
        </AnimatePresence>

        {(isThinking || isCompleted) && !isError && (
          <KanbanBoard status={localStatus} tasks={localTasks} role={role} />
        )}
      </div>

      {/* Background effects based on state */}
      {!isCompleted && !isThinking && !isError && (
        <div className="absolute inset-0 bg-gray-50/50 dark:bg-gray-950/20 z-0"></div>
      )}
      {isThinking && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0 animate-pulse"></div>
      )}
      {isError && (
        <div className="absolute inset-0 bg-red-500/5 z-0"></div>
      )}
    </motion.div>
  );
};

export default AgentCard;
