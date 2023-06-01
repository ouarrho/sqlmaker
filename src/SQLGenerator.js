const $create = require('./create');
const $insert = require('./insert');

/**
 * The SQLGenerator class is responsible for generating SQL files
 * containing the SQL code for creating tables and their foreign key
 * constraints based on the provided configuration.
 */
class SQLGenerator {

  create({ tables, relations, output = './' }) {
    return $create({ tables, relations, output });
  }

  insert({ database, table, data, output = './' }) {
    return $insert({ database, table, data, output });
  }

}

module.exports = SQLGenerator;
