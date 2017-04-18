module.exports = {
  builds_base_url: 'http://builds/',
  deployments_base_url: 'http://deployments/',
  ssl: {
    active: true,
    port: 443,
    key: 'server.key',
    certificate: 'server.crt'
  },
  port: 3000
};
