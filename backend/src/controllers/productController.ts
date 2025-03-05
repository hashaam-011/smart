import { RequestHandler } from 'express';
import Product, { IProduct } from '../models/Product';

// Create Product (Admin only)
export const createProduct: RequestHandler = async (req, res) => {
  const { name, description, price, stock, category } = req.body;

  try {
    const product = new Product({ name, description, price, stock, category });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get All Products (with pagination and filtering)
export const getProducts: RequestHandler = async (req, res) => {
  const { page = 1, limit = 10, category } = req.query;
  const query = category ? { category: category as string } : {};

  try {
    const products = await Product.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get Product by ID
export const getProductById: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update Product (Admin only)
export const updateProduct: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete Product (Admin only)
export const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
  app.get("/api/products/search", async (req, res) => {
    const { query } = req.query;
    const products = await Product.find({
        $or: [
            { name: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ]
    }).sort({ purchaseCount: -1 });

    res.json(products);
});

};