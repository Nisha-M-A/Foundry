import { useState } from 'react';
import { X, Search, History, Copy, Trash2, FolderOpen, AlertTriangle } from 'lucide-react';

const HistoryDrawer = ({ 
  isOpen, 
  onClose, 
  projects = [],
  onOpenProject,
  onDeleteProject,
  onDuplicateProject,
  currentProjectId
}) => {
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return project.projectName?.toLowerCase().includes(query);
  });

  const confirmDelete = (project) => {
    setProjectToDelete(project);
  };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete._id);
      setProjectToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setProjectToDelete(null);
  };
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={handleCancelDelete}
          />
          <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 w-[90%] max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <AlertTriangle size={24} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Project?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                You're about to permanently delete "<span className="text-gray-900 dark:text-gray-200 font-medium">{projectToDelete.projectName}</span>".<br />This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button 
                  onClick={handleCancelDelete}
                  className="flex-1 py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2 px-4 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 font-medium transition-colors"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">History</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input 
              type="text" 
              placeholder="Search blueprints..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-gray-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600 focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-600 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {projects.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-4">
                <History size={24} className="text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">No history yet</p>
              <p className="text-gray-500 text-sm max-w-[200px]">
                Blueprints you generate will appear here.
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-400 dark:text-gray-600" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">No matching projects</p>
              <p className="text-gray-500 text-sm max-w-[200px]">
                Try adjusting your search query.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <div 
                  key={project._id}
                  className={`p-3 rounded-lg border ${
                    currentProjectId === project._id ? 'border-violet-500/50 bg-violet-50 dark:bg-violet-500/10' : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50'
                  } transition-colors group relative`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 line-clamp-1 pr-2">
                      {project.projectName}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    {new Date(project.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenProject(project)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md transition-colors"
                    >
                      <FolderOpen size={14} /> Open
                    </button>
                    <button
                      onClick={() => onDuplicateProject(project._id)}
                      className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={14} />
                    </button>
                    <button
                      onClick={() => confirmDelete(project)}
                      className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryDrawer;
