const path = require('path');
const express = require('express');

const routes = require('./src/routes');

const app = express();
app.use(express.json());

// Use static frontend from /public
app.use(express.static(path.join(__dirname, 'public')));

// Use routes to parse JSON
app.use('/', routes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Client Health App listening on :${PORT}`));