const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const { pgUser, pgHost, pgDatabase, pgPassword, pgPort } = require('./keys');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
    user: pgUser,
    host: pgHost,
    database: pgDatabase,
    password: pgPassword,
    port: pgPort
});
pgClient.on('error', () => console.log('Lost PG connection'));

//create a table named values with a field named number
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err));

