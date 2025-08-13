const path = require('path');
const express = require('express');
const cors = require('cors');

const clientsRouter = require('./src/routes/clients');
const fundingRouter = require('./src/routes/funding');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// JSON API
app.use('/clients', clientsRouter);
app.use('/funding-sources', fundingRouter);

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Client Health App listening on :${PORT}`));