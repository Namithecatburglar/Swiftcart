import React from 'react';
import { PendingItem } from '../types';
import { CheckIcon, XIcon } from './icons';

interface DetectionConfirmationProps {
  item: PendingItem;
  onConfirm: () => void;
  onDiscard: () => void;
}

const DetectionConfirmation: React.FC<DetectionConfirmationProps> = ({ item, onConfirm, onDiscard }) => {
  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-20">
      <div className="bg-gray-800 border-2 border-cyan-500 rounded-2xl p-6 text-center shadow-2xl w-full max-w-sm">
        <h3 className="text-xl font-bold text-white mb-2">Item Detected</h3>
        <p className="text-gray-400 mb-4">We found one item. Does this look right?</p>
        
        <div className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{item.emoji}</span>
            <p className="text-xl font-semibold text-left">{item.name}</p>
          </div>
          <div className="text-cyan-400 font-bold text-lg">
            {`${(item.confidence * 100).toFixed(0)}%`}
            <span className="block text-xs font-normal text-gray-400">Confidence</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onDiscard} 
            className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            <XIcon className="w-6 h-6" />
            Wrong Item?
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
          >
            <CheckIcon className="w-6 h-6" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetectionConfirmation;
