const crypto = require('crypto');

function hashPass(input) {
  const hash = crypto.createHash('sha256');
  hash.update(input);
  return hash.digest('hex');
}

module.exports = {
    hashPass
}