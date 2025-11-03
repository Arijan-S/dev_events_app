import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface EventsListProps {
  limit?: number;
}

async function EventsList({ limit }: EventsListProps = {}) {
  const response = await fetch(`${BASE_URL}/api/events`, {
    cache: "no-store", // or use 'force-cache' with revalidate if you want caching
  });
  const { events } = await response.json();

  if (!events || events.length === 0) {
    return <p className="text-center mt-5">No events found.</p>;
  }

  const displayEvents = limit ? events.slice(0, limit) : events;

  return (
    <ul className="events">
      {displayEvents.map((event: IEvent) => (
        <li className="list-none" key={event._id?.toString() || event.title}>
          <EventCard {...event} />
        </li>
      ))}
    </ul>
  );
}

export default EventsList;
