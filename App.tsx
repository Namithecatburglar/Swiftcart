import React, { useState, useCallback, useRef, useEffect } from 'react';
import CameraFeed from './components/CameraFeed';
import BillingPanel from './components/BillingPanel';
import VoiceControl from './components/VoiceControl';
import { CartItem, Product, Emotion, DetectedObject, PendingItem } from './types';
import { useMockDetection } from './hooks/useMockDetection';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { getProductSuggestions, identifyItemInImage } from './services/geminiService';
import { MOCK_PRODUCTS } from './constants';

function App() {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('swiftcart-items', []);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(Emotion.Neutral);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [geminiSuggestion, setGeminiSuggestion] = useState<string>('');
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pendingItem, setPendingItem] = useState<PendingItem | null>(null);
  const [detectionError, setDetectionError] = useState<string | null>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleItemDetected = useCallback((product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  }, [setCartItems]);

  const cameraDetections = useMockDetection(isCameraOn, handleItemDetected);
  const { isListening, transcript, toggleListen } = useVoiceAssistant(cartItems);

  const handleCameraToggle = () => {
    setIsCameraOn(prev => !prev);
    if (uploadedImage) {
        setUploadedImage(null);
        setCartItems([]);
        setPendingItem(null);
        setDetectionError(null);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setPendingItem(null);
    setDetectionError(null);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPendingItem(null);
      setDetectionError(null);
      setIsAnalyzing(true);
      setUploadedImage(null);
      if (isCameraOn) setIsCameraOn(false);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setUploadedImage(result);
        const base64Data = result.split(',')[1];
        
        try {
          const itemName = await identifyItemInImage(base64Data, file.type);
          if (itemName.toLowerCase() === 'unknown') {
            throw new Error("Could not identify the item in the image.");
          }
          const lowerCaseItemName = itemName.toLowerCase();
          
          const matchedProduct = MOCK_PRODUCTS.find(p => 
            p.name.toLowerCase().includes(lowerCaseItemName)
          );

          if (matchedProduct) {
            setPendingItem({
              ...matchedProduct,
              confidence: Math.random() * 0.1 + 0.89, // Simulate 89%-99% confidence
            });
          } else {
            console.warn(`Gemini identified "${itemName}", but no matching product was found.`);
            setDetectionError(`'${itemName}' is not in our catalog.`);
            setTimeout(() => setDetectionError(null), 4000);
          }
        } catch (error) {
          console.error("Error identifying item:", error);
          setDetectionError("Could not analyze the image. Please try again.");
          setTimeout(() => setDetectionError(null), 4000);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleConfirmAddItem = () => {
    if (pendingItem) {
      handleItemDetected(pendingItem);
      setPendingItem(null);
    }
  };

  const handleDiscardItem = () => {
    setPendingItem(null);
  };

  const handleClearCart = () => {
    setCartItems([]);
  }

  const fetchSuggestions = useCallback(async () => {
    setIsLoadingSuggestion(true);
    const suggestion = await getProductSuggestions(cartItems);
    setGeminiSuggestion(suggestion);
    setIsLoadingSuggestion(false);
  }, [cartItems]);
  
  useEffect(() => {
    if (cartItems.length > 0) {
        const debounceTimer = setTimeout(() => {
            fetchSuggestions();
        }, 1000);
        return () => clearTimeout(debounceTimer);
    } else {
        setGeminiSuggestion("Add items to your cart to get suggestions!");
    }
  }, [cartItems, fetchSuggestions]);


  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      <div className="relative flex-grow lg:w-2/3 h-[50vh] lg:h-auto">
        <CameraFeed 
          isCameraOn={isCameraOn}
          uploadedImage={uploadedImage}
          detectedObjects={isCameraOn ? cameraDetections : []}
          onUploadClick={handleUploadClick}
          onCameraToggle={handleCameraToggle}
          onRemoveImage={handleRemoveImage}
          isAnalyzing={isAnalyzing}
          pendingItem={pendingItem}
          onConfirmAddItem={handleConfirmAddItem}
          onDiscardItem={handleDiscardItem}
          detectionError={detectionError}
        />
        <VoiceControl isListening={isListening} transcript={transcript} onToggleListen={toggleListen} />
      </div>
      <aside className="lg:w-1/3 lg:max-w-md xl:max-w-lg flex-shrink-0 h-full">
        <BillingPanel
          cartItems={cartItems}
          currentEmotion={currentEmotion}
          onEmotionChange={setCurrentEmotion}
          geminiSuggestion={geminiSuggestion}
          isLoadingSuggestion={isLoadingSuggestion}
          onRefreshSuggestion={fetchSuggestions}
          onClearCart={handleClearCart}
        />
      </aside>
    </div>
  );
}

export default App;