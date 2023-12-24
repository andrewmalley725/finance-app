const app = require('./functions/app');

const PORT = 8080;

const server = require('http').Server(app);

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});