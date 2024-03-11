const knex = require('../models/dbConnect');
const { hashPass } = require('../function/hashPass');
require('dotenv').config();


function test(req, res){
    res.send('Hello World');
}

async function addUser(req, res){
    const newUser = {
        username: req.body.userName.toLowerCase(),
        firstname: req.body.first,
        lastname: req.body.last,
        password: hashPass(req.body.pass),
        email: req.body.email,
        balance: 0
    }

    knex('person')
    .insert(newUser)
    .then(async () => {
        const user = await knex.select().from('person').where('username', newUser.username).first();
        const unallocated = {
            userid: user.userid,
            account_name: 'Unallocated funds',
            weight: 1.0,
            balance: 0
        }
        knex('account').insert(unallocated).then(() => {
            res.json({status: `Added new user ${newUser.username}`, record: user, apiKey: process.env.API_KEY});
        }
        );
    });
}

async function authenticate(req, res){
    const data = {
        username: req.body.username.toLowerCase(),
        password: req.body.password
    }
    let status;
    let record;
    let apiKey;
    const user = await knex.select().from('person').where('username', data.username).first();
    if (user){
        if (hashPass(data.password) === user.password){
            status = 'success';
            record = user;
            apiKey = process.env.API_KEY;
        }
        else{
            status = 'please enter a valid password';
        }
    }
    else{
        status = 'please enter valid credentials';
    }

    res.json({
        status: status,
        record: record,
        apiKey: apiKey
    })
}

function getUsers(req, res){
    knex.select().from('person').then((response) => {
        res.json(response);
    });
}

async function newAccount(req, res){
    const user = await knex.select().from('person').where('userid', req.body.userid).first();
    const data = {
        userid: user.userid,
        account_name: req.body.name,
        weight: req.body.weight || 0.0,
        balance: req.body.balance || req.body.weight * user.balance
    }
    knex('account')
    .insert(data)
    .then(() => {
        knex('account')
        .where('account_name', 'Unallocated funds').where('userid', data.userid)
        .select('weight', 'balance')
        .then((response) => {
            const newWeight = response[0].weight -= data.weight;
            const newBalance = user.balance *= newWeight;
            knex('account').where('account_name', 'Unallocated funds').where('userid', data.userid)
            .update({
                weight: newWeight,
                balance: newBalance
            }).then(() => {
                res.json({response: `Added account ${data.account_name}`});
            })
        })
    });
}

async function getAccounts(req, res){
    const user = await knex.select().from('person').where('userid', req.params.uid).first();
    knex.select().from('account').where('userid', req.params.uid).then((response) => {
        res.json({user: `${user.firstname} ${user.lastname}`, total_balance: user.balance, accounts: response});
    });
}

async function deleteAccount(req, res){
    const account = await knex.select().from('account').where('accountid', req.params.acid).first();
    const weight = account.weight;
    const uid = account.userid
    const user = await knex.select().from('person').where('userid', uid).first()
    knex('account').where('accountid', req.params.acid).del()
    .then(() => {
        console.log(account);
        knex('account').where('account_name', 'Unallocated funds').where('userid', uid)
        .select('weight', 'balance')
        .then((response) => {
            const newWeight = response[0].weight += weight;
            const newBalance = user.balance *= newWeight;
            knex('account').where('account_name', 'Unallocated funds').where('userid', uid)
            .update({
                weight: newWeight,
                balance: newBalance
            }).then(() => {
                res.json({response: `Removed ${account.account_name}`});
            })
        })
    })
}

async function postTransaction(req, res){
    let date = new Date();
    date = date.toISOString().slice(0, 19).replace('T', ' ');
    const data = {
        userid: req.body.userid,
        accountid: req.body.accountid,
        amount: req.body.amount,
        description: req.body.description,
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
        knex('transactions')
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
    let transactions = knex('transactions')
        .select('transactions.*', 'account.account_name')
        .join('account', 'transactions.accountid', 'account.accountid')
        .where('transactions.userid', userid);

    if (req.query.filter === 'date'){
        const orderDirection = req.query.desc === 'true';
        transactions = transactions.then(res => res.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
        
        if (!orderDirection) {
            return dateA - dateB;
        } else {
            return dateB - dateA;
        }
    }));
    }
    else if (req.query.filter === 'amount'){
        const orderDirection = req.query.desc === 'true';
        transactions = transactions.then(res => res.sort((a, b) => {
            const amountA = parseFloat(a.amount);
            const amountB = parseFloat(b.amount);
        
        if (!orderDirection) {
            return amountA - amountB;
        } else {
            return amountB - amountA;
            }
        }));
    }
    else if (req.query.filter === 'description') {
        transactions = transactions.then(res => res.sort((a, b) => {
        if (req.query.desc === 'false') {
            return a.description.localeCompare(b.description);
        } else {
            return b.description.localeCompare(a.description);
        }
        }));
    }
    else if (req.query.filter === 'account'){
        transactions = transactions.then(res => res.sort((a, b) => {
        if (req.query.desc === 'false') {
            return a.account_name.localeCompare(b.account_name);
        } else {
            return b.account_name.localeCompare(a.account_name);
        }
        }));
    } else {
        console.log('no filter applied');
    }

    const data = await transactions;

    res.json({
        transactions: data
    });
}

async function getTransactionsByAccount(req, res){
    const accountid = req.params.acid;
    const account = await knex.select().from('account').where('accountid', accountid).first();
    const user = await knex.select().from('person').where('userid', account.userid).first();
    const transactions = await knex.select().from('transactions').where('accountid', accountid);
    res.json({
        user: `${user.firstname} ${user.lastname}`,
        account: account,
        transactions: transactions
    });
}

async function payDay(req, res){
    const userid = req.body.userid;
    const value = req.body.amount;
    const accountid = req.body.accountid;
    const description = req.body.description;
    const accounts = await knex.select().from('account').where('userid', userid);
    let date = new Date();
    date = date.toISOString().slice(0, 19).replace('T', ' ');
    const data = {
        userid: userid,
        amount: value,
        accountid: accountid,
        description: description,
        date: date
    }
    knex('paycheck')
    .insert(data)
    .then(() => {
        if (accountid) {
            knex('account')
                .select('balance')
                .where('accountid', accountid)
                .then(acc => {
                    const newSum = acc[0].balance += value;
                    return knex('account').where('accountid', accountid).update('balance', newSum)
                });
        } else {
            for (let i of accounts){
                knex('account')
                .select('balance')
                .where('accountid', i.accountid)
                .then(acc => {
                    const newSum = acc[0].balance += (value * i.weight);
                    return knex('account').where('accountid', i.accountid).update('balance', newSum)
                });
            }
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
    authenticate,
    getUsers,
    newAccount,
    getAccounts,
    postTransaction,
    getTransactionsByUser,
    getTransactionsByAccount,
    payDay,
    getPaychecks,
    deleteAccount,
    test
}