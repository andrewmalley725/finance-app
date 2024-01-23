const express = require('express');

const cors = require('cors');

const swaggerUi = require('swagger-ui-express');

const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger.yaml');

const apiKeyMiddleware = require('./api/function/apiKeyMiddleware');

const app = express();

const apiRouter = require('./api/routers/api.router');

app.use(cors());

//app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

app.use(express.urlencoded());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(apiKeyMiddleware.apiKeyMiddleware);

app.use('/api', apiRouter);

module.exports = app;
