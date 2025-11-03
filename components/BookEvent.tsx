"use client";

import { useState } from "react";
import { createBooking } from "@/lib/actions/booking.actions";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { success, error: bookingError } = await createBooking({
        eventId,
        email,
      });

      if (success) {
        setSubmitted(true);
      } else {
        setError(bookingError || "Failed to book event. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="book-event">
      {submitted ? (
        <div className="text-center">
          <p className="text-light-100 text-lg font-semibold mb-2">
            Thank you for signing up!
          </p>
          <p className="text-light-200 text-sm">
            We'll send you more details about the event soon.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="text-light-100 font-semibold mb-2 block"
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              required
              placeholder="Enter your email address"
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-foreground w-full"
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Book Your Spot"}
          </button>
        </form>
      )}
    </div>
  );
};
export default BookEvent;
