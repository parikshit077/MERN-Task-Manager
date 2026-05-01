import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  // 1. Fetch tasks from our Backend when the page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // 2. Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', { title });
      setTasks([...tasks, res.data]);
      setTitle('');
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // 3. NEW: Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      // Update UI by filtering out the deleted task
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // 4. NEW: Toggle completion (Finish task)
  const toggleComplete = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/tasks/${id}`);
      // Update the specific task in our list
      setTasks(tasks.map(task => task._id === id ? res.data : task));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  return (
    <div className="app-container">
      <h1>TaskMaster Pro</h1>
      
      <form onSubmit={addTask} className="input-group">
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter a task (e.g. Finish BCA Viva)..." 
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">
            <div className="task-content">
              <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => toggleComplete(task._id)} 
              />
              <span className={task.completed ? "completed-text" : ""}>
                {task.title}
              </span>
            </div>
            <button 
              onClick={() => deleteTask(task._id)} 
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;