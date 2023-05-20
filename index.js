const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  // password: 'admin123@',
  database: 'todo'
});

// Test the database connection 
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database!');
    connection.release();
  }
});

// Add a new todo
app.post('/addTodo', (req, res) => {
  const { id, name, status } = req.body;

  const sql = 'INSERT INTO TODOS (ID, NAME, STATUS) VALUES (?, ?, ?)';
  const values = [id, name, status];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error adding todo:', err);
      res.status(500).send('An error occurred');
    } else {
      console.log('Todo added successfully');
      res.status(200).send(results);
    }
  });
});

// Get all todos
app.get('/getTodos', (req, res) => {
  const sql = 'SELECT * FROM TODOS';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error getting todos:', err);
      res.status(500).send('An error occurred');
    } else {
      console.log('Todos retrieved successfully');
      res.status(200).send(results);
    }
  });
});

// Delete a todo
app.post('/deleteTodo', (req, res) => {
  const { id } = req.body;

  const sql = 'DELETE FROM TODOS WHERE id = ?';
  const values = [id];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error deleting todo:', err);
      res.status(500).send('An error occurred');
    } else {
      console.log('Todo deleted successfully');
      res.status(200).send(results);
    }
  });
});

// Update a todo
app.post('/updateTodo', (req, res) => {
  const { id, name, status } = req.body;

  const sql = 'UPDATE TODOS SET name = ?, status = ? WHERE id = ?';
  const values = [name, status, id];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error updating todo:', err);
      res.status(500).send('An error occurred');
    } else {
      console.log('Todo updated successfully');
      res.status(200).send(results);
    }
  });
});

// Start the server
app.listen(4000, () => {
  console.log('Server is listening on port 4000');
});
