const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const prioritySelect = document.getElementById('priority-select');
const addTaskBtn = document.getElementById('add-task-btn');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const filterSelect = document.getElementById('filter');

// Add Task
addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const priority = prioritySelect.value;

    if (!taskText || !dueDate) {
        alert('Please enter a task and select a due date.');
        return;
    }

    const taskItem = document.createElement('li');
    taskItem.textContent = `${taskText} (Due: ${dueDate}, Priority: ${priority.toUpperCase()})`;
    taskItem.setAttribute('data-priority', priority);
    addTaskControls(taskItem);
    pendingList.appendChild(taskItem);

    taskInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'low';
    saveTasks();
});

// Add Controls to Task
function addTaskControls(taskItem) {
    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete';
    completeBtn.classList.add('complete-btn');
    completeBtn.addEventListener('click', () => {
        taskItem.removeChild(completeBtn);
        completedList.appendChild(taskItem);
        saveTasks();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
        taskItem.remove();
        saveTasks();
    });

    taskItem.appendChild(completeBtn);
    taskItem.appendChild(deleteBtn);
}

// Save Tasks to Local Storage
function saveTasks() {
    const pendingTasks = Array.from(pendingList.children).map(task => ({
        text: task.textContent,
        priority: task.getAttribute('data-priority')
    }));
    const completedTasks = Array.from(completedList.children).map(task => ({
        text: task.textContent,
        priority: task.getAttribute('data-priority')
    }));

    localStorage.setItem('pendingTasks', JSON.stringify(pendingTasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

// Load Tasks from Local Storage
function loadTasks() {
    const savedPendingTasks = JSON.parse(localStorage.getItem('pendingTasks')) || [];
    const savedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

    savedPendingTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.text;
        taskItem.setAttribute('data-priority', task.priority);
        addTaskControls(taskItem);
        pendingList.appendChild(taskItem);
    });

    savedCompletedTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.text;
        taskItem.setAttribute('data-priority', task.priority);
        completedList.appendChild(taskItem);
    });
}

// Filter Tasks
filterSelect.addEventListener('change', () => {
    const filterValue = filterSelect.value;
    const allTasks = Array.from(pendingList.children).concat(Array.from(completedList.children));

    allTasks.forEach(task => {
        switch (filterValue) {
            case 'all':
                task.style.display = '';
                break;
            case 'pending':
                task.style.display = pendingList.contains(task) ? '' : 'none';
                break;
            case 'completed':
                task.style.display = completedList.contains(task) ? '' : 'none';
                break;
        }
    });
});

// Initialize App
document.addEventListener('DOMContentLoaded', loadTasks);
