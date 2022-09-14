var express = require("express");
var router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  res.send("provide user credentails");
});

//Login
router.post("/login", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed",
    });
    return;
  }

  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);

  if (queryUsers.length === 0) {
    res.json({
      error: true,
      message: "Error: User not found",
    });

    return;
  }

  const user = queryUsers[0];
  const match = await bcrypt.compare(password, user.hash);

  if (!match) {
    res.json({ error: true, message: "Error Password" });
    return;
  }

  const secretKey = "secret key";
  const expires_in = 60 * 60 * 24;

  const exp = Date.now() + expires_in * 1000;

  const token = jwt.sign({ email, exp }, secretKey);
  res.json({ token_type: "Bearer", token });
  next();
});

router.post("/register", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Error: Request body incomplete - email and password needed",
    });
    return;
  }

  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);

  if (queryUsers.length > 0) {
    res.json({
      error: true,
      message: "Error: User already exists",
    });

    return;
  }

  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);

  await req.db.from("users").insert({ email, hash });

  res.status(201).json({ error: false, message: "Success: user added" });
  next();
});

module.exports = router;
