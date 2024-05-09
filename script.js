// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    return `${timestamp}-${randomNum}`
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');

    const titleElement = document.createElement('h3');
    titleElement.textContent = task.title;

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = task.description;

    const deadlineElement = document.createElement('p');
    deadlineElement.textContent = `Deadline: ${task.deadline}`

    taskCard.appendChild(titleElement);
    taskCard.appendChild(descriptionElement);
    taskCard.appendChild(deadlineElement);

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const taskContainer = document.createElement('task-container');
    if (taskContainer) {
        taskContainer.innerHTML = '';
    } else {
        console.error('Task container element not found in DOM')
    }

    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        taskContainer.appendChild(taskCard);
    });

    $('.task-card').draggable({
        revert: 'invalid',
        cursor: 'move',
        containment: 'document',
        zIndex: 1000
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const deadline = document.getElementById('task-deadline').value;

    const taskId = generateTaskId();

    const newTask = {
        id: taskId,
        title: title,
        description: description,
        deadline: deadline
    };

    taskList.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList(taskList);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = event.target.dataset.taskId;
    if (!taskId) {
        return;
    }

    const taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return;
    }

    taskList.splice(taskIndex, 1);

    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList(taskList);
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const droppedTaskCard = ui.draggable[0];
    const taskId = droppedTaskCard.dataset.taskId;

    const taskIndex = taskList.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
        return;
    }

    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList(taskList);
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList(taskList);

    $('#tasks-form').submit(handleAddTask);

    $('#task-container').on('click', '.task-card', handleDeleteTask);

    $('.lane').each(function() {
        $(this).droppable({
            drop: handleDrop
        });
    });

    $('#task-deadline').datepicker({
        changeMonth: true,
        changeYear: true
    });
});
