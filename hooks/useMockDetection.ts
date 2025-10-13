import { useState, useEffect, useCallback, useRef } from 'react';
import { DetectedObject, Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';

export const useMockDetection = (
  isActive: boolean,
  onDetect: (product: Product) => void
) => {
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const detectionInterval = useRef<number | null>(null);

  const runMockDetection = useCallback(() => {
    // Pick a random product to "detect"
    const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];

    // Create a new detected object
    const newObject: DetectedObject = {
      id: `${Date.now()}-${product.id}`,
      label: `${product.emoji} ${product.name}`,
      box: {
        x: Math.random() * 60 + 10, // %
        y: Math.random() * 60 + 10, // %
        width: Math.random() * 20 + 10, // %
        height: Math.random() * 20 + 10, // %
      },
    };
    
    setDetectedObjects([newObject]);
    onDetect(product);

    // Clear the box after a short delay
    setTimeout(() => {
      setDetectedObjects([]);
    }, 2000);
  }, [onDetect]);

  useEffect(() => {
    if (isActive) {
      detectionInterval.current = window.setInterval(runMockDetection, 4000);
    } else {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      setDetectedObjects([]);
    }

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, [isActive, runMockDetection]);

  return detectedObjects;
};
