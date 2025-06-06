const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json({ extended: false }));

const corsOptions = require('./cors-config');
// Enable CORS with options
app.use(cors(corsOptions));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/reports', require('./routes/reports'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));