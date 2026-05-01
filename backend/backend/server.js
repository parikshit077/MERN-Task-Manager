const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connecting to the database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.log("❌ Connection Error:", err));

const Task = require('./models/Task');

// 1. GET: Fetch all tasks from MongoDB
app.get('/api/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

// 2. POST: Create a new task
app.post('/api/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

// --- NEW UPDATED ROUTES BELOW ---

// 3. PATCH: Toggle the "completed" status of a task
// We use :id to target the specific task you clicked in the browser
app.patch('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        task.completed = !task.completed; // If it was false, make it true. If true, make it false.
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: "Could not update task" });
    }
});

// 4. DELETE: Remove a task from the database
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Could not delete task" });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));