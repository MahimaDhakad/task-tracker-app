import React, { useState } from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onUpdateTask, onDeleteTask }) => {
  const [activeTab, setActiveTab] = useState('Today');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const tabs = [
    { id: 'Recently', label: 'Recently' },
    { id: 'Today', label: 'Today' },
    { id: 'Upcoming', label: 'Upcoming' },
    { id: 'Later', label: 'Later' },
    { id: 'All', label: 'All' }
  ];

  const filteredTasks = tasks.filter(task => {
    // Apply Tab filter
    if (activeTab === 'Today') {
      const todayStr = new Date().toISOString().split('T')[0];
      if (task.dueDate === todayStr) return true;
      if (task.status === 'pending') return true;
    } else if (activeTab === 'Upcoming') {
      if (task.status === 'in-progress') return true;
      if (task.dueDate && new Date(task.dueDate) > new Date()) return true;
    } else if (activeTab === 'Later') {
      if (task.status === 'completed') return true;
    } else if (activeTab === 'Recently') {
      // Show most recent
      return true;
    }

    // Secondary select filter override if not 'all'
    if (filter !== 'all') {
      return task.status === filter;
    }

    return true;
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
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  const getTaskCount = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  return (
    <div className="task-list-container">
      <div className="task-nav-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && <span className="active-dot"></span>}
          </button>
        ))}
      </div>

      <div className="task-list-header">
        <div className="task-stats">
          <span className="stat pending">Pending: {getTaskCount('pending')}</span>
          <span className="stat in-progress">In Progress: {getTaskCount('in-progress')}</span>
          <span className="stat completed">Completed: {getTaskCount('completed')}</span>
        </div>

        <div className="task-controls">
          <div className="control-card filter-card">
            <span className="control-icon">🔍</span>
            <label htmlFor="status-filter" className="control-label">Filter:</label>
            <div className="select-wrapper">
              <select
                id="status-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="styled-select"
              >
                <option value="all">⚡ All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🔄 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>

          <div className="control-card sort-card">
            <span className="control-icon">⇅</span>
            <label htmlFor="sort-by" className="control-label">Sort by:</label>
            <div className="select-wrapper">
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="styled-select"
              >
                <option value="createdAt">📅 Date Created</option>
                <option value="priority">🔥 Priority</option>
                <option value="dueDate">⏰ Due Date</option>
              </select>
              <span className="select-arrow">▼</span>
            </div>
          </div>
        </div>
      </div>

      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found under "{activeTab}". Click "+" to add a new task!</p>
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
