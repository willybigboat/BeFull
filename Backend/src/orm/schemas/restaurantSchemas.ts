import { model, Schema } from "mongoose";
import { restaurant } from "../../interfaces/restaurant";

export const restaurantSchemas = new Schema<restaurant>({
    name: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, required: true },
    location: { type: String, required: true },
});

export const restaurantModel = model<restaurant>('restaurants', restaurantSchemas);
