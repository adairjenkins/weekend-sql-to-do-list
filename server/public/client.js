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
    $('#taskList').on('click', '.deleteBtn', deleteTask);
    $('#taskList').on('click', '.completeBtn', completeTask);
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
    $('#taskList').empty();

    for (task of tasks) {
        let row = $(`
            <tr>
                <td>${task.task}</td>
                <td>${task.priority}</td>
                <td>${task.completion_status}</td>
                <td><input class="completeBtn" type = "button" value = "done!"></td>
                <td><input class="deleteBtn" type = "button" value = "X"></td>
            </tr>
        `);
        row.data('taskData', task);
        $('#taskList').append(row);
        console.log(row.data('taskData'));
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
    let id = $(this).closest('tr').data('taskData').id;
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
    let id = $(this).closest('tr').data('taskData').id;
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