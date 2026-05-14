const { env } = require('process');

const target = 'https://localhost:7047/solicitors';

const PROXY_CONFIG = [
  {
    context: [
      "/solicitors",
    ],
    target,
    secure: true
  }
]

module.exports = PROXY_CONFIG;
