// routes/purchase.js

const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');


// CREATE purchase
router.post('/create', auth, async (req, res) => {

  const { supplier_id, total, discount, vat, grand_total, purchase_date, items, status } = req.body;

  try {

    const [rows] = await pool.query(
      `CALL sm_purchases_crud(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'CREATE',               // p_action
        null,                   // p_id
        supplier_id,            // p_supplier_id
        total,                  // p_total
        discount,               // p_discount
        vat,                    // p_vat
        grand_total,            // p_grand_total
        purchase_date,          // p_purchase_date
        status,
        JSON.stringify(items)
      ]
    );

    res.json(rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }

});


// READ all purchases
router.get('/read', auth, async (req, res) => {

  try {

    const [rows] = await pool.query(
      `CALL sm_purchases_crud('READ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


// READ ONE purchase
router.get('/get/:id', auth, async (req, res) => {

  const id = req.params.id;

  try {

    const [rows] = await pool.query(
      `CALL sm_purchases_crud('READONE', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`,
      [id]
    );

    res.json({
      purchase: rows[0],
      purchase_detail: rows[1]
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


// UPDATE purchase
router.put('/update', auth, async (req, res) => {

  const { id, supplier_id, total, discount, vat, grand_total, purchase_date, items, status } = req.body;

  try {

    await pool.query(
      `CALL sm_purchases_crud(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'UPDATE',
        id,
        supplier_id,
        total,
        discount,
        vat,
        grand_total,
        purchase_date,
        status,
        JSON.stringify(items)
      ]
    );

    res.json({ message: 'purchase updated' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


// DELETE purchase
router.delete('/:id', auth, async (req, res) => {

  const id = req.params.id;

  try {

    await pool.query(
      `CALL sm_purchases_crud('DELETE', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`,
      [id]
    );

    res.json({ message: 'purchase deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


module.exports = router;