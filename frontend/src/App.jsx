import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Register from './components/Register';
import AuthContext from './context/AuthContext';
import ThemeContext from './context/ThemeContext';
import { getTasks, createTask, updateTask, deleteTask } from './api/taskApi';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTitle, setVoiceTitle] = useState('');
  const [voiceError, setVoiceError] = useState('');

  const recognitionRef = useRef(null);

  const { user, logout, loading: authLoading } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Format current date
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short'
  });

  // Fetch tasks on component mount when user is logged in
  useEffect(() => {
    if (user) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([newTask, ...tasks]);
      setError(null);
      setIsFormOpen(false);
      setVoiceTitle('');
    } catch (err) {
      setError('Failed to create task.');
      console.error('Error creating task:', err);
    }
  };

  const handleUpdateTask = async (id, taskData) => {
    try {
      const updatedTask = await updateTask(id, taskData);
      setTasks(tasks.map(task => task._id === id ? updatedTask : task));
      setError(null);
    } catch (err) {
      setError('Failed to update task.');
      console.error('Error updating task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(task => task._id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete task.');
        console.error('Error deleting task:', err);
      }
    }
  };

  // ─── Voice Recognition (Live / Real-time) ───────────────────────────────
  const startVoiceRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError('❌ Voice recognition not supported. Please use Chrome or Edge.');
      setTimeout(() => setVoiceError(''), 4000);
      return;
    }

    // If already listening, stop it
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';        // English
    recognition.interimResults = true;  // ← Live text as you speak
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    // Open form right away so user sees live typing
    setIsFormOpen(true);
    setVoiceTitle('');
    setVoiceError('');
    setIsListening(true);

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interimText += transcript;
        }
      }

      // Show interim (live) text while speaking, finalize when done
      setVoiceTitle(finalText || interimText);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      recognitionRef.current = null;
      if (event.error === 'not-allowed') {
        setVoiceError('🎙️ Microphone access denied. Please allow mic permissions and reload.');
      } else if (event.error === 'no-speech') {
        setVoiceError('🔇 No speech detected. Please try again.');
      } else {
        setVoiceError('❌ Voice error: ' + event.error);
      }
      setTimeout(() => setVoiceError(''), 5000);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  }, []);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="app">
        <div className="loading" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/register if not authenticated
  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  // Show task tracker if authenticated
  return (
    <div className="app">
      <header className="app-header-card">
        <div className="user-profile-header">
          <div className="user-info">
            <h1 className="user-greeting">Hi, {user.name}</h1>
            <p className="header-date">{currentDateFormatted}</p>
          </div>
          <div className="user-actions">
            <div className="user-avatar" title={user.name}>
              {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <button onClick={toggleTheme} className="btn btn-theme" title="Toggle Theme">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={logout} className="btn btn-logout" title="Logout">
              Logout
            </button>
          </div>
        </div>

        <div className="header-divider"></div>

        <div className="my-task-title-row">
          <h2 className="my-task-heading">My Task</h2>
          <div className="header-btn-group">
            {/* Mic Button */}
            <button
              className={`btn-mic-circle ${isListening ? 'listening' : ''}`}
              onClick={startVoiceRecognition}
              title={isListening ? 'Click to stop listening' : 'Speak to add a task'}
              aria-label="Add Task by Voice"
            >
              {isListening ? (
                <span className="mic-wave-bars">
                  <span></span><span></span><span></span><span></span>
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V21h2v-3.07A7 7 0 0 0 19 11h-2z"/>
                </svg>
              )}
            </button>

            {/* + Button */}
            <button
              className={`btn-add-circle ${isFormOpen ? 'active' : ''}`}
              onClick={() => {
                setVoiceTitle('');
                setIsFormOpen(!isFormOpen);
              }}
              title={isFormOpen ? 'Close Add Task Form' : 'Add Task'}
              aria-label="Add Task"
            >
              <span className="plus-symbol">+</span>
            </button>
          </div>
        </div>

        {/* Live listening indicator inside header */}
        {isListening && (
          <div className="voice-status-bar">
            <span className="voice-status-dot"></span>
            <span className="voice-status-text">
              {voiceTitle
                ? <><strong>"{voiceTitle}"</strong> — keep speaking...</>
                : 'Listening... say your task 🎙️'}
            </span>
          </div>
        )}
      </header>

      <main className="app-main">
        <div className="container">
          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          {voiceError && (
            <div className="error-message voice-error-msg">
              <span>{voiceError}</span>
              <button onClick={() => setVoiceError('')}>✕</button>
            </div>
          )}

          {isFormOpen && (
            <div className="task-form-expandable">
              <TaskForm
                onAddTask={handleAddTask}
                onClose={() => {
                  setIsFormOpen(false);
                  setVoiceTitle('');
                  if (recognitionRef.current) {
                    recognitionRef.current.stop();
                  }
                }}
                initialTitle={voiceTitle}
                isVoiceActive={isListening}
              />
            </div>
          )}

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading tasks...</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Task Tracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
