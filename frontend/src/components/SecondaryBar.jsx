import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const SecondaryBar = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full relative z-10 bg-white shadow-[0_1.5px_3px_rgba(0,0,0,0.25)]">
      {/* Mobile Layout */}
      <div className="sm:hidden h-[41px] flex items-center px-2 text-gray-800">
        <div className="ml-auto flex items-center gap-2"></div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex h-[41px] items-center px-6 text-gray-800">
        <div className="ml-auto flex items-center gap-4"></div>
      </div>
    </div>
  );
};

export default SecondaryBar;