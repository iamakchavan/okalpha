import React from 'react';
import { ChevronDown, Sparkles, Brain } from 'lucide-react';

interface ModelSelectorProps {
  currentModel: 'gemini' | 'perplexity';
  onModelChange: (model: 'gemini' | 'perplexity') => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentModel,
  onModelChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const models = [
    {
      id: 'gemini',
      name: 'Gemini',
      icon: Sparkles,
      description: 'Powered by Google Gemini Pro'
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      icon: Brain,
      description: 'Llama 3.1 Sonar Small Online (8B)'
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm 
          bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 
          rounded-lg hover:border-gray-300 dark:hover:border-gray-600 
          transition-all duration-200 backdrop-blur-sm backdrop-saturate-150"
      >
        <div className="flex items-center gap-2">
          {React.createElement(models.find(m => m.id === currentModel)?.icon || Sparkles, {
            className: "w-4 h-4 text-blue-500"
          })}
          <span className="text-gray-700 dark:text-gray-300">
            {models.find(m => m.id === currentModel)?.name}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 
          ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-20">
            <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg border border-gray-200 
              dark:border-gray-700 shadow-lg overflow-hidden backdrop-blur-sm backdrop-saturate-150
              transform origin-top animate-in slide-in-from-bottom-2">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id as 'gemini' | 'perplexity');
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-3 text-left transition-colors
                    ${currentModel === model.id 
                      ? 'bg-blue-50/80 dark:bg-blue-900/50' 
                      : 'hover:bg-gray-50/80 dark:hover:bg-gray-700/80'}`}
                >
                  <div className={`p-2 rounded-lg ${
                    currentModel === model.id 
                      ? 'bg-blue-100 dark:bg-blue-800' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <model.icon className={`w-4 h-4 ${
                      currentModel === model.id
                        ? 'text-blue-500 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <div className={`font-medium ${
                      currentModel === model.id
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {model.name}
                    </div>
                    <div className={`text-xs ${
                      currentModel === model.id
                        ? 'text-blue-600/80 dark:text-blue-400/80'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {model.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};