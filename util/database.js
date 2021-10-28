const Sequelize = require('sequelize');

const sequelize = new Sequelize('realkart-db', 'root', 'AnantDuhan@0911##', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
