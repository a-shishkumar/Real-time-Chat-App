const {
  register,
  login,
  SetAvatar,
  getAllUsers,
  logout,
} = require("../controllers/userController");

const routerr = require("express").Router();

routerr.post("/register", register);
routerr.post("/login", login);
routerr.post("/setAvatar/:id", SetAvatar);
routerr.get("/allusers/:id", getAllUsers);
routerr.get("/logout/:id", logout);

module.exports = routerr;
