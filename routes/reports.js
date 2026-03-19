// routes/suppliers.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/customer-ledger?customer_id=1&from=2026-01-01&to=2026-12-31

router.post('/customer-ledger', auth, async (req, res) => {
  try {
      const { customer_id, from, to } = req.body;
     const [rows] = await pool.query(
    'CALL sm_customer_ledger_report(?,?,?)',
    [customer_id, from || null, to || null]
  );

    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;