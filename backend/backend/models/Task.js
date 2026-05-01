const mongoose = require('mongoose');

// This defines the structure of your data in MongoDB
const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    completed: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true }); // This automatically adds 'createdAt' and 'updatedAt'

module.exports = mongoose.model('Task', TaskSchema);