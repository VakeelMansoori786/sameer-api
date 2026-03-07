// routes/sales.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Create sale + invoice
router.post('/add-dropdown', async (req, res) => {
  const { table, name } = req.body;
  try {
    await pool.query(`CALL sm_master_crud('INSERT','${table}',NULL,'${name}')`);
    res.json({ message: 'Record saved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/delete-dropdown', async (req, res) => {
  const { table, id } = req.body;
  try {
   await pool.query(`CALL sm_master_crud('DELETE','${table}',${id},NULL)`);
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post('/get-dropdown', async (req, res) => {
  const { table } = req.body;
  try {
   const [rows] =   await pool.query(`CALL sm_master_crud('SELECT','${table}',NULL,NULL)`);
   res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get('/get-all-table', async (req, res) => {
 
  try {
     const [rows] = await pool.query(`CALL sm_master_crud('ALL',NULL,NULL,NULL);`);

     res.json(rows[0]);
  } catch (err) {
    
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;