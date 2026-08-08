import React, { useState, useEffect } from 'react';

const TaskForm = ({ onAddTask, onClose, initialTitle = '', isVoiceActive = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });

  // Sync live voice text into title field in real-time
  useEffect(() => {
    setFormData(prev => ({ ...prev, title: initialTitle }));
  }, [initialTitle]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onAddTask(formData);
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: ''
      });
      if (onClose) onClose();
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>✨ Add New Task</h2>
        {onClose && (
          <button type="button" className="btn-close-form" onClick={onClose} title="Close">
            ✕
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group title-input-group">
          <label htmlFor="title">
            Task Title *
            {isVoiceActive && (
              <span className="voice-label-badge">🎙️ Live</span>
            )}
          </label>
          <div className={`title-input-wrapper ${isVoiceActive ? 'voice-active' : ''}`}>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder={isVoiceActive ? 'Speak your task title...' : 'Enter task title...'}
              required
              autoFocus
            />
            {isVoiceActive && (
              <span className="voice-cursor-blink" aria-hidden="true">|</span>
            )}
            {!isVoiceActive && formData.title && (
              <span className="voice-filled-badge" title="Filled by voice">🎙️</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Text Area)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write task details here..."
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            + Add Task
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="btn btn-cancel">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
