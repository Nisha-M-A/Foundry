import { User, Cpu, PenTool, Database, Clock, CheckCircle2, Loader2, AlertCircle, ChevronDown, ChevronUp, ExternalLink, X, Map } from 'lucide-react';
import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import KanbanBoard from './KanbanBoard';

// Lazy-load heavy ReactFlow components only when needed
const BackendBlueprint      = lazy(() => import('./BackendBlueprint'));
const ProductMindMap        = lazy(() => import('./ProductMindMap'));
const ArchitectureBlueprint = lazy(() => import('./ArchitectureBlueprint'));
const UIDesignerBlueprint   = lazy(() => import('./UIDesignerBlueprint'));

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

const AgentCard = ({ role, agentData, isLoading }) => {
  const Icon = icons[role] || User;
  const isBackendEngineer  = role === 'Backend Engineer';
  const isProductManager   = role === 'Product Manager';
  const isSystemArchitect  = role === 'System Architect';
  const isUIDesigner       = role === 'UI Designer';

  // Local states for stagger effect
  const [localStatus, setLocalStatus] = useState('idle'); // idle, thinking, completed, error
  const [localSummary, setLocalSummary] = useState('');
  const [localTasks, setLocalTasks] = useState([]);

  // Expand state — only for Backend Engineer
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      const delay = delays[role] || 0;
      timer = setTimeout(() => {
        setLocalStatus('thinking');
        setLocalSummary('');
        setLocalTasks([]);
        setIsExpanded(false); // collapse on new generation
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
      setIsExpanded(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading, agentData, role]);

  const isCompleted = localStatus === 'completed';
  const isError = localStatus === 'error';
  const isThinking = localStatus === 'thinking';

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

  let statusUI;
  if (isCompleted) {
    statusUI = (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 size={12} className="text-emerald-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Done</span>
      </div>
    );
  } else if (isError) {
    statusUI = (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
        <AlertCircle size={12} className="text-red-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400">Error</span>
      </div>
    );
  } else if (isThinking) {
    statusUI = (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
        <Loader2 size={12} className="text-indigo-400 animate-spin" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">Thinking</span>
      </div>
    );
  } else {
    statusUI = (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-950 border border-gray-800">
        <Clock size={12} className="text-gray-500" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Idle</span>
      </div>
    );
  }

  const borderClass = isCompleted ? 'border-gray-700' : (isError ? 'border-red-900/50' : 'border-gray-800');
  const iconBorderClass = isCompleted ? 'border-gray-700' : (isError ? 'border-red-900/50' : 'border-gray-800');

  // Any visualization can drive the expand state
  const hasVisualization = hasBlueprint || hasMindMap || hasArchitecture || hasWireframe;
  const iconColorClass = isCompleted ? 'text-gray-300' : (isError ? 'text-red-400' : 'text-gray-500');

  // Border highlight colour — teal for PM mind map, indigo for backend flowchart, cyan for architect diagram, pink for UI wireframe
  const expandedBorderClass = isExpanded
    ? (hasMindMap ? 'border-teal-500/40' : hasArchitecture ? 'border-cyan-500/40' : hasWireframe ? 'border-pink-500/40' : 'border-indigo-500/40')
    : borderClass;

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 0.4, ease: 'easeInOut' } }}
      className={`bg-gray-900 border ${expandedBorderClass} rounded-2xl p-5 flex flex-col transition-colors duration-300 relative overflow-hidden group`}
      style={{ minHeight: '21rem' }}
    >
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl bg-gray-950 border ${iconBorderClass} flex items-center justify-center transition-colors`}>
          <Icon size={20} className={iconColorClass} />
        </div>
        {statusUI}
      </div>

      <div className="mt-auto relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className={`font-medium text-sm transition-colors ${isCompleted ? 'text-gray-200' : 'text-gray-300'}`}>{role}</h3>

          {/* Open Blueprint — Backend Engineer */}
          {hasBlueprint && (
            <motion.button
              onClick={() => setIsExpanded((v) => !v)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: isExpanded ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.1)',
                border: isExpanded ? '1px solid rgba(129,140,248,0.4)' : '1px solid rgba(99,102,241,0.25)',
                color: isExpanded ? '#a5b4fc' : '#818cf8',
                boxShadow: isExpanded ? '0 0 12px rgba(99,102,241,0.2)' : 'none',
              }}
              aria-label={isExpanded ? 'Close blueprint' : 'Open blueprint'}
            >
              {isExpanded ? (
                <><X size={11} strokeWidth={2.5} />Close</>
              ) : (
                <><ExternalLink size={11} strokeWidth={2.5} />Open Blueprint</>
              )}
            </motion.button>
          )}

          {/* Open Mind Map — Product Manager */}
          {hasMindMap && (
            <motion.button
              onClick={() => setIsExpanded((v) => !v)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: isExpanded ? 'rgba(45,212,191,0.15)' : 'rgba(45,212,191,0.08)',
                border: isExpanded ? '1px solid rgba(45,212,191,0.45)' : '1px solid rgba(45,212,191,0.22)',
                color: isExpanded ? '#5eead4' : '#2dd4bf',
                boxShadow: isExpanded ? '0 0 12px rgba(45,212,191,0.18)' : 'none',
              }}
              aria-label={isExpanded ? 'Close mind map' : 'Open mind map'}
            >
              {isExpanded ? (
                <><X size={11} strokeWidth={2.5} />Close</>
              ) : (
                <><Map size={11} strokeWidth={2.5} />Mind Map</>
              )}
            </motion.button>
          )}

          {/* Open Architecture — System Architect */}
          {hasArchitecture && (
            <motion.button
              onClick={() => setIsExpanded((v) => !v)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: isExpanded ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.08)',
                border: isExpanded ? '1px solid rgba(6,182,212,0.45)' : '1px solid rgba(6,182,212,0.22)',
                color: isExpanded ? '#67e8f9' : '#06b6d4',
                boxShadow: isExpanded ? '0 0 12px rgba(6,182,212,0.18)' : 'none',
              }}
              aria-label={isExpanded ? 'Close architecture' : 'Open architecture'}
            >
              {isExpanded ? (
                <><X size={11} strokeWidth={2.5} />Close</>
              ) : (
                <><Cpu size={11} strokeWidth={2.5} />Architecture</>
              )}
            </motion.button>
          )}

          {/* Open Wireframe — UI Designer */}
          {hasWireframe && (
            <motion.button
              onClick={() => setIsExpanded((v) => !v)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all"
              style={{
                background: isExpanded ? 'rgba(236,72,153,0.15)' : 'rgba(236,72,153,0.08)',
                border: isExpanded ? '1px solid rgba(236,72,153,0.45)' : '1px solid rgba(236,72,153,0.22)',
                color: isExpanded ? '#f472b6' : '#ec4899',
                boxShadow: isExpanded ? '0 0 12px rgba(236,72,153,0.18)' : 'none',
              }}
              aria-label={isExpanded ? 'Close wireframes' : 'Open wireframes'}
            >
              {isExpanded ? (
                <><X size={11} strokeWidth={2.5} />Close</>
              ) : (
                <><PenTool size={11} strokeWidth={2.5} />Wireframes</>
              )}
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
                className={`${isError ? 'text-red-400/80' : 'text-gray-400'} text-xs mt-1 line-clamp-3 leading-relaxed`}
              >
                {typeof localSummary === 'object' && localSummary !== null ? (
                  "Designs backend APIs, database, authentication, and business logic."
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
              className="text-gray-600 text-xs mt-1"
            >
              {isThinking ? 'Analyzing prompt...' : 'Waiting for prompt...'}
            </motion.p>
          )}
        </AnimatePresence>

        {(isThinking || isCompleted) && !isError && (
          <KanbanBoard status={localStatus} tasks={localTasks} role={role} />
        )}

        {/* ── Backend Engineer Flowchart Panel ── */}
        <AnimatePresence>
          {hasBlueprint && isExpanded && (
            <motion.div
              key="blueprint-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden mt-4"
            >
              <div className="border-t border-indigo-500/20 mb-4" />
              <div className="flex items-center gap-2 mb-3">
                <Database size={12} className="text-indigo-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                  Architecture Flowchart
                </span>
              </div>
              <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-500 text-xs">Loading flowchart...</div>}>
                <BackendBlueprint blueprint={agentData.blueprint} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Product Manager Mind Map Panel ── */}
        <AnimatePresence>
          {hasMindMap && isExpanded && (
            <motion.div
              key="mindmap-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden mt-4"
            >
              <div className="border-t border-teal-500/20 mb-4" />
              <div className="flex items-center gap-2 mb-3">
                <Map size={12} className="text-teal-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-400">
                  Strategy Mind Map
                </span>
              </div>
              <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-500 text-xs">Loading mind map...</div>}>
                <ProductMindMap blueprint={agentData.blueprint} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── System Architect Architecture Panel ── */}
        <AnimatePresence>
          {hasArchitecture && isExpanded && (
            <motion.div
              key="architecture-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden mt-4"
            >
              <div className="border-t border-cyan-500/20 mb-4" />
              <div className="flex items-center gap-2 mb-3">
                <Cpu size={12} className="text-cyan-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
                  System Architecture
                </span>
              </div>
              <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-500 text-xs">Loading architecture...</div>}>
                <ArchitectureBlueprint blueprint={agentData.blueprint} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── UI Designer Wireframe Panel ── */}
        <AnimatePresence>
          {hasWireframe && isExpanded && (
            <motion.div
              key="wireframe-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden mt-4"
            >
              <div className="border-t border-pink-500/20 mb-4" />
              <div className="flex items-center gap-2 mb-3">
                <PenTool size={12} className="text-pink-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-pink-400">
                  Wireframe Board
                </span>
              </div>
              <Suspense fallback={<div className="flex items-center justify-center h-64 text-gray-500 text-xs">Loading wireframes...</div>}>
                <UIDesignerBlueprint blueprint={agentData.blueprint} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background effects based on state */}
      {!isCompleted && !isThinking && !isError && (
        <div className="absolute inset-0 bg-gray-950/20 z-0"></div>
      )}
      {isThinking && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0 animate-pulse"></div>
      )}
      {isError && (
        <div className="absolute inset-0 bg-red-500/5 z-0"></div>
      )}
      {isExpanded && !hasMindMap && !hasArchitecture && !hasWireframe && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/3 to-purple-500/3 z-0 pointer-events-none" />
      )}
      {isExpanded && hasMindMap && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/3 to-cyan-500/3 z-0 pointer-events-none" />
      )}
      {isExpanded && hasArchitecture && (
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/3 to-blue-500/3 z-0 pointer-events-none" />
      )}
      {isExpanded && hasWireframe && (
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/3 to-rose-500/3 z-0 pointer-events-none" />
      )}
    </motion.div>
  );
};

export default AgentCard;
