# Zeryab DataBase

- This is a README for a npm package that allows developers to create SQL files from JSON, YAML, or XML files. The package takes in a tables.json file that contains information about the database tables and columns. An example of the tables.json file is provided in the README, with tables such as "users" and "reactions" and their respective columns.

- The package also takes in a relations.js file that contains information about foreign keys and relationships between tables. The relations.js file has a table key and a foreignKeys array that specifies which columns reference other tables. An example of the relations.js file is provided in the README, with the foreign keys between the "users_reactions" table and the "users" and "reactions" tables.

- From these input files, the package generates SQL files for each table with its respective columns and foreign key constraints. An example of the generated SQL files is provided in the README, with files such as "users.sql", "reactions.sql", and "users_reactions_fk.sql".

- Overall, this package simplifies the process of generating SQL files from JSON, YAML, or XML files, and provides a straightforward solution for developers to create and manage their database schemas.

# SQL File Generator
- This package helps developers create SQL files from JSON, YAML or XML files.

## Installation

- To install, run:
```
npm install zeryab-db
```

## Usage

- The package exposes a generateSqlFiles function that takes in two arguments:
```
const { SQLConfig, SQLGenerator } = require('zeryab-db');

const $SQLConfig = new SQLConfig('./.config/tables.json', './.config/relations.json');
const $SQLGenerator = new SQLGenerator();
const $sqlFiles = $SQLGenerator.generate( $SQLConfig, './tables/' );

console.table($sqlFiles); // will log the names of the generated files
```

# Examples
- Assuming we have a tables.json file with the following content:
```
[
  {
    "name": "users",
    "columns": [
      { "name": "userId", "type": "int(11) unsigned", "primary_key": true },
      { "name": "userName", "type": "varchar(255)" }
    ]
  },
  {
    "name": "reactions",
    "columns": [
      { "name": "reactionId", "type": "int(11) unsigned", "primary_key": true },
      { "name": "reactionName", "type": "varchar(255)" }
    ]
  },
  {
    "name": "users_reactions",
    "columns": [
      { "name": "userReactionId", "type": "int(11) unsigned", "primary_key": true },
      { "name": "userId", "type": "int(11) unsigned" },
      { "name": "reactionId", "type": "int(11) unsigned" }
    ]
  }
]
```

- And a relations.js file with the following content:
```
[
  {
    "table": "users_reactions",
    "foreignKeys": [
      {
        "column": "userId",
        "table": "users",
        "description": "The user who made the reaction"
      },
      {
        "column": "reactionId",
        "table": "reactions",
        "description": "The reaction made by the user"
      }
    ]
  }
]
```

- The package will generate the following SQL files:

- users.sql:
```
CREATE TABLE `users` (
  `userId` int(11) unsigned PRIMARY KEY,
  `userName` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- reactions.sql:
```
CREATE TABLE `reactions` (
  `reactionId` int(11) unsigned PRIMARY KEY,
  `reactionName` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- users_reactions.sql:
```
CREATE TABLE `users_reactions` (
  `userReactionId` int(11) unsigned PRIMARY KEY,
  `userId` int(11) unsigned,
  `reactionId` int(11) unsigned
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

- users_reactions_fk.sql:
```
ALTER TABLE `users_reactions`
  ADD CONSTRAINT `fk_users_reactions_users` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`),
  ADD CONSTRAINT `fk_users_reactions_reactions` FOREIGN KEY (`reactionId`) REFERENCES `reactions` (`reactionId`);
```

Happy Coding 👩‍💻👨‍💻