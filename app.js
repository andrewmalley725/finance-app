const express = require('express');

const cors = require('cors');

const path = require('path');

const app = express();

const apiRouter = require('./api/routers/api.router');

app.use(cors());

//app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(express.urlencoded());

app.use('/api', apiRouter)

module.exports = app;
