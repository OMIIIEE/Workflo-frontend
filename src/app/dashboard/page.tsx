'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import TaskColumn from './TaskColumn';
import AddTaskForm from './AddTaskForm';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Dashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddTaskForm, setShowAddTaskForm] = useState<boolean>(false);
  const [defaultStatus, setDefaultStatus] = useState<string | null>(null);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleAddTask = (status: string | null = null) => {
    setDefaultStatus(status);
    setShowAddTaskForm(true);
  };

  const handleCloseForm = () => {
    setShowAddTaskForm(false);
    setDefaultStatus(null);
  };

  const handleTaskAdded = () => {
    fetchUserAndTasks();
    handleCloseForm();
  };

  const handleTaskDeleted = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
  };

  const handleTaskUpdated = (updatedTask: any) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task._id === updatedTask._id ? updatedTask : task
      )
    );
  };

  const fetchUserAndTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const userRes = await axios.get(
        `http://localhost:5000/api/auth/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(userRes.data.user);

      const tasksRes = await axios.get(
        `http://localhost:5000/api/tasks/user`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTasks(tasksRes.data);
      setLoading(false);
    } catch (error: any) {
      setError(error.message || "Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndTasks();
  }, []);

  const moveTask = async (taskId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const updatedTask = tasks.find(task => task._id === taskId);
      if (updatedTask) {
        updatedTask.status = newStatus;

        await axios.put(`http://localhost:5000/api/tasks/${updatedTask._id}`, updatedTask, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(prevTasks =>
          prevTasks.map(task =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const taskCategories = {
    'To-Do': tasks.filter(task => task.status === 'to-do'),
    'In-Progress': tasks.filter(task => task.status === 'in-progress'),
    'Under Review': tasks.filter(task => task.status === 'under review'),
    'Completed': tasks.filter(task => task.status === 'completed'),
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex">
        <Sidebar user={user} onAddTask={() => handleAddTask(null)} />
        <div className="flex-grow">
          <div className="p-4">
            <h1 className="text-3xl">
              {getGreeting()}, {user ? user.username : 'User'}!
            </h1>
            <Navbar onAddTask={() => handleAddTask(null)} />
            <div className="flex gap-4 mt-6 bg-white p-4 rounded-lg">
              {Object.entries(taskCategories).map(([category, tasks]) => (
                <TaskColumn
                  key={category}
                  title={category}
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onDelete={handleTaskDeleted}
                  onUpdate={handleTaskUpdated}
                  moveTask={moveTask}
                />
              ))}
            </div>
          </div>
          {showAddTaskForm && (
            <AddTaskForm
              onClose={handleCloseForm}
              defaultStatus={defaultStatus}
              onTaskAdded={handleTaskAdded}
              show={showAddTaskForm}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default Dashboard;
