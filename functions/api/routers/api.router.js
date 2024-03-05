const express = require('express');

const controller = require('./api.controller');

const apiRouter = express.Router();

apiRouter.post('/newUser', controller.addUser);
apiRouter.get('/users', controller.getUsers);
apiRouter.post('/authenticate', controller.authenticate);

apiRouter.post('/newCategory', controller.newAccount);
apiRouter.get('/categories/:uid', controller.getAccounts);
apiRouter.delete('/deleteCategory/:acid', controller.deleteAccount);

apiRouter.post('/newExpense', controller.postTransaction);
apiRouter.get('/userExpenses/:uid', controller.getTransactionsByUser);
apiRouter.get('/accExpenses/:acid', controller.getTransactionsByAccount);

apiRouter.post('/payday', controller.payDay);
apiRouter.get('/paychecks/:uid', controller.getPaychecks);

apiRouter.get('/test', controller.test);

module.exports = apiRouter;