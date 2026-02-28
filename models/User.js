const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//user schema
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 100,
      unique: true,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
//Generate Token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this.use._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
  );
};

//User Model
const User = mongoose.model("User", UserSchema);
//validate Registe User

function validateRegisterUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    username: Joi.string().trim().min(2).max(200).required(),
    password: Joi.string().trim().min(7).required(),
  });
  return schema.validate(obj);
}

//validate Login User
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(7).max(100).required(),
  });
  return schema.validate(obj);
}
//validate Update User

function validateUpdateUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email(),
    username: Joi.string().trim().min(2).max(200).required(),
    password: Joi.string().trim().min(7),
    isAdmin: Joi.bool(),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
};
