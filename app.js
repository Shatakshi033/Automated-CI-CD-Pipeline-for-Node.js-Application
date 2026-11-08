const express = require("express");

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Temporary task storage
let tasks = [
    { id: 1, title: "Learn Node.js", completed: false },
    { id: 2, title: "Learn Docker", completed: false }
];

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to My Task Management Application!");
});

// Health check API
app.get("/health", (req, res) => {
    res.json({
        status: "UP",
        message: "Application is running successfully!"
    });
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post("/api/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            error: "Task title is required"
        });
    }

    const newTask = {
        id: Date.now(),
        title: title.trim(),
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// Mark a task as completed
app.patch("/api/tasks/:id", (req, res) => {
    const task = tasks.find(t => t.id === Number(req.params.id));

    if (!task) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    task.completed = !task.completed;

    res.json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const taskId = Number(req.params.id);

    const existingTask = tasks.find(t => t.id === taskId);

    if (!existingTask) {
        return res.status(404).json({
            error: "Task not found"
        });
    }

    tasks = tasks.filter(t => t.id !== taskId);

    res.json({
        message: "Task deleted successfully"
    });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});