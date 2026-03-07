// routes/customers.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// CRUD same as products but replace sm_products_crud → sm_customers_crud
// Example CREATE
router.post('/', auth, async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    await pool.query(`CALL sm_customers_crud('CREATE', NULL, ?, ?, ?, ?)`, [name,email,phone,address]);
    res.json({ message: 'Customer created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Similarly implement READ, READONE, UPDATE, DELETE
module.exports = router;