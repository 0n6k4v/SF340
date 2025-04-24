import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ImagePreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageData, setImageData] = useState(null);
  const [mode, setMode] = useState(null);
  const [resolution, setResolution] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [fromCamera, setFromCamera] = useState(false);
  const [viewMode, setViewMode] = useState('contain');

  // Extract image data and mode from navigation state
  useEffect(() => {
    if (location.state && location.state.imageData) {
      setImageData(location.state.imageData);
      setMode(location.state.mode);
      setResolution(location.state.resolution || '');
      setFromCamera(location.state.fromCamera || false);
      setViewMode(location.state.viewMode || 'contain');
    } else {
      // Fallback if no image data
      navigate('/home');
    }
  }, [location.state, navigate]);

  // Monitor screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle going back to camera
  const handleRetake = () => {
    navigate('/camera');
  };

  // Handle going back (generic)
  const handleGoBack = () => {
    navigate(-1);
  };

  // If no image data, don't render anything
  if (!imageData) return null;

  // Mobile Version
  const MobilePreview = () => (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="relative p-4 flex justify-start items-center bg-black/80">
        <button 
          onClick={fromCamera ? handleRetake : handleGoBack}
          className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <span className="text-white font-medium ml-4">ตรวจสอบภาพ</span>
        
        {resolution && (
          <span className="ml-auto text-xs text-gray-400">
            {resolution}
          </span>
        )}
      </div>

      {/* Image preview */}
      <div className="flex-1 relative">
        <img 
          src={imageData} 
          alt="Preview" 
          className={`w-full h-full object-${viewMode}`}
        />
        <div className="absolute top-4 right-4">
          <span className="px-4 py-2 rounded-full bg-black/50 text-white text-sm">
            {mode === 'ยาเสพติด' ? '🔍 ตรวจจับยาเสพติด' : '🔍 ตรวจจับอาวุธปืน'}
          </span>
        </div>
      </div>

      {/* Action Button - Only Retake */}
      <div className="p-6 bg-black/80">
        <button
          onClick={fromCamera ? handleRetake : handleGoBack}
          className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-full text-white font-medium flex items-center justify-center space-x-2 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{fromCamera ? 'ถ่ายภาพใหม่' : 'เลือกภาพใหม่'}</span>
        </button>
      </div>
    </div>
  );

  // Desktop Version
  const DesktopPreview = () => (
    <div className="fixed inset-0 bg-gray-900 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 flex justify-start items-center bg-black">
        <button 
          onClick={fromCamera ? handleRetake : handleGoBack}
          className="p-2 rounded-full hover:bg-gray-800/50 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <span className="text-white font-medium text-xl ml-4">ตรวจสอบภาพ</span>
        
        {resolution && (
          <span className="ml-auto text-sm text-gray-400">
            {resolution}
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Image Preview (70%) */}
        <div className="w-8/12 bg-black flex items-center justify-center p-4 overflow-hidden">
          <div className="relative h-full w-full flex items-center justify-center">
            <img 
              src={imageData} 
              alt="Preview" 
              className={`max-h-full max-w-full object-${viewMode} border border-gray-800`}
            />
            <div className="absolute top-4 right-4">
              <span className="px-4 py-2 rounded-full bg-black/50 text-white">
                {mode === 'ยาเสพติด' ? '🔍 ตรวจจับยาเสพติด' : '🔍 ตรวจจับอาวุธปืน'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Controls (30%) - Only Retake Button */}
        <div className="w-4/12 bg-gray-900 p-6 flex flex-col">
          <div className="flex-1"></div> {/* Spacer */}
          
          <button
            onClick={fromCamera ? handleRetake : handleGoBack}
            className="w-full py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{fromCamera ? 'ถ่ายภาพใหม่' : 'เลือกภาพใหม่'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  return isDesktop ? <DesktopPreview /> : <MobilePreview />;
};

export default ImagePreview;