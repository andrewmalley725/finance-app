const crypto = require('crypto');

function hashPass(input) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

function middleWare(){
  console.log(process.env)
}


module.exports = {
    hashPass,
    middleWare
}