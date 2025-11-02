import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * TypeScript interface for Event document
 */
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TypeScript interface for Event model
 */
export interface IEventModel extends Model<IEvent> {
  // Add any static methods here if needed in the future
}

/**
 * Generates a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Normalizes date string to ISO format
 */
function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
}

/**
 * Normalizes time string to consistent HH:MM format
 */
function normalizeTime(timeStr: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\s?(AM|PM))?$/i;
  const match = timeStr.trim().match(timeRegex);

  if (!match) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[4]?.toUpperCase();

  // Convert 12-hour to 24-hour format if period is provided
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

/**
 * Validates that required string fields are present and non-empty
 */
function validateRequiredFields(doc: IEvent): void {
  const requiredStringFields: (keyof IEvent)[] = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredStringFields) {
    const value = doc[field];
    if (!value || (typeof value === "string" && value.trim().length === 0)) {
      throw new Error(`${field} is required and cannot be empty`);
    }
  }

  // Validate arrays
  if (!doc.agenda || doc.agenda.length === 0) {
    throw new Error("agenda is required and must contain at least one item");
  }

  if (!doc.tags || doc.tags.length === 0) {
    throw new Error("tags is required and must contain at least one item");
  }
}

/**
 * Event schema definition
 */
const EventSchema: Schema<IEvent> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxLength: [500, "Description cannot exceed 500 characters"],
    },
    overview: {
      type: String,
      required: true,
      trim: true,
      maxLength: [500, "Overview cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      required: true,
    },
    audience: {
      type: String,
      required: true,
      trim: true,
    },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "agenda must be a non-empty array",
      },
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: "tags must be a non-empty array",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Pre-save hook: Generate slug, normalize date/time, and validate fields
EventSchema.pre("save", async function (next) {
  const event = this as IEvent;

  // Validate required fields
  validateRequiredFields(event);

  // Generate slug only if title is modified or slug doesn't exist
  if (event.isModified("title") || !event.slug) {
    event.slug = generateSlug(event.title);
  }

  // Normalize date to ISO format if modified
  if (event.isModified("date")) {
    event.date = normalizeDate(event.date);
  }

  // Normalize time to consistent format if modified
  if (event.isModified("time")) {
    event.time = normalizeTime(event.time);
  }

  next();
});

// Create unique index on slug for faster lookups
EventSchema.index({ slug: 1 }, { unique: true });

/**
 * Event model
 * Uses mongoose.model to leverage connection caching
 */
const Event: IEventModel =
  (mongoose.models.Event as IEventModel) ||
  mongoose.model<IEvent, IEventModel>("Event", EventSchema);

export default Event;
