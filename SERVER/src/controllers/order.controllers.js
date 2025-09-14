import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
    const { items, pointsUsed } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No order items" });
    }

    const user = await User.findById(userId);
    if (pointsUsed > user.points) {
        return res.status(400).json({ message: "Not enough points" });
    }

    let totalAmount = 0;
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            return res.status(404).json({ message: `Product not found: ${item.product}` });
        }
        if (product.stock < item.quantity) {
            return res.status(400).json({ message: `Not enough stock for ${product.name}` });
        }
        totalAmount += product.price * item.quantity;
    }

    const order = new Order({
        user: userId,
        items,
        totalAmount,
        pointsUsed,
    });

    const createdOrder = await order.save();
    
    // This pre-save hook in the model will calculate the finalAmount.

    user.points -= pointsUsed;
    await user.save();

    for (const item of items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json(createdOrder);
});

const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
});

export {
    createOrder,
    getUserOrders,
};