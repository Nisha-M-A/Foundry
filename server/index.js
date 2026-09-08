require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const healthRoute = require('./routes/health.route');
const authRoute = require('./routes/auth.route');
const projectRoute = require('./routes/project.route');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: ['http://localhost:5174', 'http://localhost:5173', 'https://foundry-rose.vercel.app'] }));
app.use(express.json());

// Routes
app.use('/api/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/project', projectRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
