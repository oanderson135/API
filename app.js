const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const db = new sqlite3.Database('./users.db');

app.use(express.json());

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, age INTEGER NOT NULL)');


app.post('/api/user', (req, res) => {
  const { name, age } = req.body;
  if (!name || !age) return res.status(404).json({ error: 'Name and age are required' });

  db.run('INSERT INTO users (name, age) VALUES (?, ?)', [name, age], function (err) {
    if (err) return res.status(404).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, age });
  });
});


app.get('/api/user', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) return res.status(404).json({ error: err.message });
    res.json(rows);
  });
});


app.put('/api/user/:id', (req, res) => {
  const { name, age } = req.body;
  const { id } = req.params;

  if (!name || !age) return res.status(404).json({ error: 'Name and age are required' });

  db.run('UPDATE users SET name = ?, age = ? WHERE id = ?', [name, age, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes == 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated successfully' });
  });
});


app.delete('/api/user/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) return res.status(404).json({ error: err.message });
    if (this.changes == 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  });
});


app.listen(3000, () => console.log('Server running on http://localhost:3000'));

