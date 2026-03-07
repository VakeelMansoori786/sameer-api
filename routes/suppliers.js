// routes/suppliers.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// CREATE supplier
router.post('/create', auth, async (req, res) => {
  const { name, email, phone, address,trn } = req.body;
  try {
    await pool.query(`CALL sm_suppliers_crud('CREATE', NULL, ?, ?, ?, ?,?)`, [name, phone, email, address,trn]);
    res.json({ message: 'Supplier created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all suppliers
router.get('/read', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`CALL sm_suppliers_crud('READ', NULL, NULL, NULL, NULL, NULL, NULL)`);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE supplier
router.get('/get/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(`CALL sm_suppliers_crud('READONE', ?, NULL, NULL, NULL, NULL, NULL)`, [id]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE supplier
router.put('/update', auth, async (req, res) => {
  const { id,name, email, phone, address,trn } = req.body;
  try {
    await pool.query(`CALL sm_suppliers_crud('UPDATE', ?, ?, ?, ?, ?, ?)`, [id, name, phone, email, address,trn]);
    res.json({ message: 'Supplier updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE supplier
router.delete('/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(`CALL sm_suppliers_crud('DELETE', ?, NULL, NULL, NULL, NULL, NULL)`, [id]);
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;