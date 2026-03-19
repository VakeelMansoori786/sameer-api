const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');


// ================= CREATE EXPENSE =================
router.post('/create', auth, async (req, res) => {
  const { title, category_id, amount, expense_date, description } = req.body;

  try {
    const [rows] = await pool.query(
      `CALL sm_expenses_crud('CREATE', NULL, ?, ?, ?, ?, ?, NULL, NULL)`,
      [title, category_id, amount, expense_date, description]
    );

    res.json({ 
      message: 'Expense created',
      id: rows[0][0].expense_id 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= READ ALL =================
router.post('/read', auth, async (req, res) => {
  try {
      const { from, to } = req.body;
    const [rows] = await pool.query(
      `CALL sm_expenses_crud('READ', NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)`,[from, to]
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= READ ONE =================
router.get('/get/:id', auth, async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await pool.query(
      `CALL sm_expenses_crud('READONE', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`,
      [id]
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE =================
router.put('/update', auth, async (req, res) => {
  const { id, title, category_id, amount, expense_date, description } = req.body;

  try {
    await pool.query(
      `CALL sm_expenses_crud('UPDATE', ?, ?, ?, ?, ?, ?, NULL, NULL)`,
      [id, title, category_id, amount, expense_date, description]
    );

    res.json({ message: 'Expense updated' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= DELETE =================
router.delete('/delete/:id', auth, async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query(
      `CALL sm_expenses_crud('DELETE', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`,
      [id]
    );

    res.json({ message: 'Expense deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= FILTER (DATE RANGE) =================
router.post('/filter', auth, async (req, res) => {
  const { from, to } = req.body;

  try {
    const [rows] = await pool.query(
      `CALL sm_expenses_crud('FILTER', NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)`,
      [from, to]
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= TOTAL =================
router.post('/total', auth, async (req, res) => {
  const { from, to } = req.body;

  try {
    const [rows] = await pool.query(
      `CALL sm_expenses_crud('TOTAL', NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)`,
      [from, to]
    );

    res.json(rows[0][0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= CATEGORY SUMMARY =================
router.post('/summary', auth, async (req, res) => {
  const { from, to } = req.body;

  try {
    const [rows] = await pool.query(
      `CALL sm_expenses_crud('SUMMARY', NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)`,
      [from, to]
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;