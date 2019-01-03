const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const { Pool } = require('pg');
const { 
    pgUser,
    pgHost,
    pgDatabase,
    pgPassword,
    pgPort,
    redisHost,
    redisPort
} = require('./keys');

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

const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    retry_strategy: () => 1000
});

// We need to duplicate the connection because when we have a client
// that listen or publish information it cannot be used for other purposes
const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * from values');
    res.send(values.rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send();
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(442).send('index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, () => {
    console.log('listen')
});
