import { User, Cpu, PenTool, Database, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
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

const AgentCard = ({ role, agentData, isLoading }) => {
  const Icon = icons[role] || User;

  // Local states for stagger effect
  const [localStatus, setLocalStatus] = useState('idle'); // idle, thinking, completed, error
  const [localSummary, setLocalSummary] = useState('');
  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    if (isLoading) {
      setLocalStatus('thinking');
      setLocalSummary('');
      setLocalTasks([]);
    } else if (agentData && (agentData.status === 'completed' || agentData.status === 'error')) {
      const delay = delays[role] || 0;
      const timer = setTimeout(() => {
        setLocalStatus(agentData.status);
        setLocalSummary(agentData.summary);
        setLocalTasks(agentData.tasks || []);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setLocalStatus('idle');
      setLocalSummary('');
      setLocalTasks([]);
    }
  }, [isLoading, agentData, role]);

  const isCompleted = localStatus === 'completed';
  const isError = localStatus === 'error';
  const isThinking = localStatus === 'thinking';

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
  const iconColorClass = isCompleted ? 'text-gray-300' : (isError ? 'text-red-400' : 'text-gray-500');

  return (
    <div className={`bg-gray-900 border ${borderClass} rounded-2xl p-5 flex flex-col transition-all duration-300 relative overflow-hidden group min-h-[24rem]`}>
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl bg-gray-950 border ${iconBorderClass} flex items-center justify-center transition-colors`}>
          <Icon size={20} className={iconColorClass} />
        </div>
        {statusUI}
      </div>

      <div className="mt-auto relative z-10 flex-1 flex flex-col">
        <h3 className={`font-medium text-sm transition-colors ${isCompleted ? 'text-gray-200' : 'text-gray-300'}`}>{role}</h3>
        {isCompleted || isError ? (
          <>
            <p className={`${isError ? 'text-red-400/80' : 'text-gray-400'} text-xs mt-1 line-clamp-3 leading-relaxed`}>
              {localSummary}
            </p>
            {isCompleted && <KanbanBoard tasks={localTasks} role={role} />}
          </>
        ) : (
          <p className="text-gray-600 text-xs mt-1">
            {isThinking ? 'Analyzing prompt...' : 'Waiting for prompt...'}
          </p>
        )}
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
    </div>
  );
};

export default AgentCard;
