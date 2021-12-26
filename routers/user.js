const express = require("express");
const UserController = require("../controllers/user");
const multipart = require("connect-multiparty");

const md_auth = require("../Middleware/authenticated");
const md_upload_avatar = multipart({ uploadDir: "./uploads/avatar" });

const api = express.Router();

api.post("/sign-up", UserController.signUp);

api.post("/sign-in", UserController.signIn);

api.get("/users", [md_auth.ensureAuth], UserController.getUsers);

api.get("/users-status", [md_auth.ensureAuth], UserController.getUsersActive);

api.put(
  "/upload-Avatar/:id",
  [md_auth.ensureAuth, md_upload_avatar],
  UserController.uploadAvatar
);

api.get(
  "/get-avatar/:avatarName",
  md_auth.ensureAuth,
  UserController.getAvatar
);

module.exports = api;
