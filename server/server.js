const express = require('express');
const bodyParser = require('body-parser');
const {
    ObjectId
} = require('mongodb')
const {
    mongoose
} = require('./db/mongoose');
const {
    Todo
} = require('./models/todo');
const {
    User
} = require('./models/user');

const port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }, (err) => {
        res.status(400).send(err);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).send('Id is not found.');
    };
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send('Id is not found.');
        };
        res.send(todo);
    }, (err) => {
        res.status(400).send(err);
    });
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};
// sabri 
// OD2o0GOGtXoeuPil
