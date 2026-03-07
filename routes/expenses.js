// routes/expenses.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// CREATE expense
router.post('/', auth, async (req, res) => {
  const { title, amount, date, description } = req.body;
  try {
    await pool.query(`CALL sm_expenses_crud('CREATE', NULL, ?, ?, ?, ?)`, [title, amount, date, description]);
    res.json({ message: 'Expense created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all expenses
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`CALL sm_expenses_crud('READ', NULL, NULL, NULL, NULL, NULL)`);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE expense
router.get('/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(`CALL sm_expenses_crud('READONE', ?, NULL, NULL, NULL, NULL)`, [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE expense
router.put('/:id', auth, async (req, res) => {
  const id = req.params.id;
  const { title, amount, date, description } = req.body;
  try {
    await pool.query(`CALL sm_expenses_crud('UPDATE', ?, ?, ?, ?, ?)`, [id, title, amount, date, description]);
    res.json({ message: 'Expense updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE expense
router.delete('/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(`CALL sm_expenses_crud('DELETE', ?, NULL, NULL, NULL, NULL)`, [id]);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;