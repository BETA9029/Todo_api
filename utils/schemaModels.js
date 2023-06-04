// utils/SchemaModels.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  todo: String,
  done: Boolean,
  email: String,
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

exports.TodoModel = mongoose.model("todo", TodoSchema);
exports.UserModel = mongoose.model("user", UserSchema);
