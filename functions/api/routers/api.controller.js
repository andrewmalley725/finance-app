const knex = require('../models/dbConnect');
const { hashPass } = require('../function/hashPass');

function test(req, res){
    res.send('Hello World');
}

function addUser(req, res){
    const newUser = {
        username: req.body.userName,
        firstname: req.body.first,
        lastname: req.body.last,
        password: hashPass(req.body.pass),
        email: req.body.email,
        balance: req.body.balance || 0
    }

    knex('person')
    .insert(newUser)
    .then(() => {
        res.json({reponse: `Added new user ${newUser.username}`});
    });
}

function getUsers(req, res){
    knex.select().from('person').then((response) => {
        res.json(response);
    });
}

function newAccount(req, res){
    const data = {
        userid: req.body.userid,
        account_name: req.body.name,
        weight: req.body.weight || 0.0,
        balance: req.body.balance || 0.0
    }

    knex('account')
    .insert(data)
    .then(() => {
        res.json({response: `Added account ${data.account_name}`});
    });
}

async function getAccounts(req, res){
    const user = await knex.select().from('person').where('userid', req.params.uid).first();
    knex.select().from('account').where('userid', req.params.uid).then((response) => {
        res.json({user: `${user.firstname} ${user.lastname}`, total_balance: user.balance, accounts: response});
    });
}

async function postTransaction(req, res){
    let date = new Date();
    date = date.toISOString().slice(0, 19).replace('T', ' ');
    const data = {
        userid: req.body.userid,
        accountid: req.body.accountid,
        amount: req.body.amount,
        date: date
    }
    knex('account')
    .where('accountid', req.body.accountid)
    .select('balance')
    .then((response) => {
        const newSum = response[0].balance -= req.body.amount;
        return knex('account').where('accountid', req.body.accountid).update('balance', newSum);
    })
    .then(() => {
        knex('person')
        .select('balance')
        .where('userid', req.body.userid)
        .then((response) => {
            const newSum = response[0].balance -= req.body.amount;
            return knex('person').where('userid', req.body.userid).update('balance', newSum);
        })
    })
    .then(() => {
        knex('transaction')
        .insert(data)
        .then(() => {
            res.json({
                response: `Added transaction of ${data.amount} to account #${data.accountid}`, 
            });
        });
    });
}

async function getTransactionsByUser(req, res){
    const userid = req.params.uid;
    const user = await knex.select().from('person').where('userid', userid).first();
    const transactions = await knex.select().from('transaction').where('userid', userid);
    res.json({
        user: user.firstname + ' ' + user.lastname,
        transactions: transactions
    });
}

async function getTransactionsByAccount(req, res){
    const accountid = req.params.acid;
    const account = await knex.select().from('account').where('accountid', accountid).first();
    const user = await knex.select().from('person').where('userid', account.userid).first();
    const transactions = await knex.select().from('transaction').where('accountid', accountid);
    res.json({
        user: `${user.firstname} ${user.lastname}`,
        account: account,
        transactions: transactions
    });
}

async function payDay(req, res){
    const userid = req.body.userid;
    const value = req.body.amount;
    const accounts = await knex.select().from('account').where('userid', userid);
    let date = new Date();
    date = date.toISOString().slice(0, 19).replace('T', ' ');
    const data = {
        userid: userid,
        amount: value,
        date: date
    }
    knex('paycheck')
    .insert(data)
    .then(() => {
        for (let i of accounts){
            knex('account')
            .select('balance')
            .where('accountid', i.accountid)
            .then(acc => {
                const newSum = acc[0].balance += (value * i.weight);
                return knex('account').where('accountid', i.accountid).update('balance', newSum)
            });
        }
    })
    .then(() => {
        knex('person')
        .select('balance')
        .where('userid', userid)
        .then((response) => {
            const newSum = response[0].balance += value;
            return knex('person').where('userid', userid).update('balance', newSum);
        });
    })
    .then(() => {
        res.json('Recorded payday');
    })
}

async function getPaychecks(req, res){
    let total = 0;
    const userid = req.params.uid;
    const user = await knex.select().from('person').where('userid', userid).first();
    knex.select().from('paycheck').where('userid', userid).then((response) => {
        res.json({
            user: `${user.firstname} ${user.lastname}`,
            total_balance: user.balance,
            paychecks: response
        });
    });
}

module.exports = {
    addUser,
    getUsers,
    newAccount,
    getAccounts,
    postTransaction,
    getTransactionsByUser,
    getTransactionsByAccount,
    payDay,
    getPaychecks,
    test
}