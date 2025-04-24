import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const SecondaryBar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full relative z-10 bg-white shadow-[0_1.5px_3px_rgba(0,0,0,0.25)]">
      {/* Mobile Layout */}
      <div className="sm:hidden h-[41px] flex items-center px-2 text-gray-800">
        <div className="ml-auto flex items-center gap-2">
          <button 
            className="flex items-center justify-center text-gray-800 px-2 py-2 rounded hover:bg-gray-200"
            onClick={() => navigate('/login')}
          >
            <FaSignOutAlt size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex h-[41px] items-center px-6 text-gray-800">
        <div className="ml-auto flex items-center gap-4">
          <button 
            className="flex items-center justify-center gap-2 text-gray-800 px-4 py-2 rounded hover:bg-gray-200"
            onClick={() => navigate('/login')}
          >
            <FaSignOutAlt size={20} />
            <span className="text-base">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryBar;