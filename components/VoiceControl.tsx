import React from 'react';
import { MicIcon } from './icons';

interface VoiceControlProps {
    isListening: boolean;
    transcript: string;
    onToggleListen: () => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({ isListening, transcript, onToggleListen }) => {
    return (
        <div className="absolute top-6 left-6 flex items-center gap-4 bg-gray-900/50 p-3 rounded-full shadow-lg backdrop-blur-sm border border-gray-700">
            <button
                onClick={onToggleListen}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                }`}
            >
                <MicIcon className="w-6 h-6 text-white" />
            </button>
            <div className="text-sm text-gray-300 pr-4 min-w-[200px]">
                {isListening ? (
                    <span className="italic">Listening...</span>
                ) : transcript ? (
                    <p className="line-clamp-2">"{transcript}"</p>
                ) : (
                    <p>Click mic to talk</p>
                )}
            </div>
        </div>
    );
};

export default VoiceControl;
