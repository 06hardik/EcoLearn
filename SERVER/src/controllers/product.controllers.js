import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.status(200).json(products);
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
});

export {
    getAllProducts,
    getProductById,
};