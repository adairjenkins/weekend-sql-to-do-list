const express = require('express');
const router = express.Router();
const moment = require('moment');
//const momentRound = require('moment-round');

const pool = require('../modules/pool.js');

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
// adds a new task to the weekend-to-do-list
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
// updates task completion_status
router.put('/:id', (req, res) => {
  let id = req.params.id;
  console.log(`request to update id #`, id);
  console.log('time', moment().format('YYYY-MM-DD HH:mm:ss'));

  queryText = `
      UPDATE "to-do-list"
      SET "completion_status" = true
      WHERE "id" = $1;
      `;

  const values = [id];

  pool.query(queryText, values)
      .then(result => {
        res.sendStatus(200);
    }).catch(err => {
  });
});

// DELETE
// deletes task from database
router.delete('/:id', (req, res) => {
  console.log(`request to delete id #`, req.params.id);
  
  const queryText = `
      DELETE FROM "to-do-list"
      WHERE "id" = $1;
  `;
  const values = [req.params.id];

  pool.query(queryText, values)
      .then( result => {
          res.sendStatus(200);
      }).catch(err => {
          console.log(err);
          res.sendStatus(500);
      })
});

module.exports = router;