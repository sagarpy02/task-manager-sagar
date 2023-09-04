const taskList = document.getElementById('taskList');
const addTaskButton = document.getElementById('addTaskButton');
const taskPopup = document.getElementById('taskPopup');
const submitTaskButton = document.getElementById('submitTaskButton');
const taskIdInput = document.getElementById('taskId');
const taskNameInput = document.getElementById('taskName');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const statusInput = document.getElementById('status');

let tasks = [ {id: "1", name: "This is demo task", startDate: "01/01/2023", endDate: "04/09/2023", status: "In-Progress"}]; // Array to store tasks
let deletedTaskIds = []; // Array to store deleted task IDs

// Function to add a new task
function addTask() {
    taskPopup.style.display = 'block';
}

// Function to close the task popup
function closeTaskPopup() {
    taskPopup.style.display = 'none';
    // Clear input fields
    taskIdInput.value = '';
    taskNameInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
    statusInput.value = 'In-progress';
}

// Function to validate and add a new task
function submitTask() {
    const taskId = taskIdInput.value.trim();
    const taskName = taskNameInput.value.trim();
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const status = statusInput.value;
    updateTaskButton.style.display = 'none';
    // Check for duplicate task IDs
    if (tasks.some(task => task.id === taskId)) {
        alert('Task ID must be unique.');
        return;
    }
    if (deletedTaskIds.some(task=>task === taskId)) {
        alert('This is delted task id use defferent .');
        return;
    }
    if (startDate > endDate) {
        alert('End Date must be greater than start date');
        return;
    }
    // Create a new task object
    const newTask = {
        id: taskId,
        name: taskName,
        startDate: startDate,
        endDate: endDate,
        status: status
    };

    // Add the task to the tasks array
    tasks.push(newTask);

    // Close the task popup and update the display
    closeTaskPopup();
    displayTasks();
}

// Function to display tasks on the main container
function displayTasks() {
    taskList.innerHTML = ''; // Clear the task list

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
            <h2>${task.id} - ${task.name}</h2>
            <p>Start Date: ${task.startDate}</p>
            <p>End Date: ${task.endDate}</p>
            <p>Status: ${task.status}</p>
            <div class="btn-group">
                <button class="edit-btn" data-task-id="${task.id}">Edit</button>
                <button class="delete-btn" data-task-id="${task.id}">Delete</button>
                <button class="view-btn" data-task-id="${task.id}">View</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    });

    // Add event listeners for edit, delete, and view buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const viewButtons = document.querySelectorAll('.view-btn');

    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const taskId = button.getAttribute('data-task-id');
            editTask(taskId);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const taskId = button.getAttribute('data-task-id');
            deleteTask(taskId);
        });
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const taskId = button.getAttribute('data-task-id');
            viewTask(taskId);
        });
    });
}
// Function to edit a task
function editTask(taskId) {
    const selectedTask = tasks.find(task => task.id === taskId);
    if (!selectedTask) {
        alert('Task not found.');
        return;
    }
    
    // Populate the input fields in the task popup
    taskIdInput.value = selectedTask.id;
    taskNameInput.value = selectedTask.name;
    startDateInput.valueAsDate = selectedTask.startDate;
    endDateInput.valueAsDate = selectedTask.endDate;
    statusInput.value = selectedTask.status;

    // Show the "Update Task" button
    submitTaskButton.style.display = 'none';
    updateTaskButton.style.display = 'block';

    // Add an event listener to update the task
    updateTaskButton.addEventListener('click', function () {
        updateTask(taskId);
    });
    
    // Display the task popup
    taskPopup.style.display = 'block';
}

// Function to update a task
function updateTask(taskId) {
 
    // Find the index of the selected task
    const index = tasks.findIndex(task => task.id === taskId);

    if (index === -1) {
        alert('Task not found.');
        return;
    }
    if (startDate > endDate) {
        alert('End Date must be greater than start date');
        return;
    }
    tasks[index].id = taskIdInput.value.trim();
    // Update the task details based on the input fields
    tasks[index].name = taskNameInput.value.trim();
    tasks[index].startDate = new Date(startDateInput.value);
    tasks[index].endDate = new Date(endDateInput.value);
    tasks[index].status = statusInput.value;
    // Close the task popup
    closeTaskPopup();

    // Update the displayed tasks
    displayTasks();
}
// Function to delete a task
function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        deletedTaskIds.push(taskId); // Store the deleted task ID
        tasks.splice(taskIndex, 1); // Remove the task from the array
        displayTasks();
    }
}

const viewTaskPopup = document.getElementById('viewTaskPopup');
const closeViewTaskPopup = document.getElementById('closeViewTaskPopup');
const viewTaskDetails = document.getElementById('viewTaskDetails');
// Function to view task details including subtasks
function viewTask(taskId) {
    const selectedTask = tasks.find(task => task.id === taskId);
    if (!selectedTask) {
        alert('Task not found.');
        return;
    }

    // Populate the view task details in the popup
    const viewTaskDetails = document.getElementById('viewTaskDetails');
    viewTaskDetails.innerHTML = `
        <p><strong>Task ID:</strong> ${selectedTask.id}</p>
        <p><strong>Task Name:</strong> ${selectedTask.name}</p>
        <p><strong>Start Date:</strong> ${selectedTask.startDate}</p>
        <p><strong>End Date:</strong> ${selectedTask.endDate}</p>
        <p><strong>Status:</strong> ${selectedTask.status}</p>
    `;

    // Display subtasks within the view task popup
    const subtaskList = document.getElementById('subtaskList');
    subtaskList.innerHTML = '';

    if (selectedTask.subtasks && selectedTask.subtasks.length > 0) {
        selectedTask.subtasks.forEach(subtask => {
            const subtaskItem = document.createElement('div');
            subtaskItem.classList.add('subtask-item');
            subtaskItem.innerHTML = `
                <h4>${subtask.id} - ${subtask.name}</h4>
                <p>Start Date: ${subtask.startDate.toDateString()}</p>
                <p>End Date: ${subtask.endDate.toDateString()}</p>
                <p>Status: ${subtask.status}</p>
                <button class="edit-subtask-button" data-subtask-id="${subtask.id}">Edit</button>
                <button class="delete-subtask-button" data-subtask-id="${subtask.id}">Delete</button>
            `;
            subtaskList.appendChild(subtaskItem);

            // Add event listeners for edit and delete subtask buttons
            const editButton = subtaskItem.querySelector('.edit-subtask-button');
            const deleteButton = subtaskItem.querySelector('.delete-subtask-button');

            editButton.addEventListener('click', function () {
                const subtaskId = this.getAttribute('data-subtask-id');
                editSubtask(taskId, subtaskId);
            });

            deleteButton.addEventListener('click', function () {
                const subtaskId = this.getAttribute('data-subtask-id');
                deleteSubtask(parentTaskId, subtaskId);
            });

        });
    } else {
        subtaskList.innerHTML = '<p>No subtasks for this task.</p>';
    }

    // Display the "Add Subtask" button within the view task popup
    const addSubtaskButton = document.getElementById('addSubtaskButton');
    addSubtaskButton.addEventListener('click', function () {
        openAddSubtaskPopup(taskId);
    });

    // Display the view task popup
    const viewTaskPopup = document.getElementById('viewTaskPopup');
    viewTaskPopup.style.display = 'block';
}
// Function to edit a subtask
function editSubtask(parentTaskId, subtaskId) {
    console.log(parentTaskId);
    const selectedTask = tasks.find(task => task.id === parentTaskId);
    if (!selectedTask) {
        alert('Parent task not found.');
        return;
    }

    const subtaskToEdit = selectedTask.subtasks.find(subtask => subtask.id === subtaskId);
    if (!subtaskToEdit) {
        alert('Subtask not found.');
        return;
    }

    // Populate the Edit Subtask popup with subtask data
    subtaskIdInput.value = subtaskToEdit.id;
    subtaskNameInput.value = subtaskToEdit.name;
    subtaskStartDateInput.value = subtaskToEdit.startDate.toISOString().slice(0, 10);
    subtaskEndDateInput.value = subtaskToEdit.endDate.toISOString().slice(0, 10);
    subtaskStatusInput.value = subtaskToEdit.status;

    // Show the Edit Subtask popup
    editSubtaskPopup.style.display = 'block';

    // Function to handle subtask update
    function updateSubtask() {
        clearSubtaskErrors();
        const updatedSubtaskData = validateSubtaskFields();

        if (updatedSubtaskData) {
            // Find the index of the subtask to update
            const subtaskIndex = selectedTask.subtasks.findIndex(subtask => subtask.id === subtaskId);
            
            // Update the subtask data
            selectedTask.subtasks[subtaskIndex] = updatedSubtaskData;

            // Close the Edit Subtask popup
            closeEditSubtaskPopup();

            // Refresh the view task popup to display the updated subtasks
            viewTask(parentTaskId);
        }
    }

    // Add an event listener for updating the subtask
    editSubtaskButton.addEventListener('click', updateSubtask);
}

// Function to delete a subtask
function deleteSubtask(parentTaskId, subtaskId) {
    const selectedTask = tasks.find(task => task.id === parentTaskId);
    if (!selectedTask) {
        alert('Parent task not found.');
        return;
    }

    const subtaskToDeleteIndex = selectedTask.subtasks.findIndex(subtask => subtask.id === subtaskId);
    if (subtaskToDeleteIndex === -1) {
        alert('Subtask not found.');
        return;
    }

    // Remove the subtask from the parent task's subtasks array
    selectedTask.subtasks.splice(subtaskToDeleteIndex, 1);

    // Refresh the view task popup to update the displayed subtasks
    viewTask(parentTaskId);
}

// Function to open the Add Subtask popup
function openAddSubtaskPopup(parentTaskId) {
    // Your code to open and handle the Add Subtask popup here
    // You can use the logic from the previous response for opening the subtask popup
}


// Function to open the Add Subtask popup
const addSubtaskPopup = document.getElementById('addSubtaskPopup');
const closeAddSubtaskPopup = document.getElementById('closeAddSubtaskPopup');
const parentTaskIdInput = document.getElementById('parentTaskId');
const subtaskIdInput = document.getElementById('subtaskId');
const subtaskNameInput = document.getElementById('subtaskName');
const subtaskStartDateInput = document.getElementById('subtaskStartDate');
const subtaskEndDateInput = document.getElementById('subtaskEndDate');
const subtaskStatusInput = document.getElementById('subtaskStatus');
const subtaskErrorMessage = document.getElementById('subtaskErrorMessage');
const submitSubtaskButton = document.getElementById('submitSubtaskButton');

// Function to open the Add Subtask popup
function openAddSubtaskPopup(parentTaskId) {
    clearSubtaskErrors();
    parentTaskIdInput.value = parentTaskId;
    subtaskIdInput.value = '';
    subtaskNameInput.value = '';
    subtaskStartDateInput.value = '';
    subtaskEndDateInput.value = '';
    subtaskStatusInput.value = 'In-progress';

    // Display the Add Subtask popup
    addSubtaskPopup.style.display = 'block';
}


// Function to close the Add Subtask popup
function closeAddSubtaskPopupf() {
    clearSubtaskErrors();
    addSubtaskPopup.style.display = 'none';
}
// Function to clear subtask error messages
function clearSubtaskErrors() {
    subtaskErrorMessage.textContent = '';
    subtaskErrorMessage.style.display = 'none';
}

// Function to display a subtask error message
function displaySubtaskError(message) {
    subtaskErrorMessage.textContent = message;
    subtaskErrorMessage.style.display = 'block';
}

// Function to add a subtask to the parent task
function addSubtaskToParentTask(parentTaskId, subtaskData) {
    const parentTask = tasks.find(task => task.id === parentTaskId);
    if (!parentTask) {
        alert('Parent task not found.');
        return;
    }

    // Ensure subtasks array exists within the parent task object
    if (!parentTask.subtasks) {
        parentTask.subtasks = [];
    }

    // Add the subtask to the parent task's subtasks array
    parentTask.subtasks.push(subtaskData);

    // Close the Add Subtask popup
    closeAddSubtaskPopupf();

    // Refresh the view task popup to display the updated subtasks
    viewTask(parentTaskId);
}// Function to validate subtask input fields
function validateSubtaskFields() {
    const subtaskId = subtaskIdInput.value.trim();
    const subtaskName = subtaskNameInput.value.trim();
    const subtaskStartDate = new Date(subtaskStartDateInput.value);
    const subtaskEndDate = new Date(subtaskEndDateInput.value);
    const subtaskStatus = subtaskStatusInput.value;

    // Check if any of the input fields are empty or invalid
    if (!subtaskId || !subtaskName || isNaN(subtaskStartDate) || isNaN(subtaskEndDate) || subtaskStartDate >= subtaskEndDate) {
        displaySubtaskError('Please enter valid subtask details.');
        return null;
    }

    // Return an object containing the validated subtask data
    return {
        id: subtaskId,
        name: subtaskName,
        startDate: subtaskStartDate,
        endDate: subtaskEndDate,
        status: subtaskStatus,
    };
}

// Event listener for the Add Subtask button
submitSubtaskButton.addEventListener('click', function () {
    const parentTaskId = parentTaskIdInput.value;
    const subtaskData = validateSubtaskFields();

    if (subtaskData) {
        addSubtaskToParentTask(parentTaskId, subtaskData);
    }
});

// Event listener to open the Add Subtask popup
addSubtaskButton.addEventListener('click', function () {
    const parentTaskId = selectedTaskId; // Replace with your logic to get the selected task ID
    openAddSubtaskPopup(parentTaskId);
});



// Close the view task popup when clicking the close button
closeViewTaskPopup.addEventListener('click', function () {
    viewTaskPopup.style.display = 'none';
});


// Event listeners
addTaskButton.addEventListener('click', addTask);
submitTaskButton.addEventListener('click', submitTask);

// Close the task popup when clicking outside of it
window.addEventListener('click', function (event) {
    if (event.target === taskPopup) {
        closeTaskPopup();
    }
});
// Initial display of tasks
displayTasks();
