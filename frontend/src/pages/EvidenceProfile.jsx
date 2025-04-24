import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TabBar from '../components/EvidenceProfile/TabBar';
import BottomBar from '../components/EvidenceProfile/BottomBar';
import GunBasicInformation from '../components/EvidenceProfile/GunProfile';
import DrugBasicInformation from '../components/EvidenceProfile/DrugProfile';

const EvidenceProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [evidence, setEvidence] = useState(() => {
    if (location.state && (location.state.type || location.state.evidence)) {
      if (location.state.type) {
        return {
          type: location.state.type,
          result: location.state.result
        };
      }
      if (location.state.evidence) {
        return location.state.evidence;
      }
    }
    const savedResult = localStorage.getItem('analysisResult');
    if (savedResult) {
      const result = JSON.parse(savedResult);
      const type = result.hasOwnProperty('prediction') ? 'Drug' : 'Gun';
      return { type, result };
    }
    
    const currentEvidence = localStorage.getItem('currentEvidenceData');
    if (currentEvidence) {
      return JSON.parse(currentEvidence);
    }

    return { type: '', result: null };
  });

  useEffect(() => {
    if (evidence && (evidence.type || evidence.result)) {
      localStorage.setItem('currentEvidenceData', JSON.stringify(evidence));
    }
  }, [evidence]);

  const [firearmInfo, setFirearmInfo] = useState(() => {
    if (location.state && location.state.firearmInfo) {
      return location.state.firearmInfo;
    }
    const saved = localStorage.getItem('firearmInfo');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (firearmInfo) {
      localStorage.setItem('firearmInfo', JSON.stringify(firearmInfo));
    }
  }, [firearmInfo]);

  const renderBasicInfo = () => {
    if (!evidence || (!evidence.type && !evidence.result)) {
      return <div className="p-4 text-red-600">ไม่พบข้อมูลวัตถุพยาน</div>;
    }

    const evidenceType = evidence.type || (evidence.result?.hasOwnProperty('prediction') ? 'Drug' : 'Gun');
    
    switch (evidenceType) {
      case 'Gun':
        return (
          <GunBasicInformation
            analysisResult={evidence.result || evidence}
            firearmInfo={firearmInfo}
          />
        );
      case 'Drug':
        return <DrugBasicInformation analysisResult={evidence.result || evidence} />;
      default:
        return <div className="p-4 text-red-600">ไม่พบข้อมูลวัตถุพยาน</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TabBar />
      <div className="flex-1 overflow-auto">
        {renderBasicInfo()}
      </div>
      <BottomBar firearmInfo={firearmInfo} />
    </div>
  );
};

export default EvidenceProfile;