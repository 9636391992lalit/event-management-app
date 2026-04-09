import { useEffect, useState } from "react";
import API from "../services/api";
import EventCard from "../components/EventCard";
import { FaSearch, FaTicketAlt, FaCalendarAlt } from "react-icons/fa";
import LocationFilter from "../components/LocationFilter";
const heroImage =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  // ✅ Format Category (UI)
  const formatCategory = (cat) =>
    cat
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // ✅ Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        const eventsData = res.data.data;

        setEvents(eventsData);
        setFilteredEvents(eventsData);

        // ✅ Normalize + Unique Categories
        const uniqueCategories = [
          ...new Set(
            eventsData
              .map((e) => e.category?.toLowerCase().trim())
              .filter((cat) => cat && cat.length > 0)
          ),
        ];
        // ✅ Extract unique locations
        const uniqueLocations = [
          ...new Set(
            eventsData
              .map((e) => e.location?.toLowerCase().trim())
              .filter((loc) => loc && loc.length > 0)
          ),
        ];
        setLocations(uniqueLocations);
        setCategories(uniqueCategories);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvents();
  }, []);

  // ✅ Combined Filtering
  useEffect(() => {
    let filtered = events;

    // 🔍 Search
    if (search) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 📂 Category
    if (category) {
      filtered = filtered.filter(
        (event) =>
          event.category &&
          event.category.toLowerCase().trim() === category
      );
    }

    // 📅 Date
    if (date) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date).toLocaleDateString("en-CA");
        return eventDate === date;
      });
    }
    // 🌍 Location Filter
    if (locationFilter) {
      filtered = filtered.filter(
        (event) =>
          event.location &&
          event.location.toLowerCase().trim() === locationFilter
      );
    }
    // 🌍 Location Filter
    setFilteredEvents(filtered);
  }, [search, category, date, events, locationFilter]);

  return (

    <div className="min-h-screen bg-slate-50">

      {/* HERO SECTION */}

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center text-white">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Discover Amazing Events
          </h1>

          {/* ✅ SEARCH BAR */}
          <div className="mx-auto mt-10 bg-white/90 p-4 rounded-2xl shadow-xl">

            {/* Responsive Grid */}
            <div className="grid gap-4 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-5">

              {/* 🔍 Search */}
              <input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* 📂 Category */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {formatCategory(cat)}
                  </option>
                ))}
              </select>

              {/* 🌍 Location (Hidden on small screens) */}
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="hidden md:block w-full rounded-xl border px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {formatCategory(loc)}
                  </option>
                ))}
              </select>

              {/* 📅 Date */}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500"
              />

              {/* ❌ Clear Button */}
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  setDate("");
                  setLocationFilter("");
                }}
                className="w-full rounded-xl bg-red-500 px-4 py-3 text-white hover:bg-red-600 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* CATEGORY BUTTONS */}


      {/* FEATURES */}
      <section className="mx-auto mt-10 max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: <FaSearch />,
              title: "Find Events",
              desc: "Explore a wide range of events easily.",
            },
            {
              icon: <FaTicketAlt />,
              title: "Easy Registration",
              desc: "Sign up for events in seconds.",
            },
            {
              icon: <FaCalendarAlt />,
              title: "Save to Calendar",
              desc: "Never miss an event again.",
            },
          ].map((item) => (
            <div key={item.title} className="bg-white p-6 rounded-3xl shadow-xl">
              <div className="mb-4 text-blue-600 text-2xl">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-slate-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <div className="flex gap-6 px-6">




        {/* RIGHT CONTENT */}

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="text-3xl font-bold mb-6">Events</h2>

          <div className="grid gap-6 md:grid-cols-3">
            {filteredEvents.length === 0 ? (
              <p className="text-center col-span-3 text-slate-500">
                No events found 😢
              </p>
            ) : (
              filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))
            )}
          </div>
        </section>


      </div>

    </div>
  );
}