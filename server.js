const path = require('path');
const express = require('express');
const cors = require('cors');

const routes = require('./src/routes');

const app = express();
app.use(cors());
app.use(express.json());

// Static frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// JSON API
app.use('/', routes);

// Health check
app.get('/health', (_, response) => response.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Client Health App listening on :${PORT}`));