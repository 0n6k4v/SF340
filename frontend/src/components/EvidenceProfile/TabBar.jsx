import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabRefs = useRef([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  
  // แก้ไขให้เหลือเพียงแท็บเดียว - ข้อมูลเบื้องต้น
  const tabs = [
    { id: 0, name: 'ข้อมูลเบื้องต้น', path: '/evidenceProfile' },
    // ตัดแท็บ "คลังภาพ" และ "ประวัติ" ออกไป
  ];
  
  // เนื่องจากเหลือแท็บเดียว จึงรีเทิร์นค่า 0 เสมอ
  const findActiveTabIndex = () => {
    return 0; // เหลือเพียงแท็บเดียว จึงรีเทิร์น 0 เสมอ
  };
  
  const activeTab = findActiveTabIndex();
  
  useEffect(() => {
    if (tabRefs.current[activeTab]) {
      const tabRect = tabRefs.current[activeTab].getBoundingClientRect();
      const parentRect = tabRefs.current[activeTab].parentNode.getBoundingClientRect();
      setIndicatorStyle({ 
        left: tabRect.left - parentRect.left, 
        width: tabRect.width 
      });
    }
  }, [activeTab, location.pathname]);

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <div className="bg-white border-b border-gray-200 relative">
      <div className="flex relative">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            className={`px-6 py-3 text-sm relative border-b-2 ${
              activeTab === index 
              ? 'text-black border-[#990000]' 
              : 'text-gray-500 border-transparent'
            }`}
            onClick={() => handleTabClick(tab.path)}
          >
            {tab.name}
          </button>
        ))}
        <div 
          className="absolute bottom-0 bg-[#990000] h-0.5 transition-all duration-300"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </div>
    </div>
  );
};

export default TabBar;