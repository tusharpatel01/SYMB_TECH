import express from "express";
import { body } from "express-validator";
import {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  assignDelivery,
} from "../controller/orderController.js";

const router = express.Router();

const validateCreateOrder = [
  body("orderId")
    .trim()
    .notEmpty()
    .withMessage("Please provide an order ID"),

  body("restaurantName")
    .trim()
    .notEmpty()
    .withMessage("Restaurant name is required")
    .isLength({ max: 100 })
    .withMessage("Restaurant name should not exceed 100 characters"),

  body("itemCount")
    .isInt({ min: 1 })
    .withMessage("Item count must be at least 1"),

  body("deliveryDistance")
    .isFloat({ min: 0.1 })
    .withMessage("Delivery distance must be greater than 0"),

  body("isPaid")
    .optional()
    .isBoolean()
    .withMessage("isPaid must be either true or false"),
];


  // Assign Delivery Validation


const validateAssignDelivery = [
  body("maxDistance")
    .isFloat({ min: 0.1 })
    .withMessage("maxDistance must be greater than 0"),
];


  // Routes
// Assign delivery partner
router.post("/assign-delivery", validateAssignDelivery, assignDelivery);

// Orders CRUD
router.get("/", getAllOrders);

router.post("/", validateCreateOrder, createOrder);

router.get("/:id", getOrderById);

router.patch("/:id", updateOrder);

router.delete("/:id", deleteOrder);

export default router;