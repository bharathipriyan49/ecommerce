const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const {
  sendOrderConfirmation,
  sendOrderStatusUpdate,
} = require("../services/telegramService");
const { sendCustomerOrderSMS } = require("../services/smsService");


// ===============================
// CREATE ORDER
// ===============================

router.post("/", async (req, res) => {
  try {
    const {
      customer,
      products,
      totalAmount,
    } = req.body;

    if (
      !customer ||
      !products ||
      products.length === 0 ||
      !totalAmount
    ) {
      return res.status(400).json({
        message: "Invalid order data",
      });
    }

    const order = new Order({
      customer,
      products,
      totalAmount,
    });

    const savedOrder = await order.save();
    await savedOrder.populate("products.product");

    try {
      await sendOrderConfirmation(savedOrder);
    } catch (notificationError) {
      console.error("Order Telegram notification error:", notificationError);
    }

    try {
      await sendCustomerOrderSMS(savedOrder);
    } catch (smsError) {
      console.error("Customer SMS notification error:", smsError);
    }

    res.status(201).json({
      message: "Order placed successfully",
      order: savedOrder,
    });

  } catch (error) {
    console.error("Order error:", error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});


// ===============================
// GET ALL ORDERS
// ===============================

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
});


// ===============================
// UPDATE ORDER STATUS
// ===============================

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await order.populate("products.product");

    try {
      await sendOrderStatusUpdate(order);
    } catch (notificationError) {
      console.error("Status Telegram notification error:", notificationError);
    }

    res.json({
      message: "Order status updated successfully",
      order,
    });

  } catch (error) {
    console.error("Status update error:", error);

    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});


module.exports = router;