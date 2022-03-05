const express = require('express');
const _ = require('lodash');
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
    authenticate
} = require('./middleware/authenticate');

const {
    User
} = require('./models/user');

const port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.json());

// TODOS
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

app.delete('/todos/remove-all', (req, res) => {
    Todo.deleteMany().then((todos) => {
        res.status(200).send('All notes are removed');
    }, (err) => {
        res.status(400).send(err);
    });
});

app.delete('/todos/remove/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectId.isValid(id)) {
        return res.status(404).send('Id is not found.');
    };
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send('Id is not found.');
        };
        res.send(todo);
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
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectId.isValid(id)) {
        return res.status(404).send('Id is not found.');
    };
    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send('Id is not found.');
        };
        res.send(todo);
    }, (err) => {
        res.status(400).send(err);
    });
});

// USERS
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });
});

// get user by token
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {
    app
};
// sabri 
// OD2o0GOGtXoeuPil


// heroku config:set MONGODB_URI="mongodb+srv://sabri:OD2o0GOGtXoeuPil@TodoApp.n9z04.mongodb.net/todoapp-mongodb?retryWrites=true&w=majority"
// https://www.mongodb.com/developer/how-to/use-atlas-on-heroku/#:~:text=Get%20Your%20Atlas%20Cluster%20Connection,to%20connect%20to%20our%20cluster.