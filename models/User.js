const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const passwordComplexity = require("joi-password-complexity");

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
    firstName: {           // ✅ Bug 1 — changed username → firstName
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    lastName: {            // ✅ Bug 1 — added lastName field
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
                           // ✅ Bug 2 — removed unique:true from password (DANGEROUS)
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// ✅ Bug 3 — was this.use._id (crash), fixed to this._id
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY,
  );
};

const User = mongoose.model("User", UserSchema);

function validateRegisterUser(obj) {
  const schema = Joi.object({
    email:     Joi.string().trim().min(5).max(100).required().email(),
    firstName: Joi.string().trim().min(2).max(200).required(),
    lastName:  Joi.string().trim().min(2).max(200).required(),
    password:  passwordComplexity().required(), // ✅ Bug 4 — .require() → .required()
  });
  return schema.validate(obj);
}

function validateLoginUser(obj) {
  const schema = Joi.object({
    email:    Joi.string().trim().min(5).max(100).required().email(),
    password: Joi.string().trim().min(7).max(100).required(),
  });
  return schema.validate(obj);
}

function validateUpdateUser(obj) {
  const schema = Joi.object({
    email:     Joi.string().trim().min(5).max(100).email(),
    firstName: Joi.string().trim().min(2).max(200),
    lastName:  Joi.string().trim().min(2).max(200),
    password:  Joi.string().trim().min(7),
    isAdmin:   Joi.bool(),
  });
  return schema.validate(obj);
}

function validateChangePassword(obj) {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
}

module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,    // ✅ was missing from exports
  validateChangePassword,
};