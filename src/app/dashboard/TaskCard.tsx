'use client'
import React, { useState, useRef, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import axios from 'axios';

const priorityStyles: { [key: string]: string } = {
  urgent: 'bg-red-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-green-500 text-white',
};

const statusStyles: { [key: string]: string } = {
  'to-do': 'bg-red-500 text-white',
  'in-progress': 'bg-yellow-500 text-white',
  'under review': 'bg-blue-500 text-white',
  'completed': 'bg-green-500 text-white',
};

const statuses = ['to-do', 'in-progress', 'under review', 'completed'];
const priorities = ['urgent', 'medium', 'low'];

const TaskCard = ({ task, onDelete, onUpdate }: { task: {
  _id: string;
  title: string;
  des: string;
  status: string;
  priority: string;
  deadline: string;
  createdAt: string;
}, onDelete: (id: string) => void, onUpdate: (task: any) => void }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState({
    title: task.title,
    des: task.des,
    priority: task.priority,
    deadline: task.deadline,
    status: task.status
  });

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      await axios.delete(`http://localhost:5000/api/tasks/${task._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Task deleted Successfully');
      onDelete(task._id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const updatedTaskWithId = { ...updatedTask, _id: task._id };

      await axios.put(`http://localhost:5000/api/tasks/${task._id}`, updatedTaskWithId, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsEditing(false);
      onUpdate(updatedTaskWithId);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const dragRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      drag(node);
    }
  }, [drag]);

  if (isEditing) {
    return (
      <div ref={dragRef} className={`p-4 rounded shadow-md mb-4 bg-white ${isDragging ? 'opacity-50' : ''}`}>
        <input
          type="text"
          value={updatedTask.title}
          onChange={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <textarea
          value={updatedTask.des}
          onChange={(e) => setUpdatedTask({ ...updatedTask, des: e.target.value })}
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <select
          value={updatedTask.status}
          onChange={(e) => setUpdatedTask({ ...updatedTask, status: e.target.value })}
          className="mb-2 p-2 border border-gray-300 rounded"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          value={updatedTask.priority}
          onChange={(e) => setUpdatedTask({ ...updatedTask, priority: e.target.value })}
          className="mb-2 p-2 border border-gray-300 rounded"
        >
          {priorities.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
        <input
          type="date"
          value={updatedTask.deadline}
          onChange={(e) => setUpdatedTask({ ...updatedTask, deadline: e.target.value })}
          className="mb-2 p-2 border border-gray-300 rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={dragRef} className={`p-4 rounded shadow-md mb-4 bg-white ${isDragging ? 'opacity-50' : ''}`}>
      <h3 className="text-lg font-bold">{task.title}</h3>
      <p className="text-gray-600">{task.des}</p>
      <p className={`inline-block px-2 py-1 rounded ${priorityStyles[task.priority]}`}>{task.priority}</p>
      <p className={`inline-block px-2 py-1 rounded ml-2 ${statusStyles[task.status]}`}>{task.status}</p>
      <p className="text-gray-600">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
      <p className="text-gray-600">Created At: {new Date(task.createdAt).toLocaleDateString()}</p>
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:text-blue-700"
        >
          <FaEdit />
        </button>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
