'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaClipboardList, FaSignOutAlt, FaPlus, FaUserCircle } from 'react-icons/fa';

interface SidebarProps {
  user: { username: string };
  onAddTask: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onAddTask }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="w-64 bg-white  min-h-screen flex flex-col">
      <div className="flex items-center p-4">
        <FaUserCircle size={32} />
        <span className="ml-2">{user.username}</span>
      </div>
      <nav className="flex flex-col p-4">
        <button className="flex items-center py-2 px-4 hover:bg-gray-300 rounded-lg" onClick={() => router.push('/dashboard')}>
          <FaHome className="mr-2" /> Home
        </button>
        <button className="flex items-center py-2 px-4 hover:bg-gray-300 rounded-lg">
          <FaClipboardList className="mr-2" /> Boards
        </button>
        <button className="flex items-center py-2 px-4 hover:bg-gray-300 rounded-lg" onClick={handleLogout}>
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
        <button className="flex items-center py-2 px-4 bg-violet-700 text-white hover:bg-violet-900 mt-auto rounded-sm" onClick={onAddTask}>
          <FaPlus className="mr-2" /> Create New Task
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
