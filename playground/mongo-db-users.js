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
        city: {
            demand: true,
            alias: 'c',
            describe: 'City'
        }
    })
    .command('find', 'Find user by city', {
        city: {
            demand: true,
            alias: 'c',
            describe: 'City'
        }
    })
    .command('delete', 'delete user', {
        city: {
            demand: true,
            alias: 'c',
            describe: 'City'
        }
    })
    .command('update', 'update user', {
        id: {
            demand: true,
            alias: 'i',
            describe: 'Id'
        },
        city: {
            demand: true,
            alias: 'c',
            describe: 'City'
        }
    })
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
const collection = db.collection('Users');

async function insertUser(name, age, city) {
    // const insertResult = await collection.insertMany([{ a: 1 }, { a: 2 }, { a: 3 }]);
    await collection.insertOne({
        name,
        age,
        city
    }).then((res) => {
        console.log('Inserted documents =>', res.insertedId.getTimestamp())
    }).finally(() => client.close());

}

function getUser(city) {
    collection.find(city ? {
        city: city
    } : null).toArray().then((result) => {
        if (result.length === 0) {
            console.log('Nothing found matches your search');
        } else {
            console.log(result);
        }
    }, (err) => {
        console.log('something went wrong')
    }).finally(() => {
        client.close();
    });
}

function deleteUser(city) {
    collection.findOneAndDelete({
        city: city
    }).then((res) => {
        console.log(res)
    }).finally(() => {
        client.close();
    });
}

function updateUser(id, city) {
    collection.findOneAndUpdate({
        _id: new ObjectId(id)
    }, {
        $set: {
            city: city
        }
    }, {
        returnOriginal: false
    }).then((res) => {
        console.log(res)
    }).finally(() => {
        client.close();
    });
}

switch (argv._[0]) {
    case 'add':
        insertUser(argv.name, argv.age, argv.city);
        break;
    case 'find':
        getUser(argv.city);
        break;
    case 'delete':
        deleteUser(argv.city);
        break;
    case 'update':
        updateUser(argv.id, argv.city);
        break;
    default:
        getUser();
        break;
}