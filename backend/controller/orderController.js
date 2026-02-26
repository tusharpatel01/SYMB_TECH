import { validationResult } from "express-validator";
import Order from "../models/Order.js";

/* ==================================
   Helper: Validation Checker
================================== */
const checkValidation = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: errors.array()[0].msg,
    });
  }

  return true;
};

/* ==================================
   GET All Orders
   Supports filtering by:
   - isPaid
   - maxDistance
================================== */
export const getAllOrders = async (req, res, next) => {
  try {
    const { isPaid, maxDistance } = req.query;
    const filter = {};

    // Filter by payment status
    if (isPaid !== undefined && isPaid !== "") {
      if (isPaid !== "true" && isPaid !== "false") {
        return res.status(400).json({
          success: false,
          error: 'isPaid must be "true" or "false"',
        });
      }

      filter.isPaid = isPaid === "true";
    }

    // Filter by distance
    if (maxDistance !== undefined && maxDistance !== "") {
      const distance = parseFloat(maxDistance);

      if (isNaN(distance) || distance <= 0) {
        return res.status(400).json({
          success: false,
          error: "maxDistance must be a positive number",
        });
      }

      filter.deliveryDistance = { $lte: distance };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (err) {
    next(err);
  }
};

/* ==================================
   GET Single Order
================================== */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (err) {
    next(err);
  }
};

/* ==================================
   CREATE New Order
================================== */
export const createOrder = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const { orderId, restaurantName, itemCount, isPaid, deliveryDistance } =
      req.body;

    const normalizedId = orderId.trim().toUpperCase();

    // Prevent duplicate orderId
    const existingOrder = await Order.findOne({ orderId: normalizedId });

    if (existingOrder) {
      return res.status(409).json({
        success: false,
        error: `Order ID "${normalizedId}" already exists`,
      });
    }

    const newOrder = await Order.create({
      orderId: normalizedId,
      restaurantName: restaurantName.trim(),
      itemCount: Number(itemCount),
      isPaid: isPaid ?? false,
      deliveryDistance: Number(deliveryDistance),
      isAssigned: false, // explicitly set
    });

    res.status(201).json({
      success: true,
      order: newOrder,
    });

  } catch (err) {
    next(err);
  }
};

/* ==================================
   UPDATE Order (Partial)
================================== */
export const updateOrder = async (req, res, next) => {
  try {
    const allowedFields = [
      "isPaid",
      "restaurantName",
      "itemCount",
      "deliveryDistance",
      "isAssigned",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        success: false,
        error: "No valid fields provided for update",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order: updatedOrder,
    });

  } catch (err) {
    next(err);
  }
};

/* ==================================
   DELETE Order
================================== */
export const deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Order #${deletedOrder.orderId} deleted successfully`,
    });

  } catch (err) {
    next(err);
  }
};

/* ==================================
   ASSIGN DELIVERY (Realistic Logic)
   - Not already assigned
   - Within maxDistance
   - Nearest order gets priority
   - Atomic update (safe)
================================== */
export const assignDelivery = async (req, res, next) => {
  try {
    if (!checkValidation(req, res)) return;

    const maxDistance = Number(req.body.maxDistance);

    if (!maxDistance || maxDistance <= 0) {
      return res.status(400).json({
        success: false,
        error: "maxDistance must be a positive number",
      });
    }

    // Atomic assignment to prevent race conditions
    const nearestOrder = await Order.findOneAndUpdate(
      {
        isAssigned: false,
        deliveryDistance: { $lte: maxDistance },
      },
      { $set: { isAssigned: true } },
      {
        new: true,
        sort: { deliveryDistance: 1 }, // nearest first
      }
    );

    if (!nearestOrder) {
      return res.status(200).json({
        success: true,
        assigned: false,
        message: "No order available",
      });
    }

    res.status(200).json({
      success: true,
      assigned: true,
      message: `Delivery assigned to Order #${nearestOrder.orderId}`,
      order: nearestOrder,
    });

  } catch (err) {
    next(err);
  }
};