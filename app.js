const express = require('express');
const app = express();
require('dotenv').config();

const eventRoutes = require('./routes/eventRoutes');

// Parse incoming JSON requests
app.use(express.json());

// Mount event-related routes
app.use('/events', eventRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
