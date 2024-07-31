import React from 'react';
import TaskCard from './TaskCard';
import { FaPlus } from 'react-icons/fa';
import { useDrop } from 'react-dnd';

interface TaskColumnProps {
  title: string;
  tasks: any[];
  onAddTask: (status: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
  moveTask: (taskId: string, newStatus: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, tasks, onAddTask, onDelete, onUpdate, moveTask }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string }) => {
      moveTask(item.id, title.toLowerCase());
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Use the ref callback function to properly type the drop target
  const dropRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      drop(node);
    }
  }, [drop]);

  return (
    <div ref={dropRef} className={`flex-1 p-4 ${isOver ? 'bg-gray-200' : ''}`}>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {tasks.map(task => (
        <TaskCard
          key={task._id}
          task={task}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
      <button
        onClick={() => onAddTask(title.toLowerCase())}
        className="mt-4 px-4 py-2 bg-gray-700 text-white rounded flex flex-row items-center gap-2"
      >
        Add Task <FaPlus className="ml-2" />
      </button>
    </div>
  );
};

export default TaskColumn;
