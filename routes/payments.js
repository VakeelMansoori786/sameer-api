const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');


// CREATE payment
router.post('/create', auth, async (req, res) => {
  const { customer_id, payment_date, payment_method, cheque_number, cheque_date, note, payments, total_received } = req.body;

  try {
    const [rows] = await pool.query(
      `CALL sm_bulk_payments(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // 10 placeholders
      [ 'CREATE', 
        null,              
        customer_id,              
        payment_date,             
        payment_method,           
        cheque_number,            
        cheque_date,              
        note,                     
        JSON.stringify(payments), 
        total_received            
      ]
    );

    res.json({ message: 'Payment done successfully' });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// READ all payments
router.get('/read', auth, async (req, res) => {

  try {

    const [rows] = await pool.query(
      `CALL sm_payments_crud('READ', NULL, NULL, NULL, NULL, NULL, NULL)`
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


// READ ONE payment
router.get('/get/:id', auth, async (req, res) => {

  const id = req.params.id;

  try {

    const [rows] = await pool.query(
      `CALL sm_payments_crud('READONE', ?, NULL, NULL, NULL, NULL, NULL)`,
      [id]
    );

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});


// UPDATE payment
// CREATE BULK PAYMENT
router.post('/update', auth, async (req, res) => {

  const {id, customer_id, payment_date, payment_method, cheque_number, cheque_date, note, payments, total_received } = req.body;

  try {
    const [rows] = await pool.query(
      `CALL sm_bulk_payments(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // 9 placeholders
      [
         'UPDATE', 
         id,          
        customer_id,             
        payment_date,            
        payment_method,          
        cheque_number,           
        cheque_date,             
        note,                    
        JSON.stringify(payments),
        total_received           
      ]
    );

    res.json(rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }

});

// DELETE payment
router.delete('/:id', auth, async (req, res) => {

  const id = req.params.id;

  try {

    await pool.query(
      `CALL sm_payments_crud('DELETE', ?, NULL, NULL, NULL, NULL, NULL)`,
      [id]
    );

    res.json({ message: 'payment deleted' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});




module.exports = router;