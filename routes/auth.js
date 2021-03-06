const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require('../models/user');

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [body("email")
    .isEmail()
    .withMessage("Please Enter a valid Email.")
    .normalizeEmail(),
  body('password', 'Incorrect Password')
    .isStrongPassword()
    .trim()

],
  authController.postLogin
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please Enter a valid Email.")
      .custom((value, { req }) => {
        // if (value === "duhananant@gmail.com") {
        //   throw new Error("This email address is forbidden.");
        // }
        // return true;
        return User.findOne({ email: value })
        .then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              'E-Mail exists already, please pick a different one.'
            );
          }
        });
      })
      .normalizeEmail(),
    body('password').isStrongPassword().trim(),
    body('confirmPassword').custom((value, { req }) => {
      if(value !== req.body.password) {
        throw new Error("Passwords must match!")
      }
      return true;
    })
    .trim()
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get('/reset', authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
