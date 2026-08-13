import { useState } from 'react';
import { Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';

const PromptInput = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError('Prompt cannot be empty.');
      return;
    }
    if (trimmed.length < 10) {
      setError('Please provide a bit more detail (at least 10 characters).');
      return;
    }
    
    setError('');
    if (onGenerate) {
      onGenerate(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-500 dark:text-indigo-400" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">Describe your blueprint</h2>
        </div>
        {error && (
          <div className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-30 transition duration-500"></div>
        <div className={`relative bg-white dark:bg-gray-900 border ${error ? 'border-red-500/50' : 'border-gray-200 dark:border-gray-800'} rounded-2xl overflow-hidden focus-within:border-gray-400 dark:focus-within:border-gray-600 transition-colors shadow-sm`}>
          <textarea 
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full h-32 bg-transparent text-gray-900 dark:text-gray-200 p-4 resize-none focus:outline-none text-base placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
            placeholder="e.g. A marketplace app where users can rent camping gear from each other. Needs a booking system, user profiles, and a review feature."
          />
          <div className="flex items-center justify-between p-3 border-t border-gray-100 dark:border-gray-800/50 bg-gray-50/80 dark:bg-gray-900/50">
            <span className="text-xs text-gray-500 font-medium px-2">
              Shift + Enter for new line
            </span>
            <button 
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-indigo-900/20 active:scale-95"
            >
              {isLoading ? (
                <>
                  <span>Generating</span>
                  <Loader2 size={16} className="ml-1 animate-spin" />
                </>
              ) : (
                <>
                  <span>Generate Blueprint</span>
                  <Send size={16} className="ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
