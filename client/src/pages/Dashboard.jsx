import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    banner: "",
    capacity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user?.role === "organizer") {
      fetchMyEvents();
    } else {
      fetchRegisteredEvents();
    }
  }, [user]);

  const fetchMyEvents = async () => {
    try {
      const res = await API.get("/events");
      setMyEvents(res.data.data.filter((e) => e.createdBy === user._id));
    } catch (error) {
      toast.error("Failed to load events");
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(
        res.data.data.filter((e) =>
          e.registeredUsers?.some((entry) => {
            const entryUserId =
              typeof entry.user === "string" ? entry.user : entry.user?._id;
            return entryUserId === user._id;
          })
        )
      );
    } catch (error) {
      toast.error("Failed to load events");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await API.post("/events", {
        ...formData,
        capacity: Number(formData.capacity),
      });
      toast.success("Event created!");
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        banner: "",
        capacity: 1,
      });
      fetchMyEvents();
    } catch (error) {
      toast.error("Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await API.delete(`/events/${id}`);
      toast.success("Event deleted");
      fetchMyEvents();
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (!user) return <div className="text-center p-6">Please login</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {user.role === "organizer" ? (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Create New Event</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="url"
                name="banner"
                placeholder="Banner Image URL"
                value={formData.banner}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
              <input
                type="number"
                name="capacity"
                min="1"
                placeholder="Capacity"
                value={formData.capacity}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                disabled={creating}
              >
                {creating ? "Creating..." : "Create Event"}
              </button>
            </form>
          </div>

          <h2 className="text-2xl font-semibold mb-4">My Events</h2>
          {myEvents.length === 0 ? (
            <p>No events created yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myEvents.map((event) => (
                <div key={event._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.location}</p>
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <Link
                      to={`/events/${event._id}`}
                      className="bg-blue-600 text-white px-4 py-1 rounded"
                    >
                      View
                    </Link>

                    {/* ✅ NEW BUTTON */}
                    <Link
                      to={`/events/${event._id}/attendees`}
                      className="bg-green-600 text-white px-4 py-1 rounded"
                    >
                      Manage Attendees
                    </Link>

                    <button
                      onClick={() => handleDelete(event._id)}
                      className="bg-red-600 text-white px-4 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">My Registered Events</h2>
          {events.length === 0 ? (
            <p>No registered events.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div key={event._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p>{new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.location}</p>
                  <Link
                    to={`/events/${event._id}`}
                    className="bg-blue-600 text-white px-4 py-1 rounded mt-2 inline-block"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
