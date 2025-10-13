import React, { useRef, useEffect } from 'react';
import { DetectedObject, PendingItem } from '../types';
import { UploadIcon, CameraIcon, RemoveIcon, LoadingSpinner } from './icons';
import DetectionConfirmation from './DetectionConfirmation';

interface CameraFeedProps {
  isCameraOn: boolean;
  uploadedImage: string | null;
  detectedObjects: DetectedObject[];
  onUploadClick: () => void;
  onCameraToggle: () => void;
  onRemoveImage: () => void;
  isAnalyzing: boolean;
  pendingItem: PendingItem | null;
  onConfirmAddItem: () => void;
  onDiscardItem: () => void;
  detectionError: string | null;
}

const CameraFeed: React.FC<CameraFeedProps> = ({ 
    isCameraOn, 
    uploadedImage, 
    detectedObjects, 
    onUploadClick, 
    onCameraToggle, 
    onRemoveImage,
    isAnalyzing,
    pendingItem,
    onConfirmAddItem,
    onDiscardItem,
    detectionError
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isCameraOn && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
        });
    } else {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraOn]);

  return (
    <div className="relative w-full h-full bg-gray-900/50 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-gray-700 shadow-2xl">
      {isCameraOn ? (
        <video ref={videoRef} className="w-full h-full object-cover" muted />
      ) : uploadedImage ? (
        <img src={uploadedImage} alt="Uploaded for detection" className="w-full h-full object-contain" />
      ) : (
        <div className="text-center text-gray-400 p-8">
          <h2 className="text-2xl font-bold mb-4">SwiftCart Vision</h2>
          <p className="mb-6">Enable your camera or upload an image to start scanning items.</p>
          <div className="flex justify-center gap-4">
            <button onClick={onCameraToggle} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
              <CameraIcon className="w-6 h-6" />
              Start Camera
            </button>
            <button onClick={onUploadClick} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
              <UploadIcon className="w-6 h-6" />
              Upload Image
            </button>
          </div>
        </div>
      )}
      
      {detectionError && !isAnalyzing && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30 p-4 transition-opacity duration-300">
          <div className="bg-red-900/75 border-2 border-red-500 rounded-2xl p-6 text-center shadow-2xl w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-2">Detection Failed</h3>
            <p className="text-red-200">{detectionError}</p>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <LoadingSpinner className="w-12 h-12 text-cyan-400" />
          <p className="mt-4 text-lg font-semibold">Analyzing image...</p>
        </div>
      )}

      {pendingItem && !isAnalyzing && (
        <DetectionConfirmation 
          item={pendingItem}
          onConfirm={onConfirmAddItem}
          onDiscard={onDiscardItem}
        />
      )}

      {detectedObjects.map(obj => (
        <div
          key={obj.id}
          className="absolute border-2 border-cyan-400 rounded-lg shadow-lg transition-all duration-300"
          style={{
            left: `${obj.box.x}%`,
            top: `${obj.box.y}%`,
            width: `${obj.box.width}%`,
            height: `${obj.box.height}%`,
          }}
        >
          <span className="absolute -top-7 left-0 bg-cyan-400 text-black text-sm font-semibold px-2 py-1 rounded">
            {obj.label}
          </span>
        </div>
      ))}
       {isCameraOn && (
         <button onClick={onCameraToggle} className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
           Stop Camera
         </button>
       )}
       {uploadedImage && !isCameraOn && !isAnalyzing && !pendingItem && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-gray-900/50 p-2 rounded-lg backdrop-blur-sm">
            <button onClick={onUploadClick} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
              <UploadIcon className="w-5 h-5" />
              Add Another
            </button>
            <button onClick={onRemoveImage} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
              <RemoveIcon className="w-5 h-5" />
               Remove
            </button>
        </div>
      )}
    </div>
  );
};

export default CameraFeed;