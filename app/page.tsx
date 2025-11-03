import { Suspense } from "react";
import ExploreBtn from "@/components/ExploreBtn";
import EventsList from "@/components/EventsList";

const page = async () => {
  return (
    <section>
      <h1 className="text-center">
        The Hub For Every Dev <br /> Event You Can't Miss
      </h1>

      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div id="events" className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <Suspense
          fallback={<div className="text-center mt-5">Loading events...</div>}
        >
          <EventsList limit={9} />
        </Suspense>
      </div>
    </section>
  );
};

export default page;
