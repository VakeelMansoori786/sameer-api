// routes/sales.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// CREATE sale
router.post('/create', auth, async (req, res) => {
  const { customer_id, total, discount, vat, grand_total, sale_date, items,status } = req.body;

  try {
    const [rows] = await pool.query(
      `CALL sm_sales_crud(?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        'CREATE',              // p_action
        null,                  // p_id
        customer_id,           // p_customer_id
        total,                 // p_total
        discount,              // p_discount
        vat,                   // p_vat
        grand_total,           // p_grand_total
        sale_date,             // p_sale_date
        JSON.stringify(items) , // p_items (IMPORTANT)
        status // p_items (IMPORTANT)
      ]
    );

    res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// READ all sales
router.get('/read', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(`CALL sm_sales_crud('READ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE sale
router.get('/get/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(`CALL sm_sales_crud('READONE', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`, [id]);
      res.json({sale:rows[0],sale_detail:rows[1]});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE sale
router.put('/update', auth, async (req, res) => {
    const { id, customer_id, total, discount, vat, grand_total, sale_date, items,status } = req.body;

  try {
    //await pool.query(`CALL sm_sales_crud('UPDATE',?, ?, ?, ?, ?, ?,?,?,?)`, [id,customer_id, total, discount,vat,grand_total, sale_date,items]);
      await pool.query(
      `CALL sm_sales_crud(?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
      [
        'UPDATE',              // p_action
        id,                  // p_id
        customer_id,           // p_customer_id
        total,                 // p_total
        discount,              // p_discount
        vat,                   // p_vat
        grand_total,           // p_grand_total
        sale_date,             // p_sale_date
        JSON.stringify(items)  , // p_items (IMPORTANT)
        status // p_items (IMPORTANT)
      ]
    );
    res.json({ message: 'sale updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE sale
router.delete('/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(`CALL sm_sales_crud('DELETE', ?, NULL, NULL, NULL, NULL, NULL, NULL,NULL,NULL)`, [id]);
    res.json({ message: 'sale deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.get('/unpaid/:customer_id', auth, async (req, res) => {
  const customer_id = req.params.customer_id;

  try {
    const [rows] = await pool.query(
      `SELECT
id,
invoice_no,
sale_date,
grand_total,
balance_amount
FROM sm_sales
WHERE customer_id=? 
AND balance_amount > 0
AND (status='Invoice' or status='Delivery')
ORDER BY sale_date;`,
      [customer_id]
    );

    res.json(rows);   // ✅ return full array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;