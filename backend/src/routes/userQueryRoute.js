const express = require("express");
const { createUserQuery } = require("../controllers/userQuery.controller");
const authenticate = require("../middleware/authenticat")
const router = express.Router();

router.post("/user-query",authenticate,createUserQuery);

module.exports = router;

