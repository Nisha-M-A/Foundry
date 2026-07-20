import { Sparkles, Send } from 'lucide-react';

const PromptInput = () => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={20} className="text-indigo-400" />
        <h2 className="text-xl font-semibold text-white tracking-tight">Describe your blueprint</h2>
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden focus-within:border-gray-600 transition-colors">
          <textarea 
            className="w-full h-32 bg-transparent text-gray-200 p-4 resize-none focus:outline-none text-base placeholder-gray-500"
            placeholder="e.g. A marketplace app where users can rent camping gear from each other. Needs a booking system, user profiles, and a review feature."
          />
          <div className="flex items-center justify-between p-3 border-t border-gray-800/50 bg-gray-900/50">
            <span className="text-xs text-gray-500 font-medium px-2">
              Shift + Enter for new line
            </span>
            <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-900/20 active:scale-95">
              <span>Generate Blueprint</span>
              <Send size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
