var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var todolists = require('../models/todolists');

var todolistRouter = express.Router();
todolistRouter.use(bodyParser.json());

todolistRouter.route('/')
.get(function (req, res, next) {
    todolists.find({}, function (err, todolist) {
        if (err) throw err;
        res.json(todolist);
    });
})

.post(function (req, res, next) {
    todolists.create(req.body, function (err, todolist) {
        if (err) throw err;
        console.log('todolist created!');
        var id = todolist._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the todolist with id: ' + id);
    });
})

.delete(function (req, res, next) {
    todolists.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

todolistRouter.route('/:todolistId')
.get(function (req, res, next) {
    todolists.findById(req.params.todolistId, function (err, todolist) {
        if (err) throw err;
        res.json(todolist);
    });
})

.put(function (req, res, next) {
    todolists.findByIdAndUpdate(req.params.todolistId, {
        $set: req.body
    }, {
        new: true
    }, function (err, todolist) {
        if (err) throw err;
        res.json(todolist);
    });
})

.delete(function (req, res, next) {
    todolists.findByIdAndRemove(req.params.todolistId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

todolistRouter.route('/:todolistId/todos')
.get(function (req, res, next) {
    todolists.findById(req.params.todolistId, function (err, todolist) {
        if (err) throw err;
        res.json(todolist.todos);
    });
})

.post(function (req, res, next) {
    todolists.findById(req.params.todolistId, function (err, todolist) {
        if (err) throw err;
        todolist.todos.push(req.body);
        todolist.save(function (err, todolist) {
            if (err) throw err;
            console.log('Updated todos!');
            res.json(todolist);
        });
    });
})

.delete(function (req, res, next) {
    todolists.findById(req.params.todolistId, function (err, todolist) {
        if (err) throw err;
        for (var i = (todolist.todos.length - 1); i >= 0; i--) {
            todolist.todos.id(todolist.todos[i]._id).remove();
        }
        todolist.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all todos!');
        });
    });
});

todolistRouter.route('/:todolistId/todos/:todoId')
.get(function (req, res, next) {
    todolists.findById(req.params.todolistId, function (err, todolist) {
        if (err) throw err;
        res.json(todolist.todos.id(req.params.todoId));
    });
})

.put(function (req, res, next) {
    // We delete the existing todo and insert the updated
    // todo as a new todo
    todolists.findById(req.params.todolistId, function (err, todolist) {
        if (err) throw err;
        todolist.todos.id(req.params.todoId).remove();
        todolist.todos.push(req.body);
        todolist.save(function (err, todolist) {
            if (err) throw err;
            console.log('Updated todos!');
            res.json(todolist);
        });
    });
})

.delete(function (req, res, next) {
    todolists.findById(req.params.todolistId, function (err, todolist) {
        todolist.todos.id(req.params.todoId).remove();
        todolist.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

module.exports = todolistRouter;
