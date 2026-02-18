const mongoose = require("mongoose");
const Joi = require("joi");

// ✅ لا يوجد require لنفس الملف هنا

const AuthorSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    image: {
      type: String,
      required: false,
      default: "default-avatar.png",
    },
  },
  {
    timestamps: true,
  },
);

function validateCreateAuthor(obj) {
  const schema = Joi.object({
    firstname: Joi.string().trim().min(3).max(100).required(),
    lastname: Joi.string().trim().min(3).max(100).required(),
    nationality: Joi.string().trim().min(3).max(100).required(),
    image: Joi.string(),
  });
  return schema.validate(obj);
}

function validateUpdateInfoAuthor(obj) {
  const schema = Joi.object({
    firstname: Joi.string().trim().min(3).max(100),
    lastname: Joi.string().trim().min(3).max(100),
    nationality: Joi.string().trim().min(3).max(100),
    image: Joi.string(),
  });
  return schema.validate(obj);
}

const Author = mongoose.model("Author", AuthorSchema);
module.exports = { Author, validateCreateAuthor, validateUpdateInfoAuthor };
