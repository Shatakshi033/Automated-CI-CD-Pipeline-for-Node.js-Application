const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const message = document.getElementById("message");

// Fetch and display tasks
async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");
        const tasks = await response.json();

        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");

            if (task.completed) {
                li.classList.add("completed");
            }

            const title = document.createElement("span");
            title.className = "task-title";
            title.textContent = task.title;

            const actions = document.createElement("div");
            actions.className = "task-actions";

            const completeButton = document.createElement("button");
            completeButton.className = "complete-button";
            completeButton.textContent = task.completed ? "Undo" : "Complete";

            completeButton.addEventListener("click", () => {
                updateTask(task.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", () => {
                deleteTask(task.id);
            });

            actions.appendChild(completeButton);
            actions.appendChild(deleteButton);

            li.appendChild(title);
            li.appendChild(actions);

            taskList.appendChild(li);
        });

        totalTasks.textContent = tasks.length;
        completedTasks.textContent =
            tasks.filter(task => task.completed).length;

    } catch (error) {
        message.textContent = "Unable to load tasks.";
        console.error(error);
    }
}

// Add task
async function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        message.textContent = "Please enter a task.";
        return;
    }

    try {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error("Unable to add task");
        }

        taskInput.value = "";
        message.textContent = "";

        await loadTasks();

    } catch (error) {
        message.textContent = error.message;
    }
}

// Update task
async function updateTask(id) {
    await fetch(`/api/tasks/${id}`, {
        method: "PATCH"
    });

    await loadTasks();
}

// Delete task
async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
    });

    await loadTasks();
}

// Button event
addButton.addEventListener("click", addTask);

// Enter key event
taskInput.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Load tasks when page opens
loadTasks();