var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var todoSchema = new Schema({
    todo:  {
        type: String,
        required: true
    },
    done:  {
        type: Boolean,
        required: true,
        default: false
    },
    priority:  {
        type: Number,
        min: 1,
        max: 5,
        default: 1
    }
}, {
    timestamps: true
});

// create a schema
var todolistSchema = new Schema({
    author:  {
        type: String,
        required: false, //for the first (test only)
        default: "anonymous"
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false,
        default: ""
    },
    todos:[todoSchema]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var todolists = mongoose.model('todolist', todolistSchema);

// make this available to our Node applications
module.exports = todolists;
