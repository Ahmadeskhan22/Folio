const { required } = require("joi");
const mongoose = require("mongoose");
//onst Joi = require("joi");

//Book schama
const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 250,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },

    descripiton: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    conver: {
      type: String,
      required: true,
      enum: ["soft cover", "hard cover"],
    },
  },
  { timestamps: true },
);

//Book model
const Book = mongoose.model("Book", BookSchema);

function validateCreateBook(obj) {
  const shcema = Joi.object({
    title: Joi.string().trim().min(3).max(200).required(),
    author: Joi.string().trim().min(3).max(200).required(),
    description: Joi.string().trim().min(3).max(500).required(),
    price: Joi.number().min(0),
    cover: Joi.string().valid("soft cover", "hard cover").required(),
  });

  return shcema.validate(obj);
}

function validateUpdateBook(obj) {
  const shcema = Joi.object({
    title: Joi.string().trim().min(3).max(200),
    author: Joi.string().trim().min(3).max(200),
    description: Joi.string().trim().min(3).max(500),
    price: Joi.number().min(0),
    cover: Joi.string().valid("soft cover", "hard cover").required(),
  });
  return shcema.validate(obj);
}

module.exports = {
  Book,
  validateCreateBook,
  validateUpdateBook,
};
