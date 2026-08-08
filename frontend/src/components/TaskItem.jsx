import React, { useState } from 'react';

const TaskItem = ({ task, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
  });

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = () => {
    onUpdateTask(task._id, editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const getStatusClass = (status) => {
    return `status-${status}`;
  };

  // Calculate if task due date has passed (Overdue)
  const isOverdue = task.dueDate && 
                    task.status !== 'completed' && 
                    new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  const handleToggleComplete = () => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    onUpdateTask(task._id, {
      ...task,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: newStatus
    });
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="task-edit-form">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleChange}
            className="edit-input"
            placeholder="Task title"
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
            className="edit-textarea"
            placeholder="Description"
            rows="2"
          />
          <div className="edit-selects">
            <select name="status" value={editData.status} onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select name="priority" value={editData.priority} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={editData.dueDate}
              onChange={handleChange}
            />
          </div>
          <div className="edit-actions">
            <button onClick={handleUpdate} className="btn btn-save">Save</button>
            <button onClick={handleCancel} className="btn btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${getStatusClass(task.status)} ${isOverdue ? 'is-overdue' : ''}`}>
      <div className="task-header">
        <div className="task-title-group">
          <button 
            onClick={handleToggleComplete}
            className={`btn-check-toggle ${task.status === 'completed' ? 'checked' : ''}`}
            title={task.status === 'completed' ? "Mark as Pending" : "Mark as Completed"}
          >
            {task.status === 'completed' ? '✓' : ''}
          </button>
          <h3 className={`task-title ${task.status === 'completed' ? 'completed-text' : ''}`}>
            {task.title}
          </h3>
        </div>

        <div className="task-badges">
          {isOverdue && (
            <span className="priority-badge overdue-badge" title="Task deadline has passed!">
              ⚠️ Overdue
            </span>
          )}
          <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>
      
      {task.description && (
        <p className={`task-description ${task.status === 'completed' ? 'completed-text' : ''}`}>
          {task.description}
        </p>
      )}
      
      <div className="task-meta">
        <span className={`status-badge ${getStatusClass(task.status)}`}>
          {task.status === 'completed' ? '✅ Completed' : task.status.replace('-', ' ')}
        </span>
        <span className={`due-date ${isOverdue ? 'overdue-date-text' : ''}`}>
          📅 {formatDate(task.dueDate)}
        </span>
      </div>
      
      <div className="task-actions">
        <button 
          onClick={handleToggleComplete} 
          className={`btn ${task.status === 'completed' ? 'btn-reopen' : 'btn-complete'}`}
        >
          {task.status === 'completed' ? '↺ Reopen' : '✓ Complete'}
        </button>
        <button 
          onClick={() => setIsEditing(true)} 
          className="btn btn-edit"
        >
          Edit
        </button>
        <button 
          onClick={() => onDeleteTask(task._id)} 
          className="btn btn-delete"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
