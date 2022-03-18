console.log('js');

$(handleReady);

function handleReady() {
    console.log('jQuery');

    refreshTasks();
    addClickHandlers();
};

function addClickHandlers() {
    console.log('addClickHandlers func');
    $("#addBtn").on('click', addTask);
}

function refreshTasks() {
    console.log('refreshTasks func');
}

function addTask() {
    console.log('addTask func');
    
    const newTask = {
        task: $('#task').val(),
        priority: $('#priority').val(),
    }
    console.log('new task:', newTask);

    saveTask(newTask);
}

// POST new task to server
function saveTask(task) {
    $.ajax({
        type: 'POST',
        url: '/to-do-list',
        data: task,
        }).then(function(response) {
          console.log('Response from server.', response);
          refreshTasks();
        }).catch(function(error) {
          console.log('Error in POST', error)
          alert('Unable to add task at this time. Please try again later.');
        });
}

function deleteTask() {
    console.log('deleteTask func')
}