// utils/SchemaModels.js

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  todo: String,
  done: Boolean,
});

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

exports.TodoModel = mongoose.model("todo", TodoSchema);
exports.UserModel = mongoose.model("user", UserSchema);
