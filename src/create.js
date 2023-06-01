  const fs = require('fs');
  const path = require('path');

  const { Parser } = require('zeryab-utils');
  const $Parser = new Parser();

  /**
   * Generates SQL files for creating tables and foreign key constraints
   * @param {string} tables The path where the tables schema.
   * @param {string} relations The path where the relations schema.
   * @param {string} output The output path where the generated SQL files will be saved.
   * @returns {string[]} An array containing the names of the generated SQL files if successful, an empty array otherwise.
   */
  function create({ tables, relations, output = './' }) {
    const tablesObject = $Parser.file(tables);
    const relationsObject = $Parser.file(relations);

    const generatedFiles = [];

    // Generate the SQL code for creating tables
    let allTablesSQL = '';
    let allRelationsSQL = '';

    for (const table of tablesObject) {
      const tableName = table.name;
      const sql = generateTable(table); allTablesSQL += ' \n' + sql;
      try {
        fs.writeFileSync(`${output}sql_create_${tableName}.sql`, sql);
        generatedFiles.push(`sql_create_${tableName}.sql`);
      } catch (error) {
        console.error("An error occurred: ", error);
      }
    }

    try {
      fs.writeFileSync(`${output}sql_create_all_tables.sql`, allTablesSQL);
      generatedFiles.push(`sql_create_all_tables.sql`);
    } catch (error) {
      console.error("An error occurred: ", error);
    }

    // Generate the SQL code for creating foreign key constraints for relations
    for (const relation of relationsObject) {
      const tableName = relation.table;
      const sql = generateRelation(relation); allRelationsSQL += ' \n' + sql;
      try {
        fs.writeFileSync(`${output}sql_create_${tableName}_relations.sql`, sql);
        generatedFiles.push(`sql_create_${tableName}_relations.sql`);
      } catch (error) {
        console.error("An error occurred: ", error);
      }
    }

    try {
      fs.writeFileSync(`${output}sql_create_all_relations.sql`, allRelationsSQL);
      generatedFiles.push(`sql_create_all_relations.sql`);
    } catch (error) {
      console.error("An error occurred: ", error);
    }

    return generatedFiles;
  }


  /**
   * Generates SQL code for creating a table based on the given table information.
   *
   * @param {object} table An object containing the table name and column information.
   * @returns {string} The generated SQL code for creating the table.
   */
  function generateTable(table) {
    const tableName = table.name;
    const columns = table.columns;

    let sql = `CREATE TABLE \`${tableName}\` (\n`;

    for (const column of columns) {
      const columnName = column.name;
      const columnType = column.type;
      const primaryKey = column.primaryKey ? ' PRIMARY KEY' : '';

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
  function generateRelation(relation) {
    const table = relation.table;
    const keys = relation.keys;

    let sql = `ALTER TABLE \`${table}\`\n`;

    for (const key of keys) {
      const databaseName = key.database || '';
      const tableName = key.table;
      const columnName = key.column;
      const keyName = key.name || columnName;

      const constraintName = ( key.constraint !== undefined && key.constraint !== '' ) 
                              ? `\`${key.constraint}\`` 
                              : `\`fk_${table}_${tableName}_${keyName}\``;

      const referenceName = ( databaseName !== '' ) 
                              ? `\`${databaseName}\`.\`${tableName}\`` 
                              : `\`${tableName}\``;

      const CONSTRAINT = `  ADD CONSTRAINT ${constraintName}`;
      const FOREIGN_KEY = ` FOREIGN KEY (\`${keyName}\`) `;
      const REFERENCES = ` REFERENCES ${referenceName} (\`${columnName}\`),\n`;

      sql += CONSTRAINT + FOREIGN_KEY + REFERENCES;
    }

    sql = sql.slice(0, -2);
    sql += ';\n\n';

    return sql;
  }

module.exports = create;