import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Copy, Check, Volume2, VolumeX } from 'lucide-react';
import { TTSService } from '../utils/tts';

interface ContentSectionProps {
  title: string;
  content: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ title, content }) => {
  const [copied, setCopied] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const ttsService = TTSService.getInstance();

  const renderMarkdown = (content: string) => {
    const html = marked(content);
    return { __html: DOMPurify.sanitize(html) };
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      ttsService.stop();
      setIsSpeaking(false);
    } else {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = marked(content);
      const cleanText = tempDiv.textContent || '';
      
      await ttsService.speak(cleanText);
      setIsSpeaking(true);

      const checkSpeakingStatus = setInterval(() => {
        if (!ttsService.isCurrentlySpeaking()) {
          setIsSpeaking(false);
          clearInterval(checkSpeakingStatus);
        }
      }, 100);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-2">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSpeak}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 
              rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isSpeaking ? "Stop speaking" : "Listen to text"}
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 
              rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <div
        className="prose dark:prose-invert prose-sm max-w-none
          prose-p:text-gray-700 dark:prose-p:text-gray-200
          prose-headings:text-gray-900 dark:prose-headings:text-gray-100
          prose-strong:text-gray-900 dark:prose-strong:text-gray-100
          prose-code:text-gray-800 dark:prose-code:text-gray-200
          prose-code:bg-gray-100 dark:prose-code:bg-gray-700/50
          prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700/50
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-li:text-gray-700 dark:prose-li:text-gray-200
          prose-ul:text-gray-700 dark:prose-ul:text-gray-200
          prose-ol:text-gray-700 dark:prose-ol:text-gray-200
          prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-200"
        dangerouslySetInnerHTML={renderMarkdown(content)}
      />
    </div>
  );
};