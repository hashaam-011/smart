import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  totalPrice: number;
}

const cartItemSchema: Schema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema: Schema = new Schema({
  userId: { type: String, required: true, unique: true },
  items: [cartItemSchema],
  totalPrice: { type: Number, required: true, default: 0 },
});

export default mongoose.model<ICart>('Cart', cartSchema);