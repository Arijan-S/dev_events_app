import Image from "next/image";
import { IEvent } from "@/database";
import BookEvent from "./BookEvent";
import EventCard from "./EventCard";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface EventDetailsProps {
  slug: string;
}

async function EventDetails({ slug }: EventDetailsProps) {
  const response = await fetch(`${BASE_URL}/api/events/${slug}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return (
      <div className="text-center mt-10">
        <p className="text-light-200 text-lg">Event not found.</p>
      </div>
    );
  }

  const { event } = await response.json();
  const eventData = event as IEvent;

  // Fetch related events
  const relatedEvents = await getSimilarEventsBySlug(slug);

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    try {
      // If it's already in a readable format, return as is
      if (
        timeString.includes("AM") ||
        timeString.includes("PM") ||
        timeString.includes(":")
      ) {
        return timeString;
      }
      // Otherwise format from HH:MM
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    } catch {
      return timeString;
    }
  };

  return (
    <section id="event">
      <div className="header">
        <h1>{eventData.title}</h1>
        <div className="flex flex-wrap gap-2">
          {eventData.tags?.map((tag, index) => (
            <span key={index} className="pill">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex-row-gap-2">
          <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
          <p>{eventData.location}</p>
        </div>
      </div>

      <div className="details">
        <div className="content">
          <Image
            src={eventData.image}
            alt={eventData.title}
            width={800}
            height={457}
            className="banner"
          />

          <div>
            <h2>Overview</h2>
            <p>{eventData.overview}</p>
          </div>

          <div>
            <h2>Description</h2>
            <p>{eventData.description}</p>
          </div>

          <div className="flex-col-gap-2">
            <h2>Event Details</h2>
            <div className="flex-row-gap-2">
              <Image
                src="/icons/calendar.svg"
                alt="date"
                width={14}
                height={14}
              />
              <p>{formatDate(eventData.date)}</p>
            </div>
            <div className="flex-row-gap-2">
              <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
              <p>{formatTime(eventData.time)}</p>
            </div>
            <div className="flex-row-gap-2">
              <Image src="/icons/pin.svg" alt="venue" width={14} height={14} />
              <p>{eventData.venue}</p>
            </div>
            <div className="flex-row-gap-2">
              <Image src="/icons/mode.svg" alt="mode" width={14} height={14} />
              <p className="capitalize">{eventData.mode}</p>
            </div>
            <div className="flex-row-gap-2">
              <Image
                src="/icons/audience.svg"
                alt="audience"
                width={14}
                height={14}
              />
              <p>{eventData.audience}</p>
            </div>
            <div className="flex-row-gap-2">
              <p className="font-semibold">Organizer:</p>
              <p>{eventData.organizer}</p>
            </div>
          </div>

          {eventData.agenda && eventData.agenda.length > 0 && (
            <div className="agenda">
              <h2>Agenda</h2>
              <ul>
                {eventData.agenda.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {eventData._id ? (
              <BookEvent
                eventId={
                  typeof eventData._id === "string"
                    ? eventData._id
                    : String(eventData._id)
                }
                slug={eventData.slug}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* Related Events Section */}
      {relatedEvents && relatedEvents.length > 0 && (
        <div className="mt-20 space-y-7">
          <h3>Related Events</h3>
          <ul className="events">
            {relatedEvents.slice(0, 6).map((relatedEvent) => {
              const eventId = relatedEvent._id
                ? typeof relatedEvent._id === "string"
                  ? relatedEvent._id
                  : String(relatedEvent._id)
                : relatedEvent.title;
              return (
                <li className="list-none" key={eventId}>
                  <EventCard {...relatedEvent} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

export default EventDetails;
