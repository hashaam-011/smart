import { io } from "../server"; // Import the Socket.IO instance

async function updateProductStock(productId: string, quantity: number) {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    product.stock -= quantity;
    await product.save();

    if (product.stock < 5) { // Low stossck threshold
        io.emit("lowStockAlert", { productId, name: product.name, stock: product.stock });
    }
}
