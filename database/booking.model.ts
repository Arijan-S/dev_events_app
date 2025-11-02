import mongoose, { Schema, Document, Model, Types } from "mongoose";
import Event from "./event.model";

/**
 * TypeScript interface for Booking document
 */
export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TypeScript interface for Booking model
 */
export interface IBookingModel extends Model<IBooking> {
  // Add any static methods here if needed in the future
}

/**
 * Validates email format using a simple regex pattern
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Booking schema definition
 */
const BookingSchema: Schema<IBooking> = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true, // Index for faster queries by eventId
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => isValidEmail(v),
        message: (props: { value: string }) =>
          `${props.value} is not a valid email address`,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Pre-save hook: Verify that the referenced event exists
BookingSchema.pre("save", async function (next) {
  const booking = this as IBooking;

  // Validate email format
  if (!isValidEmail(booking.email)) {
    return next(new Error("Invalid email format"));
  }

  // Verify that the referenced event exists
  try {
    const event = await Event.findById(booking.eventId);
    if (!event) {
      return next(new Error(`Event with ID ${booking.eventId} does not exist`));
    }
  } catch (error) {
    return next(error instanceof Error ? error : new Error(String(error)));
  }

  next();
});

/**
 * Booking model
 * Uses mongoose.model to leverage connection caching
 */
const Booking: IBookingModel =
  (mongoose.models.Booking as IBookingModel) ||
  mongoose.model<IBooking, IBookingModel>("Booking", BookingSchema);

export default Booking;
