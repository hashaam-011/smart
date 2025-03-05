import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  products: IOrderItem[];
  totalPrice: number;
  timestamp: Date;
}

const orderItemSchema: Schema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema: Schema = new Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  products: [orderItemSchema],
  totalPrice: { type: Number, required: true, min: 0 },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>('Order', orderSchema);