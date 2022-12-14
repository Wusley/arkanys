const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    root: rootPath,
    app: {
      name: 'arkanys'
    },
    type: 'development',
    port: process.env.PORT || 3000,
  },

  test: {
    root: rootPath,
    app: {
      name: 'arkanys'
    },
    type: 'test',
    port: process.env.PORT || 3000,
  },

  production: {
    root: rootPath,
    app: {
      name: 'arkanys'
    },
    type: 'production',
    port: process.env.PORT || 3000,
  }
};

module.exports = config[env];
