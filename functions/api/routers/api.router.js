const express = require('express');

const controller = require('./api.controller');

const apiRouter = express.Router();

//     ------USER ROUTES------
/**
 * @swagger
 * /api/newUser:
 *   post:
 *     summary: Add a new user
 *     tags:
 *         - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               first:
 *                 type: string
 *               last:
 *                 type: string
 *               pass:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               userName: example
 *               first: example
 *               last: example
 *               pass: example
 *               email: example
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *         - User
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/authenticate:
 *   post:
 *     summary: Login to user account
 *     tags:
 *         - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               username: example
 *               password: example
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
//     ------ACCOUNT ROUTES------
/**
 * @swagger
 * /api/newAccount:
 *   post:
 *     summary: Add a new money category
 *     tags:
 *         - Accounts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userid:
 *                 type: int
 *               name:
 *                 type: string
 *               weight:
 *                 type: float
 *               balance:
 *                 type: float
 *             example:
 *               userid: 1
 *               name: saviongs
 *               weight: 0.10
 *               balance: 10.50
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/accounts/{uid}:
 *   get:
 *     summary: Get all accounts associated with a user
 *     tags:
 *         - Accounts
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: integer
 *         description: userid
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
apiRouter.post('/newUser', controller.addUser);
apiRouter.get('/users', controller.getUsers);
apiRouter.post('/authenticate', controller.authenticate);

apiRouter.post('/newAccount', controller.newAccount);
apiRouter.get('/accounts/:uid', controller.getAccounts);

apiRouter.post('/newTransaction', controller.postTransaction);
apiRouter.get('/userTransactions/:uid', controller.getTransactionsByUser);
apiRouter.get('/AccTransactions/:acid', controller.getTransactionsByAccount);

apiRouter.post('/payday', controller.payDay);
apiRouter.get('/paychecks/:uid', controller.getPaychecks);

apiRouter.get('/test', controller.test);

module.exports = apiRouter;