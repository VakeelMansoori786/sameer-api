// routes/users.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// CREATE user
router.post('/', auth, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    await pool.query(`CALL sm_users_crud('CREATE', NULL, ?, ?, ?, ?)`, [name, email, password, role]);
    res.json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all users
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`CALL sm_users_crud('READ', NULL, NULL, NULL, NULL, NULL)`);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE user
router.get('/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(`CALL sm_users_crud('READONE', ?, NULL, NULL, NULL, NULL)`, [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE user
router.put('/:id', auth, async (req, res) => {
  const id = req.params.id;
  const { name, email, password, role } = req.body;
  try {
    await pool.query(`CALL sm_users_crud('UPDATE', ?, ?, ?, ?, ?)`, [id, name, email, password, role]);
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(`CALL sm_users_crud('DELETE', ?, NULL, NULL, NULL, NULL)`, [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;