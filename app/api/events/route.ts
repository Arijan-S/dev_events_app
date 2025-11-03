import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      console.error("Error parsing form data:", e);
      return NextResponse.json(
        { message: "Invalid form data format" },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );
    }

    // Parse tags and agenda with error handling
    let tags: string[] = [];
    let agenda: string[] = [];

    try {
      const tagsStr = formData.get("tags") as string;
      const agendaStr = formData.get("agenda") as string;

      if (!tagsStr || !agendaStr) {
        return NextResponse.json(
          { message: "Tags and agenda are required" },
          { status: 400 }
        );
      }

      tags = JSON.parse(tagsStr);
      agenda = JSON.parse(agendaStr);

      if (!Array.isArray(tags) || !Array.isArray(agenda)) {
        return NextResponse.json(
          { message: "Tags and agenda must be arrays" },
          { status: 400 }
        );
      }

      // Filter out empty strings
      tags = tags.filter((tag) => tag && tag.trim() !== "");
      agenda = agenda.filter((item) => item && item.trim() !== "");

      if (tags.length === 0 || agenda.length === 0) {
        return NextResponse.json(
          {
            message: "Tags and agenda must contain at least one non-empty item",
          },
          { status: 400 }
        );
      }
    } catch (e) {
      console.error("Error parsing tags/agenda:", e);
      return NextResponse.json(
        { message: "Invalid tags or agenda format" },
        { status: 400 }
      );
    }

    // Convert image to base64 data URL and store in MongoDB
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64}`;

      event.image = dataUrl;
    } catch (e) {
      console.error("Error processing image:", e);
      return NextResponse.json(
        {
          message: "Failed to process image",
          error: e instanceof Error ? e.message : "Unknown error",
        },
        { status: 500 }
      );
    }

    // Create event in database
    try {
      const createdEvent = await Event.create({
        ...event,
        tags: tags,
        agenda: agenda,
      });

      return NextResponse.json(
        { message: "Event created successfully", event: createdEvent },
        { status: 201 }
      );
    } catch (e: any) {
      console.error("Database error:", e);

      // Handle validation errors
      if (e.name === "ValidationError") {
        const validationErrors = Object.values(e.errors || {}).map(
          (err: any) => err.message
        );
        return NextResponse.json(
          { message: "Validation error", errors: validationErrors },
          { status: 400 }
        );
      }

      // Handle duplicate key error (e.g., duplicate slug)
      if (e.code === 11000) {
        return NextResponse.json(
          { message: "An event with this title already exists" },
          { status: 409 }
        );
      }

      throw e;
    }
  } catch (e) {
    console.error("Unexpected error:", e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event fetching failed", error: e },
      { status: 500 }
    );
  }
}
