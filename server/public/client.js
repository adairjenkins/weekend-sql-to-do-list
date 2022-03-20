console.log('js');

$(handleReady);

function handleReady() {
    console.log('jQuery');

    refreshTasks();
    addClickHandlers();
};

function addClickHandlers() {
    console.log('addClickHandlers func');
    $('#addBtn').on('click', addTask);
    $('#incompleteTasks').on('click', '.deleteBtn', deleteTask);
    $('#incompleteTasks').on('click', '.checkBtn', completeTask);
}

function refreshTasks() {
    console.log('refreshTasks func');
    $.ajax({
        type: 'GET',
        url: '/to-do-list'
      }).then(function(response) {
        console.log(response);
        renderTasks(response);
      }).catch(function(error){
        console.log('error in GET', error);
      });
}

function renderTasks(tasks) {
    console.log('renderTasks func');
    $('#incompleteTasks').empty();
    $('#completedTasks').empty();    

    for (task of tasks) {
        let row;
        if (!task.completion_status) {
            row = $(`
                <li data-test="testMe">${task.task}
                    ${task.priority}
                    ${task.completion_status}
                    <button class="checkBtn">&#10003;</button> 
                    <button class="deleteBtn">&#10005;</button>
                </li>
            `);
            row.data('taskData', task);
            $('#incompleteTasks').append(row);
        } 
        else if (task.completion_status) {
            row = $(`
                <li>${task.task}
                    (${task.completion_status})
                    <span class="timeCompleted">completed:</span>
                </li>
            `);
            row.data('taskData', task);
            $('#completedTasks').append(row);
        }
        console.log('data:', row.data('taskData'));
        console.log('row.data priority:', row.data('taskData').priority);
        console.log('row.data test:', $('li').data('test'));
    }
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
    let id = $(this).closest('li').data('taskData').id;
    console.log("delete id#:", id);
    $.ajax({
      url: `/to-do-list/${id}`,
      method: 'DELETE'
    }).then(function (response) {
      console.log(`deleted! task #${id}`);
      console.log(response);
      refreshTasks();
    }).catch(function(err) {
      console.log(err);
    })
}

function completeTask() {
    console.log('completeTask func');
    let id = $(this).closest('li').data('taskData').id;
    console.log("mark as completed id#:", id);
  
    $.ajax({
        url: `/to-do-list/${id}`,
        method: 'PUT',
        data: {completion_status: task.completion_status}
    }).then(function (response) { 
        console.log('updated!');
        console.log(response);
        refreshTasks();
    }).catch(function(err) {
        console.log(err);
    })
}