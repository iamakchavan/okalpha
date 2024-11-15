import React from 'react';
import { Brain, Moon, Sun, Loader2, Check } from 'lucide-react';

interface HeaderProps {
  url: string;
  onSummarize: () => void;
  isSummarizing: boolean;
  isSummarized: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  url, 
  onSummarize, 
  isSummarizing,
  isSummarized,
  darkMode,
  onToggleDarkMode
}) => (
  <div className="border-b border-gray-200 dark:border-gray-700">
    <div className="px-4 py-3 flex items-center justify-between">
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">HARVv1</h1>
        <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">MARK06-Experimental</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDarkMode}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <button 
          onClick={onSummarize} 
          disabled={isSummarizing}
          className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all duration-200
            ${isSummarizing ? 'opacity-75 cursor-not-allowed' : ''}
            ${isSummarized 
              ? 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
        >
          {isSummarizing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Summarizing...
            </>
          ) : isSummarized ? (
            <>
              <Check className="w-4 h-4" />
              Summarized
            </>
          ) : (
            'Summarize'
          )}
        </button>
      </div>
    </div>
    {url && (
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate" title={url}>
          {url}
        </p>
      </div>
    )}
  </div>
);