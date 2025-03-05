import 'express';
import { JwtPayload } from '../../middleware/auth'; // Adjust path if needed

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}