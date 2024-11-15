import React, { useState, useEffect, useRef } from 'react';
import { Search, Copy, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { queryGemini } from '../utils/ai-providers/gemini';

interface SelectionPopupProps {
  position: { x: number; y: number } | null;
  selectedText: string;
  visible: boolean;
  onSearch: (answer: string) => void;
  darkMode: boolean;
}

export const SelectionPopup: React.FC<SelectionPopupProps> = ({
  position,
  selectedText,
  visible,
  onSearch,
  darkMode
}) => {
  const [showExtended, setShowExtended] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchId] = useState(() => `search-${Date.now()}`);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (visible && position) {
      const calculatePosition = () => {
        if (!popupRef.current) return;

        const popupRect = popupRef.current.getBoundingClientRect();
        const extensionWidth = 400; // Width of the extension popup
        const padding = 8;

        // Get the extension popup element's position
        const extensionPopup = document.querySelector('.app-container');
        if (!extensionPopup) return;

        const extensionRect = extensionPopup.getBoundingClientRect();

        // Calculate initial position at the selection point
        let x = position.x - extensionRect.left;
        let y = position.y - extensionRect.top;

        // Adjust horizontal position to keep within extension bounds
        if (x + popupRect.width > extensionWidth - padding) {
          x = extensionWidth - popupRect.width - padding;
        }
        if (x < padding) {
          x = padding;
        }

        // Adjust vertical position
        if (y - popupRect.height < padding) {
          // Show below the selection if not enough space above
          y = y + padding;
        } else {
          // Show above the selection
          y = y - popupRect.height - padding;
        }

        setPopupPosition({ x, y });
      };

      // Initial calculation after a brief delay to ensure DOM is ready
      setTimeout(calculatePosition, 0);
      window.addEventListener('resize', calculatePosition);
      return () => window.removeEventListener('resize', calculatePosition);
    }
  }, [position, visible, showExtended]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    const prompt = `
Please analyze and provide detailed information about: "${selectedText}"

Your response should:
1. Provide comprehensive context and explanation
2. Include relevant facts and details
3. Cite sources when possible
4. Use clear, concise language
5. Format with markdown for readability
`;

    try {
      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      const answer = await queryGemini(prompt);
      
      // Set up a promise that resolves when the answer is rendered
      const waitForAnswer = new Promise<void>(resolve => {
        requestAnimationFrame(() => {
          const searchElement = document.getElementById(searchId);
          if (searchElement) {
            searchElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start'
            });
            // Wait for scroll animation to complete
            setTimeout(resolve, 300);
          } else {
            resolve();
          }
        });
      });

      // Call onSearch and wait for the answer to be rendered
      onSearch(answer);
      await waitForAnswer;

      // Set a timeout to hide the searching state
      searchTimeoutRef.current = setTimeout(() => {
        setIsSearching(false);
      }, 300);
    } catch (error) {
      console.error('Search error:', error);
      setIsSearching(false);
    }
  };

  if (!visible || !position) return null;

  const popupStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${popupPosition.y}px`,
    left: `${popupPosition.x}px`,
    zIndex: 50,
  };

  const baseClasses = `
    selection-popup
    ${darkMode ? 'dark bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'}
    shadow-xl border rounded-xl overflow-hidden
    transform transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
    animate-in slide-in-from-bottom-2
    backdrop-blur-sm
  `;

  const buttonClasses = `
    flex items-center gap-2 px-4 py-2 text-sm font-medium
    ${darkMode ? 'text-gray-300 hover:bg-gray-700/90' : 'text-gray-700 hover:bg-gray-50/90'}
    transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]
    hover:scale-105
  `;

  return (
    <div 
      ref={popupRef}
      className={`${baseClasses} ${isSearching ? 'opacity-90 scale-95' : ''}`} 
      style={popupStyle}
      id={searchId}
    >
      <div className={`flex items-center ${darkMode ? 'divide-gray-700' : 'divide-gray-100'} divide-x`}>
        {showExtended && (
          <button
            onClick={() => setShowExtended(false)}
            className={`p-2 ${darkMode ? 'hover:bg-gray-700/90 text-gray-400' : 'hover:bg-gray-50/90 text-gray-400'}
              transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]
              hover:scale-110 relative group`}
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex">
          <button
            onClick={handleSearch}
            className={`${buttonClasses} relative group ${isSearching ? 'animate-pulse' : ''}`}
            disabled={isSearching}
          >
            <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleCopy}
            className={`${buttonClasses} relative group`}
          >
            <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>

          <button
            onClick={() => setShowExtended(true)}
            className={`${buttonClasses} relative group`}
          >
            <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showExtended && (
        <div className={`p-2 space-y-1 ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'}
          transform transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          animate-in slide-in-from-right-2 backdrop-blur-sm`}
        >
          {['Translate', 'Summarize', 'Explain'].map((action) => (
            <button
              key={action}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200
                ${darkMode ? 'text-gray-300 hover:bg-gray-700/90' : 'text-gray-700 hover:bg-gray-50/90'}
                hover:scale-105 relative group`}
            >
              <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-500/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <span className="relative z-10">{action}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};