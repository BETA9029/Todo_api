const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const jwt = require("jsonwebtoken");
const auth = require("./utils/auth");
const connectDB = require("./utils/database.js");
const { TodoModel, UserModel } = require("./utils/schemaModels.js");
const { emit } = require("nodemon");

app.get("/:email", async (req, res) => {
  try {
    await connectDB();
    const AllTodo = await TodoModel.find({ email: req.params.email });
    return res
      .status(200)
      .json({ messege: "TODO読み取り成功", alltodo: AllTodo });
  } catch {
    return res.status(400).json({ messege: "TODO読み取り失敗" });
  }
});

app.post("/create", async (req, res) => {
  try {
    await connectDB();
    console.log(req.body);
    await TodoModel.create(req.body);
    return res.status(200).json({ messege: "TODO作成に成功" });
  } catch (err) {
    return res.status(400).json({ messege: "TODO作成に失敗" });
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    await connectDB();
    console.log(req.params.id);
    await TodoModel.updateOne({ _id: req.params.id }, req.body);
    return res.status(200).json({ messege: "TODO編集に成功" });
  } catch (err) {
    return res.status(400).json({ messege: "TODO編集に失敗" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    await connectDB();
    console.log(req.params.id);
    await TodoModel.deleteOne({ _id: req.params.id });
    return res.status(200).json({ messege: "TODO編集に成功" });
  } catch (err) {
    return res.status(400).json({ messege: "TODO編集に失敗" });
  }
});

app.post("/user/register", async (req, res) => {
  try {
    await connectDB();
    await UserModel.create(req.body);
    return res.status(200).json({ messege: "ユーザ登録に成功" });
  } catch (err) {
    return res.status(400).json({ messege: "ユーザ登録に失敗" });
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const secret_key = "Todo-app";
    await connectDB();
    const saveUserData = await UserModel.findOne({ email: req.body.email });

    //DBにデータがなかった時の処理
    if (!saveUserData)
      return res
        .status(400)
        .json({ messege: "ログインに失敗：ユーザ登録してください" });

    //emailがあってパスワードがない時の処理
    if (req.body.password !== saveUserData.password)
      return res.status(400).json({ messege: "パスワードが違います" });

    //emailとパスワードがあったとき
    const paylod = {
      email: req.body.email,
    };
    const token = jwt.sign(paylod, secret_key, { expiresIn: "10m" });
    console.log(token);
    return res.status(200).json({ messege: "ログインに成功", token: token });
  } catch (err) {
    return res.status(400).json({ messege: "ログインに失敗" });
  }
});

app.listen(5000, () => {
  console.log("Listening on localhost port 5000");
});
