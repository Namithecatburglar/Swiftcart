import { Product, Emotion } from './types';

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: "Organic Apples", price: 3.99, emoji: "🍎" },
  { id: 2, name: "Whole Milk", price: 2.49, emoji: "🥛" },
  { id: 3, name: "Sourdough Bread", price: 4.99, emoji: "🍞" },
  { id: 4, name: "Avocado", price: 1.99, emoji: "🥑" },
  { id: 5, name: "Free-Range Eggs", price: 5.29, emoji: "🥚" },
  { id: 6, name: "Banana Bunch", price: 1.89, emoji: "🍌" },
  { id: 7, name: "Dark Chocolate Bar", price: 3.79, emoji: "🍫" },
  { id: 8, name: "Sparkling Water", price: 1.25, emoji: "💧" },
];

export const EMOTION_THEMES: Record<Emotion, { accent: string; bg: string; text: string; emoji: string }> = {
  [Emotion.Neutral]: { accent: "blue-500", bg: "gray-800", text: "gray-100", emoji: "😐" },
  [Emotion.Happy]: { accent: "green-500", bg: "green-900", text: "green-100", emoji: "😊" },
  [Emotion.Confused]: { accent: "yellow-500", bg: "yellow-900", text: "yellow-100", emoji: "🤔" },
  [Emotion.Frustrated]: { accent: "red-500", bg: "red-900", text: "red-100", emoji: "😠" },
};
