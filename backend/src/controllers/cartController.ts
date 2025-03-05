import { RequestHandler } from 'express';
import Cart, { ICart, ICartItem } from '../models/Cart';
import Product from '../models/Product';
import Order from '../models/Order';
import { v4 as uuidv4 } from 'uuid'; // Install with: npm install uuid

// Add or Update Item in Cart
export const addToCart: RequestHandler = async (req, res) => {
  const { userId } = (req as any).user;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    if (product.stock < quantity) {
      res.status(400).json({ message: 'Insufficient stock' });
      return;
    }

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name: product.name, price: product.price, quantity });
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update Quantity in Cart
export const updateCartQuantity: RequestHandler = async (req, res) => {
  const { userId } = (req as any).user;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    if (product.stock < quantity) {
      res.status(400).json({ message: 'Insufficient stock' });
      return;
    }

    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      res.status(404).json({ message: 'Item not in cart' });
      return;
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Remove Item from Cart
export const removeFromCart: RequestHandler = async (req, res) => {
  const { userId } = (req as any).user;
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Checkout
export const checkout: RequestHandler = async (req, res) => {
  const { userId } = (req as any).user;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        res.status(400).json({ message: 'Insufficient stock for ' + product?.name });
        return;
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // Create and save order
    const order = new Order({
      orderId: uuidv4(),
      userId,
      products: cart.items,
      totalPrice: cart.totalPrice,
    });
    await order.save();

    // Clear the cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ message: 'Checkout successful', orderId: order.orderId, total: cart.totalPrice });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};