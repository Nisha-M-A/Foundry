import { X, User, Mail, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SettingsDrawer = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
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

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-950 border-l border-gray-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white tracking-tight">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          {/* Account section */}
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
              Account
            </p>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 shrink-0">
                  <User size={18} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name || '—'}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Mail size={11} className="text-gray-500 shrink-0" />
                    <p className="text-xs text-gray-500 truncate">{user?.email || '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sign out section */}
          <section>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
              Session
            </p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/15 text-red-400 hover:bg-red-500/10 hover:border-red-500/25 hover:text-red-300 transition-colors text-sm font-medium"
            >
              <LogOut size={16} className="shrink-0" />
              Sign out
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;
