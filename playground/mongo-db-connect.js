const {
    MongoClient,
    ObjectId
} = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'
const yargs = require('yargs');

const argv = yargs
    .command('add', 'Add note command', {
        name: {
            demand: true,
            alias: 'n',
            describe: 'Name'
        },
        age: {
            demand: true,
            alias: 'a',
            describe: 'Age'
        },
        country: {
            demand: true,
            alias: 'c',
            describe: 'Country'
        }
    })
    .command('find', 'Find user')
    .argv;

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'TodoApp';

// Use connect method to connect to the server
client.connect();
console.log('Connected successfully to server');
const db = client.db(dbName);


switch (argv._[0]) {
    case 'add':
        insertUser(argv.name, argv.age, argv.country)
            .then()
            .catch()
            .finally(() => client.close());

        break;
    case 'list':
        getUser().then((data) => {
            console.log(data)
        }).catch().finally(() => client.close());
        break;
    default:
        getUser().then((data) => {
            console.log(data)
        }).catch().finally(() => client.close());
        break;
}