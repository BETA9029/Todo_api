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

//getリクエストに対してjwtが有効ならそのユーザのtodoを返す
app.get("/", auth, async (req, res) => {
  try {
    await connectDB();
    console.log(req.headers.email);
    const AllTodo = await TodoModel.find({ email: req.headers.email });
    const user = await UserModel.find({ email: req.headers.email });
    console.log(req.headers.email);
    return res.status(200).json({
      messege: "TODO読み取り成功",
      alltodo: AllTodo,
      email: req.headers.email,
    });
  } catch {
    return res.status(400).json({ messege: "TODO読み取り失敗" });
  }
});

//新たなtodoをdbに追加
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

//指定されたtodoの変更をdbに追加
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

//指定されたtodoをdbから削除
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

//新たなユーザをdbに追加、emailがユニークになっているので、既に存在していたら失敗する
app.post("/user/register", async (req, res) => {
  try {
    await connectDB();
    await UserModel.create(req.body);
    return res.status(200).json({ messege: "ユーザ登録に成功" });
  } catch (err) {
    return res.status(400).json({ messege: "ユーザ登録に失敗" });
  }
});

//ユーザのログイン機能。送られてきたユーザデータが正しかったら、jwtを返す
app.post("/user/login", async (req, res) => {
  try {
    const secret_key = "Todo-app";
    await connectDB();
    const saveUserData = await UserModel.findOne({ email: req.body.email });

    console.log(!saveUserData);
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
    const token = jwt.sign(paylod, secret_key, { expiresIn: "23h" });
    console.log(token);
    return res.status(200).json({ messege: "ログインに成功", token: token });
  } catch (err) {
    return res.status(400).json({ messege: "ログインに失敗" });
  }
});

//Connecting to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on localhost port ${port}`);
});
