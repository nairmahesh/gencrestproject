import React, { useRef, useEffect, useState } from 'react';
import { X, Check, RotateCcw, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

interface SignatureCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: string) => void;
  title?: string;
}

export const SignatureCapture: React.FC<SignatureCaptureProps> = ({
  isOpen,
  onClose,
  onSave,
  title = 'Capture Signature'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const { latitude, longitude, error: locationError } = useGeolocation();

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setIsEmpty(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
      }
    }
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas && !isEmpty) {
      const dataURL = canvas.toDataURL();
      
      // Create signature with metadata
      const signatureWithMetadata = {
        signature: dataURL,
        timestamp: new Date().toISOString(),
        location: {
          latitude: latitude || 0,
          longitude: longitude || 0
        },
        metadata: {
          capturedAt: new Date().toLocaleString('en-IN'),
          deviceInfo: navigator.userAgent.substring(0, 50)
        }
      };
      
      onSave(JSON.stringify(signatureWithMetadata));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
            <canvas
              ref={canvasRef}
              width={300}
              height={150}
              className="w-full border rounded cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
          
          {/* Location & Time Info */}
          <div className={`p-3 rounded-lg mb-4 ${
            latitude && longitude 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-1">
              <MapPin className={`w-4 h-4 ${latitude && longitude ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm font-medium ${latitude && longitude ? 'text-green-800' : 'text-red-800'}`}>
                {latitude && longitude 
                  ? `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                  : 'Location access required'
                }
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className={`w-4 h-4 ${latitude && longitude ? 'text-green-600' : 'text-red-600'}`} />
              <span className={`text-sm ${latitude && longitude ? 'text-green-700' : 'text-red-700'}`}>
                {new Date().toLocaleString('en-IN')}
              </span>
            </div>
            {locationError && (
              <p className="text-xs text-red-600 mt-1">{locationError}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={clearSignature}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </button>
            <button
              onClick={saveSignature}
              disabled={isEmpty || !latitude || !longitude}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-4 h-4" />
              Save with Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};