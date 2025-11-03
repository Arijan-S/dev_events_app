"use server";

import { Types } from "mongoose";
import Booking from "@/database/booking.model";

import connectDB from "@/lib/mongodb";

export const createBooking = async ({
  eventId,
  email,
}: {
  eventId: string;
  email: string;
}) => {
  try {
    await connectDB();

    // Convert string eventId to ObjectId
    const eventObjectId = new Types.ObjectId(eventId);

    await Booking.create({ eventId: eventObjectId, email });

    return { success: true };
  } catch (e) {
    console.error("create booking failed", e);
    return {
      success: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
};
