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
    $('#incompleteTasks').on('click', '.deleteBtn', areYouSure);
    $('#incompleteTasks').on('click', '.checkBtn', completeTask);
}

// GET request, calls renderTasks when complete
function refreshTasks() {
    console.log('refreshTasks func');
    $.ajax({
        type: 'GET',
        url: '/to-do-list'
      }).then(function(response) {
        renderTasks(response);
      }).catch(function(error){
        console.log('error in GET', error);
      });
}

// renders response from refreshTasks to DOM
function renderTasks(tasks) {
    console.log('renderTasks func');
    // clear DOM
    $('#incompleteTasks').empty();
    $('#completedTasks').empty();    
    // display each task as separate list item
    for (task of tasks) {
        // create a new row for each task and separate incomplete from completed tasks
        // saves task priority to data-priority so that the priority can be accessed in style.css
        let row;
        // incomplete tasks with check and delete buttons
        if (!task.completion_status) {
            row = $(`
                <li data-priority="${task.priority}">
                    ${task.task}
                    <span class="buttons"><button class="checkBtn">&#11096;</button> 
                    <button class="deleteBtn">&#10005;</button></span>
                </li>
            `);
            // assign database categories and values to data-taskData
            row.data('taskData', task);
            // display row on DOM
            $('#incompleteTasks').append(row);
        } 
        // completed tasks with time completed
        else if (task.completion_status) {
            row = $(`
                <li data-priority="${task.priority}">
                    ${task.task}
                    <span class="timeCompleted">completed: ${task.time_completed} </span>
                </li>
            `);
            // assign database categories and values to data-taskData
            row.data('taskData', task);
            // display row on DOM
            $('#completedTasks').append(row);
        }
        console.log('data:', row.data('taskData'));
    }
}

// assigns input to newTask object
// calls saveTask( newTask ) to add newTask to database
function addTask() {
    console.log('addTask func');
    const newTask = {
        task: $('#task').val(),
        priority: $('#priority').val(),
    }
    console.log('new task:', newTask);
    saveTask(newTask);
}

// POST new task to server and save in database
function saveTask(task) {
    $.ajax({
        type: 'POST',
        url: '/to-do-list',
        data: task,
        }).then(function(response) {
          console.log('Response from server.', response);
          // update DOM
          refreshTasks();
        }).catch(function(error) {
          console.log('Error in POST', error)
          alert('Unable to add task at this time. Please try again later.');
        });
}

function areYouSure() {
    let id = $(this).closest('li').data('taskData').id;
    // alert
    swal({
        title: "Are you sure?",
        text: "Your task will be irreversibly deleted. Forever.",
        icon: "warning",
        buttons: [true, 'Delete'],
        dangerMode: true
    }).then( function(clickedDelete) {
            if (clickedDelete) {
            deleteTask(id)
            }
        })  
}     

// DELETEs task from database and calls refreshTasks to update DOM
function deleteTask(id) {
    console.log('deleteTask func')
    // access the task id from taskData
    // let id = $(this).closest('li').data('taskData').id;
    console.log("delete id#:", id);
    // DELETE request - url passes task id to server
    $.ajax({
      url: `/to-do-list/${id}`,
      method: 'DELETE'
    }).then(function (response) {
      console.log(response);
      refreshTasks();
    }).catch(function(err) {
      console.log(err);
    })
}

// PUT request to server - sets completion_status to TRUE and priority to 0
function completeTask() {
    console.log('completeTask func');
    // access the task id from taskData
    let id = $(this).closest('li').data('taskData').id;
    console.log("mark as completed id#:", id);
    // PUT request to server that will set completion_status to TRUE
    $.ajax({
        url: `/to-do-list/${id}`,
        method: 'PUT',
        data: {completion_status: task.completion_status}
    }).then(function (response) { 
        console.log(response);
        refreshTasks();
    }).catch(function(err) {
        console.log(err);
    })
}