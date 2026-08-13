import { Download, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { exportBlueprintDocx, exportBlueprintPdf } from '../utils/exportBlueprint';

const ExportBlueprintMenu = ({ project }) => {
  const [activeFormat, setActiveFormat] = useState('');
  const [error, setError] = useState('');

  const handleExport = async (format) => {
    if (!project || activeFormat) return;

    setActiveFormat(format);
    setError('');

    try {
      if (format === 'pdf') {
        await exportBlueprintPdf(project);
      } else {
        await exportBlueprintDocx(project);
      }
    } catch (exportError) {
      console.error('Failed to export blueprint', exportError);
      setError('Could not create the export. Please try again.');
    } finally {
      setActiveFormat('');
    }
  };

  const isBusy = Boolean(activeFormat);
  const disabled = !project || isBusy;

  return (
    <section className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">Export Blueprint</h3>
          <p className="text-xs text-gray-500 mt-1">
            Download the saved project blueprint as a static document.
          </p>
        </div>

        <div className="flex flex-col xs:flex-row sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-indigo-200 dark:border-indigo-500/25 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 transition hover:bg-indigo-100 dark:hover:bg-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {activeFormat === 'pdf' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
            Export PDF
          </button>

          <button
            type="button"
            onClick={() => handleExport('docx')}
            disabled={disabled}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-200 dark:border-cyan-500/25 bg-cyan-50 dark:bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300 transition hover:bg-cyan-100 dark:hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {activeFormat === 'docx' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Export DOCX
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </section>
  );
};

export default ExportBlueprintMenu;
