const router = require("express").Router();
const {
  login,
  register,
  me,
  deleteUser,
  getUsers,
} = require("../controllers/authController");
const authValidation = require("../middelwares/validations/authValidation");
const { tokenCheck } = require("../middelwares/auth");

router.post("/login", authValidation.login, login);

router.post("/register", register, authValidation.register, register);

router.get("/me", tokenCheck, me);
router.get("/user", getUsers);
router.delete("/user/:id", deleteUser);

// Protected Route for Home
router.get("/", tokenCheck);

// Another Protected Route for /home
router.get("/home", tokenCheck);
module.exports = router;
