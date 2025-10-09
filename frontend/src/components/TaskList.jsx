import React, { useState } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const getTaskCount = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>My Tasks ({tasks.length})</h2>
        <div className="task-stats">
          <span className="stat pending">Pending: {getTaskCount('pending')}</span>
          <span className="stat in-progress">In Progress: {getTaskCount('in-progress')}</span>
          <span className="stat completed">Completed: {getTaskCount('completed')}</span>
        </div>
      </div>

      <div className="task-controls">
        <div className="filter-group">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="sort-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Date Created</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found. Add a new task to get started!</p>
          </div>
        ) : (
          sortedTasks.map(task => (
            <TaskItem
              key={task._id}
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskList;
