import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    match: [/^[a-zA-Z0-9\s]+$/, "Please enter a valid title"]
  },
  description: {
    type: String,
    required: true,
    trim: true,
    match: [/^[a-zA-Z0-9\s]+$/, "Please enter a valid description"]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;