const fs = require('fs');
const path = require('path');

/**
 * The SQLGenerator class is responsible for generating SQL files
 * containing the SQL code for creating tables and their foreign key
 * constraints based on the provided configuration.
 */
class SQLGenerator {

  /**
   * Generates SQL files for creating tables and foreign key constraints
   * based on the given configuration.
   *
   * @param {object} config The configuration object containing table and relation information.
   * @param {string} output The output path where the generated SQL files will be saved.
   * @returns {string[]} An array containing the names of the generated SQL files if successful, an empty array otherwise.
   */
  generate(config, output = './') {
    const tables = config.getTables();
    const relations = config.getRelations();
    const generatedFiles = [];

    // Generate the SQL code for creating tables
    for (const table of tables) {
      const tableName = table.name;
      const sql = this.#generateTable(table);
      try {
        fs.writeFileSync(`${output}${tableName}.sql`, sql);
        generatedFiles.push(`${tableName}.sql`);
      } catch (error) {
        console.error("An error occurred: ", error);
      }
    }

    // Generate the SQL code for creating foreign key constraints for relations
    for (const relation of relations) {
      const tableName = relation.table;
      const sql = this.#generateRelation(relation);
      try {
        fs.writeFileSync(`${output}${tableName}_fk.sql`, sql);
        generatedFiles.push(`${tableName}_fk.sql`);
      } catch (error) {
        console.error("An error occurred: ", error);
      }
    }
    return generatedFiles;
  }

  /**
   * Generates SQL code for creating a table based on the given table information.
   *
   * @param {object} table An object containing the table name and column information.
   * @returns {string} The generated SQL code for creating the table.
   */
  #generateTable(table) {
    const tableName = table.name;
    const columns = table.columns;

    let sql = `CREATE TABLE \`${tableName}\` (\n`;

    for (const column of columns) {
      const columnName = column.name;
      const columnType = column.type;
      const primaryKey = column.primary_key ? ' PRIMARY KEY' : '';

      sql += `  \`${columnName}\` ${columnType}${primaryKey},\n`;
    }

    sql = sql.slice(0, -2);
    sql += `\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n`;

    return sql;
  }

  /**
   * Generates SQL code for creating foreign key constraints based on the given relation information.
   *
   * @param {object} relation An object containing the relation and foreign key information.
   * @returns {string} The generated SQL code for creating the foreign key constraints.
   */
  #generateRelation(relation) {
    const tableName = relation.table;
    const foreignKeys = relation.foreignKeys;

    let sql = `ALTER TABLE \`${tableName}\`\n`;

    for (const foreignKey of foreignKeys) {
      const columnName = foreignKey.column;
      const referenceTable = foreignKey.table;
      const referenceColumn = foreignKey.referenceColumn || columnName;

      sql += `  ADD CONSTRAINT \`fk_${tableName}_${referenceTable}\` FOREIGN KEY (\`${columnName}\`) REFERENCES \`${referenceTable}\` (\`${referenceColumn}\`),\n`;
    }

    sql = sql.slice(0, -2);
    sql += ';\n\n';

    return sql;
  }

}

module.exports = SQLGenerator;
