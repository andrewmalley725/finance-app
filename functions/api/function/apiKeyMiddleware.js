require('dotenv').config();

function apiKeyMiddleware(req, res, next) {
    const providedApiKey = req.headers['x-api-key'];

    const excludedRoutes = ['/api/newUser', '/api/authenticate'];

    if (excludedRoutes.includes(req.path)) {
        next();
    }
    else if (providedApiKey === process.env.API_KEY) {
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  module.exports = { apiKeyMiddleware };
  