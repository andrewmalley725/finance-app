const express = require('express');

const controller = require('./api.controller');

const apiRouter = express.Router();

apiRouter.post('/newUser', controller.addUser);
apiRouter.get('/users', controller.getUsers);

apiRouter.post('/newAccount', controller.newAccount);
apiRouter.get('/accounts/:uid', controller.getAccounts);

apiRouter.post('/newTransaction', controller.postTransaction);
apiRouter.get('/userTransactions/:uid', controller.getTransactionsByUser);
apiRouter.get('/AccTransactions/:acid', controller.getTransactionsByAccount);

apiRouter.post('/payday', controller.payDay);
apiRouter.get('/paychecks/:uid', controller.getPaychecks);

apiRouter.get('/test', controller.test);

module.exports = apiRouter;