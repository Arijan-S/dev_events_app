"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CreateEventPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agendaItems, setAgendaItems] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      // Add agenda items
      const agenda = agendaItems.filter((item) => item.trim() !== "");
      formData.append("agenda", JSON.stringify(agenda));

      // Add tags
      const tagsList = tags.filter((tag) => tag.trim() !== "");
      formData.append("tags", JSON.stringify(tagsList));

      const response = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      router.push(`/event/${data.event.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, ""]);
  };

  const removeAgendaItem = (index: number) => {
    if (agendaItems.length > 1) {
      setAgendaItems(agendaItems.filter((_, i) => i !== index));
    }
  };

  const updateAgendaItem = (index: number, value: string) => {
    const updated = [...agendaItems];
    updated[index] = value;
    setAgendaItems(updated);
  };

  const addTag = () => {
    setTags([...tags, ""]);
  };

  const removeTag = (index: number) => {
    if (tags.length > 1) {
      setTags(tags.filter((_, i) => i !== index));
    }
  };

  const updateTag = (index: number, value: string) => {
    const updated = [...tags];
    updated[index] = value;
    setTags(updated);
  };

  return (
    <main>
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6">
        <h1 className="text-center mb-6 sm:mb-8">Create New Event</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-red-200 text-sm sm:text-base">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-light-100 font-semibold text-sm sm:text-base"
            >
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base w-full"
              placeholder="Enter event title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-light-100 font-semibold text-sm sm:text-base"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              maxLength={500}
              rows={4}
              className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground resize-none text-sm sm:text-base w-full"
              placeholder="Enter event description (max 500 characters)"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="overview"
              className="text-light-100 font-semibold text-sm sm:text-base"
            >
              Overview *
            </label>
            <textarea
              id="overview"
              name="overview"
              required
              maxLength={500}
              rows={4}
              className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground resize-none text-sm sm:text-base w-full"
              placeholder="Enter event overview (max 500 characters)"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="image"
              className="text-light-100 font-semibold text-sm sm:text-base"
            >
              Event Image *
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              required
              className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base w-full file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-primary file:text-black file:cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="venue"
                className="text-light-100 font-semibold text-sm sm:text-base"
              >
                Venue *
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                required
                className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base w-full"
                placeholder="Enter venue name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="location"
                className="text-light-100 font-semibold text-sm sm:text-base"
              >
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base w-full"
                placeholder="City, State"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="date"
                className="text-light-100 font-semibold text-sm sm:text-base"
              >
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base w-full"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="time"
                className="text-light-100 font-semibold text-sm sm:text-base"
              >
                Time *
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="mode"
                className="text-light-100 font-semibold text-sm sm:text-base"
              >
                Mode *
              </label>
              <select
                id="mode"
                name="mode"
                required
                className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base w-full"
              >
                <option value="">Select mode</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="audience"
                className="text-light-100 font-semibold text-sm sm:text-base"
              >
                Audience *
              </label>
              <input
                type="text"
                id="audience"
                name="audience"
                required
                className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base w-full"
                placeholder="e.g., Developers, Students"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="organizer"
              className="text-light-100 font-semibold text-sm sm:text-base"
            >
              Organizer *
            </label>
            <input
              type="text"
              id="organizer"
              name="organizer"
              required
              className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base w-full"
              placeholder="Enter organizer name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-light-100 font-semibold text-sm sm:text-base">
              Agenda *
            </label>
            <div className="flex flex-col gap-2">
              {agendaItems.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateAgendaItem(index, e.target.value)}
                    required={index === 0}
                    className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base flex-1 w-full"
                    placeholder={`Agenda item ${index + 1}`}
                  />
                  {agendaItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(index)}
                      className="bg-red-500/20 text-red-300 px-3 sm:px-4 py-2 rounded-[6px] hover:bg-red-500/30 text-sm sm:text-base whitespace-nowrap"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAgendaItem}
                className="bg-dark-200 text-light-100 px-4 py-2 rounded-[6px] hover:bg-dark-100 w-full sm:w-fit text-sm sm:text-base"
              >
                + Add Agenda Item
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-light-100 font-semibold text-sm sm:text-base">
              Tags *
            </label>
            <div className="flex flex-col gap-2">
              {tags.map((tag, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => updateTag(index, e.target.value)}
                    required={index === 0}
                    className="bg-dark-200 rounded-[6px] px-4 sm:px-5 py-2 sm:py-2.5 text-foreground text-sm sm:text-base flex-1 w-full"
                    placeholder={`Tag ${index + 1}`}
                  />
                  {tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="bg-red-500/20 text-red-300 px-3 sm:px-4 py-2 rounded-[6px] hover:bg-red-500/30 text-sm sm:text-base whitespace-nowrap"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTag}
                className="bg-dark-200 text-light-100 px-4 py-2 rounded-[6px] hover:bg-dark-100 w-full sm:w-fit text-sm sm:text-base"
              >
                + Add Tag
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-base sm:text-lg font-semibold text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-dark-200 hover:bg-dark-100 w-full cursor-pointer items-center justify-center rounded-[6px] px-4 py-2.5 text-base sm:text-lg font-semibold text-light-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default CreateEventPage;
