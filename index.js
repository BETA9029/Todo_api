const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const connectDB = require("./utils/database.js");
const { TodoModel, UserModel } = require("./utils/schemaModels.js");

//cors対策;
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTION"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/", async (req, res) => {
  try {
    await connectDB();
    const AllTodo = await TodoModel.find();
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

app.listen(5000, () => {
  console.log("Listening on localhost port 5000");
});
