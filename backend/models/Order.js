import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    restaurantName: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
      maxlength: [100, 'Restaurant name cannot exceed 100 characters'],
    },
    itemCount: {
      type: Number,
      required: [true, 'Item count is required'],
      min: [1, 'Item count must be at least 1'],
      validate: {
        validator: Number.isInteger,
        message: 'Item count must be a whole number',
      },
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    deliveryDistance: {
      type: Number,
      required: [true, 'Delivery distance is required'],
      min: [0.1, 'Delivery distance must be greater than 0'],
    },
    isAssigned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.index({ isPaid: 1, isAssigned: 1, deliveryDistance: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;