import { RequestHandler } from 'express';
import Order, { IOrder } from '../models/Order';

// User Order History
export const getUserOrders: RequestHandler = async (req, res) => {
  const { userId } = (req as any).user;

  try {
    const orders = await Order.find({ userId }).sort({ timestamp: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin View All Orders (with user filter)
export const getAllOrders: RequestHandler = async (req, res) => {
  const { userId } = req.query;
  const query = userId ? { userId } : {};

  try {
    const orders = await Order.find(query).sort({ timestamp: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};