"use client";

import { useState, useEffect, useMemo } from "react";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

type SortOption = "newest" | "oldest" | "title-asc" | "title-desc";

const EventsPage = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/events`, {
          cache: "no-store",
        });
        const data = await response.json();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Get unique locations for filter
  const uniqueLocations = useMemo(() => {
    const locations = new Set(events.map((event) => event.location));
    return Array.from(locations).sort();
  }, [events]);

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query) ||
          event.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Mode filter
    if (filterMode !== "all") {
      filtered = filtered.filter((event) => event.mode === filterMode);
    }

    // Location filter
    if (filterLocation !== "all") {
      filtered = filtered.filter((event) => event.location === filterLocation);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return filtered;
  }, [events, searchQuery, sortBy, filterMode, filterLocation]);

  if (loading) {
    return (
      <main>
        <section>
          <div className="text-center mt-10">Loading events...</div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section>
        <h1 className="text-center mb-4">All Events</h1>
        <p className="text-center text-light-100 mb-10">
          Discover and explore all developer events
        </p>

        {/* Search and Filters */}
        <div className="bg-dark-100 border border-dark-200 rounded-[12px] p-6 mb-10 shadow-lg">
          {/* Search */}
          <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-light-200"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, location, or tags..."
              className="bg-dark-200 rounded-[8px] pl-12 pr-5 py-3.5 text-foreground w-full border border-dark-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-light-200 hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Mode Filter */}
            <div className="flex-1">
              <label
                htmlFor="mode"
                className="text-light-100 font-semibold text-sm mb-2 block"
              >
                Event Mode
              </label>
              <div className="relative">
                <select
                  id="mode"
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="bg-dark-200 rounded-[8px] px-4 py-3 text-foreground w-full border border-dark-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="all">All Modes</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-light-200"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Location Filter */}
            <div className="flex-1">
              <label
                htmlFor="location"
                className="text-light-100 font-semibold text-sm mb-2 block"
              >
                Location
              </label>
              <div className="relative">
                <select
                  id="location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="bg-dark-200 rounded-[8px] px-4 py-3 text-foreground w-full border border-dark-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="all">All Locations</option>
                  {uniqueLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-light-200"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="flex-1">
              <label
                htmlFor="sort"
                className="text-light-100 font-semibold text-sm mb-2 block"
              >
                Sort By
              </label>
              <div className="relative">
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-dark-200 rounded-[8px] px-4 py-3 text-foreground w-full border border-dark-200 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title-asc">Title (A-Z)</option>
                  <option value="title-desc">Title (Z-A)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-light-200"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Results count and active filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-dark-200">
            <p className="text-light-200 text-sm">
              Showing{" "}
              <span className="text-primary font-semibold">
                {filteredAndSortedEvents.length}
              </span>{" "}
              of{" "}
              <span className="text-light-100 font-semibold">
                {events.length}
              </span>{" "}
              events
            </p>
            {(searchQuery ||
              filterMode !== "all" ||
              filterLocation !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterMode("all");
                  setFilterLocation("all");
                }}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        {filteredAndSortedEvents.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-light-200 text-lg">
              No events found matching your criteria.
            </p>
          </div>
        ) : (
          <ul className="events">
            {filteredAndSortedEvents.map((event) => (
              <li
                className="list-none"
                key={event._id?.toString() || event.title}
              >
                <EventCard {...event} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default EventsPage;
