const User = require("../models/user");
const { v4: uuid } = require("uuid");
//const { setUser } = require("../service/auth");
const { setUser } = require("../service/jwt_auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name,
    email,
    password,
  });
  return res.redirect("/");
}

async function handleLogin(req, res) {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.render("login", {
      error: "invalid email or password",
    });
  }

  //stateful auth
  // const sessionId = uuid();
  // setUser(sessionId, user);
  // res.cookie("uid", sessionId);

  //jwt auth
  const token = setUser(user);
  //res.cookie("uid", token);
  res.cookie("token", token);
  //return res.json({ token });

  return res.redirect("/");
}

module.exports = {
  handleUserSignup,
  handleLogin,
};
