const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Path /a: This is from a/index.js');
});

module.exports = app;