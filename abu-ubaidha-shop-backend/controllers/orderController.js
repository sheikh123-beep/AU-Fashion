import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ================= CREATE ORDER =================

export const createOrder = async (req, res) => {
  try {
    const {
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // =========================
    // CHECK REQUIRED FIELDS
    // =========================

    if (
      !products ||
      products.length === 0 ||
      !totalAmount ||
      !shippingAddress
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all order details",
      });
    }

    // =========================
    // VALIDATE PRODUCTS
    // =========================

    for (const item of products) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: "Product ID is missing",
        });
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${item.name}`,
        });
      }

      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name}`,
        });
      }

      // Check current stock
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available for ${product.name}`,
        });
      }
    }

    // =========================
    // REDUCE STOCK
    // =========================

    for (const item of products) {
      const quantity = Number(item.quantity);

      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: quantity },
          },
          {
            $inc: {
              stock: -quantity,
            },
          },
          {
            new: true,
          }
        );

      // Stock changed between validation and update
      if (!updatedProduct) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock available for ${item.name}`,
        });
      }
    }

    // =========================
    // CREATE ORDER
    // =========================

    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
    });

    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({
      success: true,
      message: "Order Created Successfully",
      order,
    });

  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET USER ORDERS =================

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error("Get My Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET SINGLE ORDER =================

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("products.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    // User can only access their own order
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("Get Order Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= GET ALL ORDERS =================

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error("Get All Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// ================= UPDATE ORDER STATUS =================

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order Status Updated Successfully",
      order,
    });

  } catch (error) {
    console.error("Update Order Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};