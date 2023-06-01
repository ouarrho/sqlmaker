  const fs = require('fs');
  const path = require('path');

  const { Parser } = require('zeryab-utils');
  const $Parser = new Parser();

  /**
   * Convert a JSON array into an SQL INSERT query.
   * @param {string} table - The name of the table to insert the data into.
   * @param {Array} data - The data to insert.
   * @param {string} output The output path where the generated SQL files will be saved.
   * @returns {string} The generated SQL INSERT query.
   */
  function insert({ database, table, data, output = './' }) {
    data = $Parser.file(data);
    const columns = Object.keys(data[0]);
    const values = [];

    let sqlQuery = `INSERT INTO `;

    if( database !== undefined && database !== '' ){
      sqlQuery += `\`${database}\`.`;
    }

    sqlQuery += `\`${table}\` \n `;

    sqlQuery += `  (\`${columns.join("\`, \`")}\`) \n`;
    sqlQuery += `VALUES \n`;

    for (let i = 0; i < data.length; i++) {
      const rowValues = Object.values(data[i]);
      values.push(`  (${rowValues.map((value) => `'${value}'`).join(", ")})`);
    }

    sqlQuery += values.join(", \n");
    
    try {
      fs.writeFileSync(`${output}sql_insert_${table}.sql`, sqlQuery);
    } catch (error) {
      console.error("An error occurred: ", error);
    }

    return `${output}sql_insert_${table}.sql`;
  }

module.exports = insert;