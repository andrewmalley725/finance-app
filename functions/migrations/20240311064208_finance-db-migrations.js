/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('person', function(table) {
        table.increments('userid').primary();
        table.string('username', 20);
        table.string('firstname', 20);
        table.string('lastname', 20);
        table.string('password', 64);
        table.string('email', 100);
        table.decimal('balance', 14, 3);
      })
  
      .createTable('account', function(table) {
        table.increments('accountid').primary();
        table.integer('userid').unsigned().notNullable().references('userid').inTable('person');
        table.string('account_name', 100).notNullable();
        table.decimal('weight', 4, 3).notNullable();
        table.decimal('balance', 13, 3).notNullable();
      })
  
      .createTable('transactions', function(table) {
        table.increments('transactionid').primary();
        table.integer('userid').unsigned().references('userid').inTable('person');
        table.integer('accountid').unsigned().references('accountid').inTable('account');
        table.decimal('amount', 13, 3).notNullable();
        table.string('description', 100);
        table.dateTime('date');
      })
  
      .createTable('paycheck', function(table) {
        table.increments('payid').primary();
        table.integer('userid').unsigned().references('userid').inTable('person');
        table.integer('accountid').unsigned().references('accountid').inTable('account');
        table.decimal('amount', 13, 3).notNullable();
        table.string('description', 100);
        table.dateTime('date');
      })
  
      .then(function() {
        return Promise.all([
          knex.schema.raw('CREATE INDEX IF NOT EXISTS userAccount ON account(userid)'),
          knex.schema.raw('CREATE INDEX IF NOT EXISTS transactionAcc ON transactions(accountid)'),
          knex.schema.raw('CREATE INDEX IF NOT EXISTS transactionUser ON transactions(userid)'),
          knex.schema.raw('CREATE INDEX IF NOT EXISTS userPay ON paycheck(userid)'),
          knex.schema.raw('CREATE INDEX IF NOT EXISTS accPay ON paycheck(accountid)'),
        ]);
      });
  };

  /**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('userPay')
      .dropTableIfExists('transactionUser')
      .dropTableIfExists('transactionAcc')
      .dropTableIfExists('accPay')
      .dropTableIfExists('userAccount')
      .dropTableIfExists('paycheck')
      .dropTableIfExists('transactions')
      .dropTableIfExists('account')
      .dropTableIfExists('person');
  };
  



