import { User, Cpu, PenTool, Database, Clock } from 'lucide-react';

const icons = {
  'Product Manager': User,
  'System Architect': Cpu,
  'UI Designer': PenTool,
  'Backend Engineer': Database,
};

const AgentCard = ({ role }) => {
  const Icon = icons[role] || User;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col transition-all duration-300 relative overflow-hidden group">
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center">
          <Icon size={20} className="text-gray-500" />
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-950 border border-gray-800">
          <Clock size={12} className="text-gray-500" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Idle</span>
        </div>
      </div>
      
      <div className="mt-auto relative z-10">
        <h3 className="text-gray-300 font-medium text-sm">{role}</h3>
        <p className="text-gray-600 text-xs mt-1">Waiting for prompt...</p>
      </div>

      {/* Subtle background dim effect to emphasize idle state */}
      <div className="absolute inset-0 bg-gray-950/20 z-0"></div>
    </div>
  );
};

export default AgentCard;
