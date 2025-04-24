import React, { useState, useEffect, useRef } from 'react';
import { FiMenu, FiChevronDown, FiChevronUp, FiX } from 'react-icons/fi';
import { FaHome, FaCamera, FaUpload, FaPills } from "react-icons/fa";
import { GiPistolGun } from "react-icons/gi";
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isUploadDropdownOpen, setUploadDropdownOpen] = useState(false);
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [isUploadDropupOpen, setIsUploadDropupOpen] = useState(false); // New state for mobile upload dropup
  const [sheetTranslateY, setSheetTranslateY] = useState('100%');
  const [sheetTransition, setSheetTransition] = useState('transform 0.3s ease-out');
  
  const dropdownRef = useRef(null);
  const uploadDropupRef = useRef(null); // Ref for dropup menu
  const bottomSheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isDragging = useRef(false);
  const sheetHeight = useRef(0);

  // Set active tab based on current path
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname.slice(1) || 'home';
    return path;
  });

  // Check screen size and set mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setUploadDropdownOpen(false);
      } else {
        setSidebarOpen(true);
        setBottomSheetOpen(false);
        setIsUploadDropupOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // For sidebar dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUploadDropdownOpen(false);
      }
      
      // For bottom sheet
      if (isBottomSheetOpen && bottomSheetRef.current && !bottomSheetRef.current.contains(event.target)) {
        const uploadButton = document.getElementById('mobile-upload-button');
        if (!uploadButton || !uploadButton.contains(event.target)) {
          closeBottomSheet();
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUploadDropdownOpen, isBottomSheetOpen]);

  // Close dropdown when sidebar collapses
  useEffect(() => {
    if (!isSidebarOpen) {
      setUploadDropdownOpen(false);
    }
  }, [isSidebarOpen]);

  // Effect to handle Bottom Sheet open/close animation
  useEffect(() => {
    if (isBottomSheetOpen) {
      requestAnimationFrame(() => {
        if (bottomSheetRef.current) {
          if (sheetHeight.current === 0) {
            sheetHeight.current = bottomSheetRef.current.offsetHeight;
          }
          setSheetTranslateY('0%');
          setSheetTransition('transform 0.3s ease-out');
        }
      });
    } else {
      setSheetTranslateY('100%');
      setSheetTransition('transform 0.3s ease-out');
    }
  }, [isBottomSheetOpen]);

  // Filtered menu items lists
  const sidebarItems = [
    { id: 'home', icon: <FaHome size={24} />, text: "หน้าหลัก", path: "/home" },
    { id: 'camera', icon: <FaCamera size={24} />, text: "ถ่ายภาพ", path: "/camera" },
    { id: 'upload', icon: <FaUpload size={24} />, text: "อัพโหลดภาพ", path: "/upload", hasDropdown: true },
  ];

  const bottomNavItems = [
    { id: 'home', icon: <FaHome size={22} />, text: "หน้าหลัก", path: "/home" },
    { id: 'camera', icon: <FaCamera size={24} />, text: "ถ่ายภาพ", path: "/camera", isSpecial: true },
    { id: 'upload', icon: <FaUpload size={22} />, text: "อัพโหลด", path: "/upload", hasSlideUp: true },
  ];

  const uploadOptions = [
    { id: 'upload-gun', icon: <GiPistolGun size={24} />, text: "อาวุธปืน", path: "/upload/photo", mode: "อาวุปืน" },
    { id: 'upload-drug', icon: <FaPills size={24} />, text: "ยาเสพติด", path: "/upload/album", mode: "ยาเสพติด" },
  ];

  const handleNavClick = (e, path, id) => {
    e.stopPropagation();
    setActiveTab(id);
    navigate(path);
    
    // Close dropdowns
    if (!isSidebarOpen && id !== 'upload') {
      setUploadDropdownOpen(false);
    }
    closeBottomSheet();
  };

  const handleUploadOptionClick = (e, item) => {
    e.stopPropagation();
    
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Navigate to ImagePreview route with image data and mode
          navigate('/imagePreview', { 
            state: { 
              imageData: event.target.result, 
              mode: item.mode 
            } 
          });
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
    
    // Close all menus
    setUploadDropdownOpen(false);
    closeBottomSheet();
  };

  const toggleUploadDropdown = (e) => {
    e.stopPropagation();
    
    // If sidebar is collapsed and user clicks on upload button, expand the sidebar first
    if (!isSidebarOpen && !isMobile) {
      setSidebarOpen(true);
      // Open the dropdown after sidebar is expanded
      setTimeout(() => {
        setUploadDropdownOpen(true);
      }, 300);
    } else {
      // Normal toggle behavior
      setUploadDropdownOpen(!isUploadDropdownOpen);
    }
  };
  
  const toggleBottomSheet = (e) => {
    e.stopPropagation();
    setBottomSheetOpen(!isBottomSheetOpen);
  };

  const closeBottomSheet = () => {
    setSheetTransition('transform 0.3s ease-out');
    setSheetTranslateY('100%');
    
    setTimeout(() => {
      setBottomSheetOpen(false);
    }, 300);
  };

  // Touch Handlers for Draggable Bottom Sheet
  const handleTouchStart = (e) => {
    if (!bottomSheetRef.current) return;
    const targetElement = e.target;
    const scrollableParent = targetElement.closest('.overflow-y-auto');
    if (scrollableParent && scrollableParent.scrollTop > 0 && scrollableParent.contains(targetElement)) {
        isDragging.current = false;
        return;
    }

    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    isDragging.current = true;
    setSheetTransition('none');

    if (bottomSheetRef.current) {
      sheetHeight.current = bottomSheetRef.current.offsetHeight;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || !bottomSheetRef.current) return;

    const y = e.touches[0].clientY;
    const diffY = y - startY.current;
    currentY.current = y;

    const newTranslateY = Math.max(0, diffY);
    bottomSheetRef.current.style.transform = `translateY(${newTranslateY}px)`;
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current || !bottomSheetRef.current) {
        isDragging.current = false;
        return;
    }

    if (startY.current === 0) {
        isDragging.current = false;
        return;
    }

    isDragging.current = false;
    setSheetTransition('transform 0.3s ease-out');

    const finalY = currentY.current;
    const diffY = finalY - startY.current;
    const closeThreshold = sheetHeight.current > 0 ? sheetHeight.current * 0.25 : 80;

    if (diffY > closeThreshold) {
      closeBottomSheet();
    } else {
      setSheetTranslateY('0%');
      requestAnimationFrame(() => {
          if (bottomSheetRef.current) {
              bottomSheetRef.current.style.transform = '';
          }
      });
    }

    startY.current = 0;
    currentY.current = 0;
  };

  const Sidebar = () => (
    <div className="h-full">      
      <div className={`
        h-full 
        ${isSidebarOpen ? "w-64" : "w-14"} 
        bg-gradient-to-b from-[#2C2C2C] to-[#1A1A1A] text-white 
        flex flex-col 
        transition-all duration-300 
        overflow-hidden
        relative
      `}>
        <div className="p-4">
          <button 
            onClick={() => {
              setSidebarOpen(!isSidebarOpen);
              if (isSidebarOpen) {
                setUploadDropdownOpen(false);
              }
            }} 
            className="text-white hover:text-gray-300 transition-colors"
          >
            <FiMenu size={24} />
          </button>
        </div>
        
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.id} className="relative" ref={item.id === 'upload' ? dropdownRef : null}>
              {activeTab === item.id && (
                <div className="absolute left-0 top-0 w-2 h-full bg-[#990000]" />
              )}
              {item.hasDropdown ? (
                <div>
                  <button
                    onClick={toggleUploadDropdown}
                    className={`
                      flex items-center justify-between px-4 py-4 w-full text-left
                      hover:bg-[#444444] transition-all
                      ${activeTab === item.id || isUploadDropdownOpen ? 'bg-[#444444]' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-6">
                      <div className="min-w-[24px]">
                        {item.icon}
                      </div>
                      <span className={`text-base whitespace-nowrap transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                        {item.text}
                      </span>
                    </div>
                    {isSidebarOpen && (
                      <div className="text-gray-400">
                        {isUploadDropdownOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                      </div>
                    )}
                  </button>
                  
                  {/* Dropdown Menu - Only show when sidebar is expanded */}
                  {isUploadDropdownOpen && isSidebarOpen && (
                    <div className="bg-[#222222]">
                      {uploadOptions.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={(e) => handleUploadOptionClick(e, subItem)}
                          className={`
                            flex items-center space-x-6 
                            px-16
                            py-3 w-full text-left
                            hover:bg-[#333333] transition-all
                            text-gray-300 hover:text-white
                          `}
                        >
                          <div className="min-w-[24px]">
                            {subItem.icon}
                          </div>
                          <span className="text-base whitespace-nowrap">
                            {subItem.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={(e) => handleNavClick(e, item.path, item.id)}
                  className={`
                    flex items-center space-x-6 px-4 py-4 w-full text-left
                    hover:bg-[#444444] transition-all
                    ${activeTab === item.id ? 'bg-[#444444]' : ''}
                  `}
                >
                  <div className="min-w-[24px]">
                    {item.icon}
                  </div>
                  <span className={`text-base whitespace-nowrap transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {item.text}
                  </span>
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  const BottomNav = () => {
    return (
      <>
        {/* Bottom Sheet for Upload Options */}
        {isBottomSheetOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 touch-none"
            onClick={closeBottomSheet}
          />
        )}
        
        <div 
          ref={bottomSheetRef}
          className="fixed left-0 right-0 z-50 bg-[#222222] rounded-t-xl shadow-lg"
          style={{
            bottom: 0,
            transform: `translateY(${sheetTranslateY})`,
            transition: sheetTransition,
            maxHeight: '70vh',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {isBottomSheetOpen && (
            <>
              {/* Handle bar */}
              <div className="w-full flex justify-center pt-3 pb-1">
                <div className="w-12 h-1.5 rounded-full bg-gray-400" />
              </div>
              
              {/* Header */}
              <div className="px-6 py-3 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">อัพโหลดรูปภาพ</h3>
                  <button 
                    onClick={closeBottomSheet}
                    className="text-gray-400 hover:text-white transition-colors" 
                  >
                    <FiX size={22} />
                  </button>
                </div>
              </div>
              
              {/* Upload options */}
              <div className="p-4">
                {uploadOptions.map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => handleUploadOptionClick(e, item)}
                    className="flex items-center w-full px-4 py-5 mb-2 space-x-4 text-left text-white bg-[#333333] rounded-lg hover:bg-[#444444] transition-colors"
                  >
                    <div className="p-2 bg-[#444444] rounded-full">
                      {item.icon}
                    </div>
                    <span className="text-base font-medium">{item.text}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40">
          {/* Background */}
          <div className="absolute inset-0 bg-[#333333] border-t border-gray-700/50" />
          
          {/* Main Navigation */}
          <div className="relative h-16 px-4">
            <div className="flex items-center justify-around h-full">
              {/* Home */}
              <button
                onClick={(e) => handleNavClick(e, "/home", 'home')}
                className={`
                  flex flex-col items-center justify-center w-16 h-full
                  transition-all duration-200
                  ${activeTab === 'home' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}
                `}
              >
                <FaHome size={22} />
                <span className="text-[10px] mt-1 font-medium">หน้าหลัก</span>
              </button>

              {/* Camera Button (center) */}
              <button
                onClick={(e) => handleNavClick(e, "/camera", 'camera')}
                className="flex flex-col items-center justify-center w-16 -mt-6"
              >
                <div className="
                  bg-[#990000] rounded-full p-4
                  shadow-lg shadow-red-900/30
                  transition-transform duration-200
                  hover:scale-105
                  relative
                ">
                  <FaCamera size={24} className="text-white" />
                </div>
                <span className="text-[10px] mt-1 font-medium text-white"></span>
              </button>

              {/* Upload (with slide up sheet) */}
              <button
                id="mobile-upload-button"
                onClick={toggleBottomSheet}
                className={`
                  flex flex-col items-center justify-center w-16 h-full
                  transition-all duration-200
                  ${activeTab === 'upload' || isBottomSheetOpen ? 'text-white' : 'text-gray-400 hover:text-gray-200'}
                `}
              >
                <FaUpload size={22} />
                <span className="text-[10px] mt-1 font-medium">อัพโหลด</span>
              </button>
            </div>
          </div>
        </div>
      </>
    )
  };
  
  return (
    <>
      {isMobile ? <BottomNav /> : <Sidebar />}
      <div className={`${isMobile ? 'pb-16' : ''} ${isSidebarOpen && !isMobile ? '' : !isMobile ? '' : ''} transition-all duration-300`}>
        {/* Your main content would go here */}
      </div>
    </>
  );
};

export default Navigation;