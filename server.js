require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/suppliers', require('./routes/suppliers'));
app.use('/api/users', require('./routes/users'));
app.use('/api/purchases', require('./routes/purchases'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/setting', require('./routes/setting'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));