// routes/products.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// CREATE product
router.post('/create', auth, async (req, res) => {
  const { name, size, category_id, purchase_price, sale_price, stock, unit_id } = req.body;

  try {
    await pool.query(
      `CALL sm_products_crud('CREATE', NULL, ?, ?, ?, ?, ?, ?, ?)`,
      [name, size, category_id, purchase_price, sale_price, stock, unit_id]
    );

    res.json({ message: 'Product created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ all products
router.get('/read', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `CALL sm_products_crud('READ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE product
router.get('/get/:id', auth, async (req, res) => {
  const id = req.params.id;

  try {
    const [rows] = await pool.query(
      `CALL sm_products_crud('READONE', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`,
      [id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE product
router.put('/update', auth, async (req, res) => {
  const { id, name, size, category_id, purchase_price, sale_price, stock, unit_id } = req.body;

  try {
    await pool.query(
      `CALL sm_products_crud('UPDATE', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, size, category_id, purchase_price, sale_price, stock, unit_id]
    );

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE product
router.delete('/delete/:id', auth, async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query(
      `CALL sm_products_crud('DELETE', ?, NULL, NULL, NULL, NULL, NULL, NULL, NULL)`,
      [id]
    );

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH product (for sales)
router.get('/search/:name', auth, async (req, res) => {
  const { name } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT id, name, size, sale_price, stock 
       FROM sm_products 
       WHERE name LIKE CONCAT('%', ?, '%') 
       ORDER BY name ASC
       LIMIT 20`,
      [name]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;