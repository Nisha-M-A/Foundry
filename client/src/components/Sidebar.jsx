import { Plus, Settings, History, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed, onOpenHistory, onOpenSettings }) => {
  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 relative`}
    >
      <div className="p-4 flex-1 flex flex-col gap-2">
        <button className="flex items-center gap-3 w-full p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
          <Plus size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm whitespace-nowrap">New Blueprint</span>}
        </button>

        <div className="mt-6 flex flex-col gap-1">
          <p className={`text-xs font-semibold text-gray-500 mb-2 px-2 uppercase tracking-wider ${isCollapsed ? 'hidden' : 'block'}`}>
            Overview
          </p>
          <button className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-50 dark:bg-gray-900/50">
            <LayoutDashboard size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">Dashboard</span>}
          </button>
          
          <button 
            onClick={onOpenHistory}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <History size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">History</span>}
          </button>
        </div>

        <div className="mt-auto">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-3 w-full p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Settings size={20} className="shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">Settings</span>}
          </button>
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 p-1 rounded-full hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10 shadow-sm"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};

export default Sidebar;
