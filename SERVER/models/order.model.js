import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: { // Price at the time of purchase
      type: Number,
      required: true,
    },
  }],
  totalAmount: { // Before discount
    type: Number,
    required: true,
  },
  pointsUsed: {
    type: Number,
    default: 0,
  },
  finalAmount: { // After discount
    type: Number,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

// Pre-save hook to calculate finalAmount
orderSchema.pre('save', function(next) {
  // Assuming 1 point = $0.10 discount, adjust as needed
  const discountAmount = this.pointsUsed * 0.10;
  this.finalAmount = this.totalAmount - discountAmount;
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;