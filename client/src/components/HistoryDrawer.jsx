import { X, Search, History } from 'lucide-react';

const HistoryDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-gray-950 border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white tracking-tight">History</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search blueprints..." 
              className="w-full bg-gray-900 border border-gray-800 text-sm text-gray-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-4">
            <History size={24} className="text-gray-600" />
          </div>
          <p className="text-gray-300 font-medium mb-1">No history yet</p>
          <p className="text-gray-500 text-sm max-w-[200px]">
            Blueprints you generate will appear here.
          </p>
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;
