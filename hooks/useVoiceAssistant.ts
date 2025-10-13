import { useState, useEffect, useCallback, useRef } from 'react';
import { CartItem } from '../types';

// Fix: Cast window to `any` to access browser-specific SpeechRecognition APIs without TypeScript errors.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useVoiceAssistant = (cartItems: CartItem[]) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  // Fix: Use `any` for the useRef type because `SpeechRecognition` is a variable, not a type in this scope.
  // The SpeechRecognition API availability is checked at runtime.
  const recognitionRef = useRef<any | null>(null);

  const speak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.1;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  }, []);

  const processCommand = useCallback((command: string) => {
    const lowerCaseCommand = command.toLowerCase();
    
    if (lowerCaseCommand.includes("what's in my cart") || lowerCaseCommand.includes("what is in my cart")) {
      if (cartItems.length === 0) {
        speak("Your cart is empty.");
      } else {
        const itemNames = cartItems.map(item => `${item.quantity} ${item.name}`).join(', ');
        speak(`You have: ${itemNames}.`);
      }
    } else if (lowerCaseCommand.includes("how much is the total") || lowerCaseCommand.includes("what is the total")) {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (total === 0) {
        speak("Your total is zero.");
      } else {
        speak(`Your total is $${total.toFixed(2)}.`);
      }
    } else if (lowerCaseCommand.includes("clear cart") || lowerCaseCommand.includes("empty cart")) {
      speak("This feature is not yet implemented via voice command.");
    } else {
      speak("Sorry, I didn't understand that command.");
    }
  }, [cartItems, speak]);

  const handleListen = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) return;
      recognitionRef.current.start();
    }
  }, [isListening]);
  
  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => console.error('Speech recognition error:', event.error);
    
    recognition.onresult = (event) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      processCommand(currentTranscript);
    };

    recognitionRef.current = recognition;

  }, [processCommand]);

  return { isListening, transcript, toggleListen: handleListen };
};
