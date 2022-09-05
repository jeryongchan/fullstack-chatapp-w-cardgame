const express = require('express')
const router = express.Router()
const validateForm = require("../controllers/validateForm")
const { handleLogin, attemptLogin, attemptRegister, handleLogout } = require("../controllers/authController");
const { rateLimiter } = require('../controllers/rateLimiter');

router
    .route("/login")
    .get(handleLogin)
    .post(validateForm, rateLimiter(60, 5), attemptLogin);

router
    .post("/signup", validateForm, rateLimiter(30, 3), attemptRegister);

router
    .route("/logout")
    .get(handleLogout)

module.exports = router;