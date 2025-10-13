import React from 'react';
import { CartItem } from '../types';

interface CartItemDisplayProps {
  item: CartItem;
}

const CartItemDisplay: React.FC<CartItemDisplayProps> = ({ item }) => {
  return (
    <li className="flex justify-between items-center py-3 px-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{item.emoji}</span>
        <div>
          <p className="font-semibold text-gray-100">{item.name}</p>
          <p className="text-sm text-gray-400">
            {item.quantity} x ${item.price.toFixed(2)}
          </p>
        </div>
      </div>
      <p className="font-bold text-lg text-gray-100">${(item.quantity * item.price).toFixed(2)}</p>
    </li>
  );
};

export default CartItemDisplay;
