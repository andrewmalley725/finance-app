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
        res.json({user: user[0].username, accounts: response});
    });
}

module.exports = {
    addUser,
    getUsers,
    newAccount,
    getAccounts
}