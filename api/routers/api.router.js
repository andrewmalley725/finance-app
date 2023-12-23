const express = require('express');

const controller = require('./api.controller');

const apiRouter = express.Router();

apiRouter.post('/newUser', controller.addUser);
apiRouter.get('/users', controller.getUsers);

apiRouter.post('/newAccount', controller.newAccount);
apiRouter.get('/accounts/:uid', controller.getAccounts);

apiRouter.post('/newTransaction', controller.postTransaction);
apiRouter.get('/transactions/:uid', controller.getTransactions);

module.exports = apiRouter;