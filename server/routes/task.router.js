const express = require('express');
const router = express.Router();

const pool = require('../modules/pool.js');

// DB CONNECTION


// GET
// retrieves to-do-list from database and sends it to client
router.get('/', (req, res) => {
    console.log( 'router GET');
    let queryText = 'SELECT * FROM "to-do-list" ORDER BY ("priority");';
    console.log(queryText);
    pool.query(queryText).then(result => {
      res.send(result.rows);
    })
    .catch(error => {
      console.log('error getting task', error);
      res.sendStatus(500);
    });
  });

// POSTs
// Adds a new task to the weekend-to-do-list
router.post('/',  (req, res) => {
  let newTask = req.body;
  console.log(`adding task`, newTask);
  
  let queryText = `INSERT INTO "to-do-list" ("task", "priority", "completion_status")
                   VALUES ($1, $2, $3);`;
    pool.query(queryText, [newTask.task, Number(newTask.priority), false])
    .then(result => {
         res.sendStatus(201);
       })
       .catch(error => {
         console.log(`Error adding new task`, error);
         res.sendStatus(500);
       });
  });

// PUT
// adds a task from input to the database
router.put('/:id', (req, res) => {
//     // let id = req.params.id;
//     // console.log(req.body, id);

//     // queryText = `
//     //     UPDATE "to-do-list"
//     //     SET "ready_to_transfer" = true
//     //     WHERE "id" = $1;`;

//     // const values = [id];

//     // pool.query(queryText, values)
//     //     .then(result => {
//     //         res.sendStatus(200);
//     //     }).catch(err => {
// 

}); // end delete

module.exports = router;