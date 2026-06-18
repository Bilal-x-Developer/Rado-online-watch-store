import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },

    // Store payment method (e.g., Cash on Delivery)
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD'],
    },

    // Optional cart snapshot (so you can reconstruct order later)
    items: {
      type: Array,
      default: [],
    },

    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);

