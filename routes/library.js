const express = require("express");
const router = express.Router();
const {
  libraryadd,
  wishlistadd,
  libraryremove,
  wishlistremove,
  libraryretreive,
  wishlistretreive
} = require("../models/library");

router.get("/owned/retreive", async (req, res, next) => {
  const { account, token } = req.body;
  const response = await libraryretreive(account, token);
  res.send(response);
});

router.put("/owned/add", async (req, res, next) => {
  const { account, token, isbn } = req.body;
  const response = await libraryadd(account, token, isbn);
  res.send(response);
});

router.delete("/owned/remove", async (req, res, next) => {
  const { account, token, isbns } = req.body;
  const response = await libraryremove(account, token, isbns);
  res.send(response);
});

router.get("/wishlist/retreive", async (req, res, next) => {
  const { account, token } = req.body;
  const response = await wishlistretreive(account, token);
  res.send(response);
});

router.put("/wishlist/add", async (req, res, next) => {
  const { account, token, isbn } = req.body;
  const response = await wishlistadd(account, token, isbn);
  res.send(response);
});

router.delete("/wishlist/remove", async (req, res, next) => {
  const { account, token, isbns } = req.body;
  const response = await wishlistremove(account, token, isbns);
  res.send(response);
});

module.exports = router;
