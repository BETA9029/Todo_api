// utils/auth.js

const jwt = require("jsonwebtoken");

const secret_key = "Todo-app";

const auth = async (req, res, next) => {
  if(!req.headers.token) return res.status(400).json({ message: "トークンがありません" });;
  const token = await req.headers.token.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(400).json({ message: "トークンがありません" });
  }

  try {
    const decoded = jwt.verify(token, secret_key);
    req.headers.email = decoded.email;
    //console.log(req.headers.email);
    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: "トークンが正しくないので、ログインしてください" });
  }
};

module.exports = auth;
