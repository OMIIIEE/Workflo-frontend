'use client'
import React, { useState } from 'react';
import axios from 'axios';

const priorities = ['urgent', 'medium', 'low'];
const statuses = ['to-do', 'in-progress', 'under review', 'completed'];

interface AddTaskFormProps {
  onClose: () => void;
  defaultStatus?: string | null;
  onTaskAdded: () => void; 
  show: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onClose, defaultStatus, onTaskAdded ,show }) => {
  const [title, setTitle] = useState('');
  const [des, setDescription] = useState('');
  const [priority, setPriority] = useState(priorities[0]);
  const [status, setStatus] = useState(defaultStatus || statuses[0]);
  const [deadline, setDeadline] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.post(
        'http://localhost:5000/api/tasks',
        {
          title,
          des,
          priority,
          status,
          deadline,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onTaskAdded(); 
      onClose();
    } catch (error: any) {
      setError(error.message || "Error adding task");
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 bg-gray-800 bg-opacity-50 flex items-center justify-end transition-transform w-full `}>
      <div className={`bg-white p-6 rounded shadow-md w-[40%] h-full pt-24 ${show ? 'animate-slide-in' : 'animate-slide-out'}`}>
        <h2 className="text-2xl font-semibold mb-4">Add New Task</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded p-2 h-[4rem]"
              placeholder='Add Title'
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={des}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2"
              rows={4}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded p-2 "
              required
            >
              {priorities.map((prio) => (
                <option key={prio} value={prio} className="text-black hover:text-pink-300 ">{prio}</option>
              ))}
            </select>
          </div>
          {!defaultStatus && (
            <div className="mb-4">
              <label className="block text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded p-2"
                required
              >
                {statuses.map((stat) => (
                  <option key={stat} value={stat}>{stat}</option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-2"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
