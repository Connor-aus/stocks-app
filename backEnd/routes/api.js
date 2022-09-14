const express = require("express");
let router = express.Router();
const jwt = require("jsonwebtoken");
const app = require("../app");
const secretKey = "secret key";

const authorize = (req, res, next) => {
  const authorization = req.headers.authorization;

  //Retrieve Token
  if (authorization && authorization.split(" ")[1]) {
    const token = authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, secretKey);

      if (decoded.exp < Date.now()) {
        return res.sendStatus(401);
      }

      req.email = decoded.email;
      next();
    } catch (error) {
      res.sendStatus(403);
      next();
    }
  }
};

router.post("/update", authorize, async function (req, res, next) {
  const update = req.body.watchlist;

  try {
    await req
      .db("users")
      .update("watchlist", update)
      .where("email", "=", req.email);
  } catch (error) {
    console.log(error);
    res.json({ error: true, message: "Error: failed to update watchlist" });
    next();
  }

  res.status(201).json({ error: false, message: "Success: watchlist updated" });
  next();
});

router.get("/watchlist", authorize, async function (req, res, next) {
  try {
    let row = req.db
      .from("users")
      .select("watchlist")
      .where("email", "=", req.email);
    res.json({
      error: false,
      message: "Success: watchlist found",
      Watchlist: await row,
    });
    next();
  } catch (error) {
    res.json({ error: true, message: "Error: failed to return watchlist" });
    next();
  }
  next();
});

module.exports = router;
