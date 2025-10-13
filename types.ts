export interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DetectedObject {
  id: string;
  label: string;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PendingItem extends Product {
  confidence: number;
}

export enum Emotion {
  Neutral = "Neutral",
  Happy = "Happy",
  Confused = "Confused",
  Frustrated = "Frustrated",
}
