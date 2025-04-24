import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomBar = ({ firearmInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get evidence data from location state or localStorage
  const evidenceData = location.state?.evidence || 
    JSON.parse(localStorage.getItem('currentEvidenceData')) || 
    JSON.parse(localStorage.getItem('analysisResult'));

  const handleRetakeOrGoBack = () => {
    const isFromCamera = location.state?.fromCamera || false;

    if (isFromCamera) {
      navigate('/camera');
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="w-full py-4 px-4 flex justify-end border-t">
      <button 
        className="px-7 py-1.5 border border-t-2 border-r-2 border-l-2 border-b-4 border-[#6B0000] rounded-lg text-[#900B09]"
        onClick={handleRetakeOrGoBack}
      >
        ถ่ายใหม่
      </button>
    </div>
  );
};

export default BottomBar;