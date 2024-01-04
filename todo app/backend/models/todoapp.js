import mongoose from "mongoose";

// Define the Todo schema
const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  
});

// Create the Todo model
const Task = mongoose.model('Todo', TodoSchema);

export { Task};