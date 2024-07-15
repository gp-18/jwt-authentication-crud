import ProductModel from "../models/Products.js";

const createProduct = async (req, res) => {
  const { title, description, price, rating } = req.body;
  if (!title || !description || !price || !rating) {
    return res
      .status(400)
      .json({ status: "error", message: "Please provide all required fields" });
  }
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json({ status: "success", data: product });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({});
    res.status(200).json({ status: "success", data: products });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const getParticularProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }
    res.status(200).json({ status: "success", data: product });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  const { title, description, price, rating } = req.body;
  if (!title || !description || !price || !rating) {
    return res
      .status(400)
      .json({ status: "error", message: "Please provide all required fields" });
  }
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }
    res.status(200).json({ status: "success", data: updatedProduct });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

const deleteProduct = async (req , res) =>{
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }
    res.status(200).json({ status: "success", message: "Product deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
 };



export { getAllProducts, createProduct, getParticularProduct ,updateProduct , deleteProduct};
