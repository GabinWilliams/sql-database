const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

const pg = require('pg');

const Pool = pg.Pool;

const pool = new Pool({
    database: 'jazzy_sql',
    host: 'localhost',
    port: 5432

});

// HELPERS 

pool.on('connect', () => {
    console.log('PG CONNECTED');

})

pool.on('error', (error) => {
    console.log(error);

});

app.listen(PORT, () => {
    console.log('listening on port', PORT)
});

// TODO - Replace static content with a database tables
// const artistList = [ 
//     {
//         name: 'Ella Fitzgerald',
//         birthdate: '04-25-1917'
//     },
//     {
//         name: 'Dave Brubeck',
//         birthdate: '12-06-1920'
//     },       
//     {
//         name: 'Miles Davis',
//         birthdate: '05-26-1926'
//     },
//     {
//         name: 'Esperanza Spalding',
//         birthdate: '10-18-1984'
//     },
// ]
// const songList = [
//     {
//         title: 'Take Five',
//         length: '5:24',
//         released: '1959-09-29'
//     },
//     {
//         title: 'So What',
//         length: '9:22',
//         released: '1959-08-17'
//     },
//     {
//         title: 'Black Gold',
//         length: '5:17',
//         released: '2012-02-01'
//     }
// ];

app.get('/artist', (req, res) => {
    console.log(`In /artist GET`);
    const queryText = `
    SELECT * FROM "artists" ORDER BY "birthdate" DESC;
    `
    // sending the text to music_library
    pool.query(queryText)
        .then((result) =>{
            console.log(result);

            res.send(result.rows);

        }).catch((error) => {
            console.log(error);

            res.sendStatus(500);
        })// end catch
});// end get

app.post('/artist', (req, res) => {
    console.log('In /artist POST');
    console.log(req.body);
    // send body data to database
    // must use a prepared statement
    const queryText = `
    INSERT INTO "artists" ("name", "birthdate")
    VALUES ($1, $2);
    `
    // placeholders always start with $
    pool.query(queryText, [req.body.name, req.body.birthdate])
    .then((result) =>{
        console.log(result);

        res.sendStatus(201);

    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    })// end catch
});

app.get('/song', (req, res) => {
    console.log(`In /song GET`);
    const queryText = `
    SELECT * FROM "songs" ORDER BY "title";
    `
    // sending data to database
    pool.query(queryText)
        .then((result) =>{
            console.log(result);

            res.send(result.rows);

        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        })// end catch
});

app.post('/song', (req, res) => {
    console.log(req.body);
    // send body data to database
    // must use a prepared statement
    const queryText = `
    INSERT INTO "songs" ("title", "length", "released")
    VALUES ($1, $2, $3);
    `
    // placeholders always start with $
    pool.query(queryText, [req.body.title, req.body.length, req.body.released])
    .then((result) =>{
        console.log(result);

        res.sendStatus(201);

    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    })// end catch
});


