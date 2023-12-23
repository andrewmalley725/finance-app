const knex = require('../models/dbConnect');
const { hashPass } = require('../function/hashPass')

function addUser(req, res){
    const newUser = {
        username: req.body.userName,
        firstname: req.body.first,
        lastname: req.body.last,
        password: hashPass(req.body.pass),
        email: req.body.email
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
    const user = await knex.select().from('person').where('userid', req.params.uid);
    knex.select().from('account').where('userid', req.params.uid).then((response) => {
        let total = 0;
        for (let i of response){
            total += i.balance;
        }
        res.json({user: user[0].username, total_balance: total, accounts: response});
    });
}

async function postTransaction(req, res){
    let date = new Date();
    date = date.toISOString().slice(0, 19).replace('T', ' ');
    const data = {
        accountid: req.body.accountid,
        amount: req.body.amount,
        date: date
    }
    knex('account')
    .where('accountid', req.body.accountid)
    .select('balance')
    .then((response) => {
        const newSum = response[0].balance += req.body.amount;
        return knex('account').where('accountid', req.body.accountid).update('balance', newSum);
    })
    .then(() => {
        knex('transaction')
        .insert(data)
        .then(async () => {
            res.json({
                response: `Added transaction of ${data.amount} to account #${data.accountid}`, 
            });
        });
    });
}

function getTransactions(req, res){

}

module.exports = {
    addUser,
    getUsers,
    newAccount,
    getAccounts,
    postTransaction,
    getTransactions
}