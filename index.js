const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Root Path: This is from root index.js');
});

module.exports = app;