import { User, Cpu, PenTool, Database, Clock, CheckCircle2, Loader2 } from 'lucide-react';

const icons = {
  'Product Manager': User,
  'System Architect': Cpu,
  'UI Designer': PenTool,
  'Backend Engineer': Database,
};

const AgentCard = ({ role, agentData, isLoading }) => {
  const Icon = icons[role] || User;

  const isCompleted = agentData?.status === 'completed';

  let statusUI;
  if (isCompleted) {
    statusUI = (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
        <CheckCircle2 size={12} className="text-emerald-400" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Done</span>
      </div>
    );
  } else if (isLoading) {
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

  return (
    <div className={`bg-gray-900 border ${isCompleted ? 'border-gray-700' : 'border-gray-800'} rounded-2xl p-5 flex flex-col transition-all duration-300 relative overflow-hidden group h-40`}>
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center transition-colors ${isCompleted ? 'border-gray-700' : ''}`}>
          <Icon size={20} className={isCompleted ? 'text-gray-300' : 'text-gray-500'} />
        </div>
        {statusUI}
      </div>
      
      <div className="mt-auto relative z-10">
        <h3 className={`font-medium text-sm transition-colors ${isCompleted ? 'text-gray-200' : 'text-gray-300'}`}>{role}</h3>
        {isCompleted ? (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed">
            {agentData.summary}
          </p>
        ) : (
          <p className="text-gray-600 text-xs mt-1">
            {isLoading ? 'Analyzing prompt...' : 'Waiting for prompt...'}
          </p>
        )}
      </div>

      {/* Background effects based on state */}
      {!isCompleted && !isLoading && (
        <div className="absolute inset-0 bg-gray-950/20 z-0"></div>
      )}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 z-0 animate-pulse"></div>
      )}
    </div>
  );
};

export default AgentCard;
