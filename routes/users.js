const express = require("express");
const router = express.Router();
const { login, signup, tokenCheck } = require("../models/user");

/* GET users listing. */
router.get("/", function(req, res, next) {
  res.send("respond with a resource");
});

router.post("/sign-up", async (req, res, next) => {
  const { account, email, password } = req.body;
  const response = await signup(account, email, password);
  res.send(response);
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const response = await login(email, password);
  res.send(response);
});

module.exports = router;
