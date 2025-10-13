import React from 'react';
import { LoadingSpinner } from './icons';

interface SuggestionBoxProps {
  suggestion: string;
  isLoading: boolean;
  onRefresh: () => void;
  accentColor: string;
}

const SuggestionBox: React.FC<SuggestionBoxProps> = ({ suggestion, isLoading, onRefresh, accentColor }) => {
  return (
    <div className="mt-4 p-4 bg-black/20 rounded-lg border border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-gray-200">AI Suggestions ✨</h4>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`text-sm font-semibold text-${accentColor} hover:underline disabled:opacity-50`}
        >
          Refresh
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-16">
          <LoadingSpinner className={`w-6 h-6 text-${accentColor}`} />
        </div>
      ) : (
        <p className="text-sm text-gray-300 italic">{suggestion}</p>
      )}
    </div>
  );
};

export default SuggestionBox;
