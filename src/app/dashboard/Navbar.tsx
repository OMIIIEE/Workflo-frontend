import React from 'react';
import { FaHome, FaClipboardList, FaSignOutAlt, FaPlus, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ onAddTask }: { onAddTask: () => void }) => {
  return (
    <div className="bg-transparent text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 rounded bg-gray-700 text-black bg-white"
        />
      </div>
      <button
        onClick={onAddTask}
        className="bg-violet-700 p-2 rounded text-white flex flex-row items-center gap-2"
      >
        Create New Task <FaPlus className="mr-2" />
      </button>
    </div>
  );
};

export default Navbar;
