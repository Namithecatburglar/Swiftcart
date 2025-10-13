import React from 'react';
import { CartItem, Emotion } from '../types';
import { EMOTION_THEMES } from '../constants';
import CartItemDisplay from './CartItemDisplay';
import SuggestionBox from './SuggestionBox';
import { RemoveIcon } from './icons';

interface BillingPanelProps {
  cartItems: CartItem[];
  currentEmotion: Emotion;
  onEmotionChange: (emotion: Emotion) => void;
  geminiSuggestion: string;
  isLoadingSuggestion: boolean;
  onRefreshSuggestion: () => void;
  onClearCart: () => void;
}

const BillingPanel: React.FC<BillingPanelProps> = ({
  cartItems,
  currentEmotion,
  onEmotionChange,
  geminiSuggestion,
  isLoadingSuggestion,
  onRefreshSuggestion,
  onClearCart
}) => {
  const theme = EMOTION_THEMES[currentEmotion];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`h-full flex flex-col p-6 rounded-2xl border-2 border-gray-700 bg-gray-800 shadow-2xl transition-colors duration-500`}>
      {/* Emotion Selector */}
      <div className="mb-4">
          <label htmlFor="emotion-select" className="block text-sm font-medium text-gray-400 mb-2">
              Select Shopper Mood (Demo):
          </label>
          <select
              id="emotion-select"
              value={currentEmotion}
              onChange={(e) => onEmotionChange(e.target.value as Emotion)}
              className={`w-full p-2 rounded-md bg-gray-700 border-2 border-transparent focus:border-${theme.accent} focus:ring-${theme.accent} transition-all`}
          >
              {Object.values(Emotion).map((emo) => (
                  <option key={emo} value={emo}>
                      {EMOTION_THEMES[emo].emoji} {emo}
                  </option>
              ))}
          </select>
      </div>
      
      <div className={`flex items-center justify-between mb-4 p-3 rounded-lg bg-${theme.bg} border border-${theme.accent}/50`}>
          <span className={`text-5xl`}>{theme.emoji}</span>
          <p className={`text-lg font-semibold text-${theme.text}`}>
              {currentEmotion === Emotion.Happy ? "Happy Shopping!" : 
               currentEmotion === Emotion.Confused ? "Need any help?" : 
               currentEmotion === Emotion.Frustrated ? "Let's resolve this." :
               "Welcome to SwiftCart"}
          </p>
      </div>

      <div className="flex justify-between items-baseline">
        <h2 className="text-3xl font-bold text-white">Your Cart</h2>
        {cartItems.length > 0 && 
            <button onClick={onClearCart} className="flex items-center gap-2 text-sm bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md transition-colors">
              <RemoveIcon className="w-4 h-4" />
              Clear Cart
            </button>
        }
      </div>
      <hr className="my-4 border-gray-600" />
      
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        {cartItems.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>Scan an item to begin</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {cartItems.map(item => <CartItemDisplay key={item.id} item={item} />)}
          </ul>
        )}
      </div>

      <SuggestionBox 
        suggestion={geminiSuggestion} 
        isLoading={isLoadingSuggestion}
        onRefresh={onRefreshSuggestion}
        accentColor={theme.accent}
      />
      
      <div className="mt-6 pt-6 border-t-2 border-gray-600">
        <div className="flex justify-between items-center text-2xl font-bold mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button className={`w-full py-4 rounded-lg bg-${theme.accent} text-white font-bold text-xl hover:opacity-90 transition-all transform hover:scale-105`}>
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BillingPanel;