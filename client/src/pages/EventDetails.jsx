import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import * as QR from "react-qr-code";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [stats, setStats] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const QRComponent = QR.QRCode || QR.default;

  const getEntryUserId = (entry) =>
    typeof entry?.user === "string" ? entry.user : entry?.user?._id;

  useEffect(() => {
    const fetchMyTicket = async () => {
      if (!user) return;
      try {
        const ticketRes = await API.get(`/events/${id}/my-ticket`);
        setTicket(ticketRes.data);
      } catch {
        setTicket(null);
      }
    };

    const fetchEvent = async () => {
      try {
        const res = await API.get(`/events/${id}`);
        const eventData = res.data.data;
        setEvent(eventData);

        if (user) {
          const myEntry = eventData?.registeredUsers?.find(
            (entry) => getEntryUserId(entry) === user._id
          );
          if (myEntry) {
            await fetchMyTicket();
          } else {
            setTicket(null);
          }
        }
      } catch {
        toast.error("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      if (!user) return;
      try {
        const statsRes = await API.get(`/events/${id}/stats`);
        setStats(statsRes.data);
      } catch {
        setStats(null);
      }
    };

    fetchEvent();
    fetchStats();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      toast.error("Please login to register");
      return;
    }
    setRegistering(true);
    try {
      const registerRes = await API.post(`/events/${id}/register`);
      toast.success("Registered successfully!");
      if (registerRes?.data?.ticket) setTicket(registerRes.data.ticket);
      // Refresh event to update registered users
      const res = await API.get(`/events/${id}`);
      const refreshedEvent = res.data.data;
      setEvent(refreshedEvent);
      const myEntry = refreshedEvent?.registeredUsers?.find(
        (entry) => getEntryUserId(entry) === user._id
      );
      if (myEntry) {
        try {
          const ticketRes = await API.get(`/events/${id}/my-ticket`);
          setTicket(ticketRes.data);
        } catch {
          setTicket(registerRes?.data?.ticket || null);
        }
      }
      try {
        const statsRes = await API.get(`/events/${id}/stats`);
        setStats(statsRes.data);
      } catch {
        // Keep UI functional even if stats endpoint fails for some users.
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setRegistering(false);
    }
  };

  const isRegistered =
    !!user &&
    !!event?.registeredUsers?.some((entry) => getEntryUserId(entry) === user._id);

  const addToCalendar = () => {
    const startDate = new Date(event.date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const endDate = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"; // Assume 2 hours
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    window.open(url, "_blank");
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!event) return <div className="text-center p-6">Event not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <img
        src={event.banner || "https://via.placeholder.com/800x400"}
        alt={event.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="text-gray-600 mb-4">{event.description}</p>
      <p className="mb-2"><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p className="mb-2"><strong>Location:</strong> {event.location}</p>
      <p className="mb-2"><strong>Category:</strong> {event.category}</p>
      <p className="mb-4"><strong>Registered:</strong> {event.registeredUsers?.length || 0} attendees</p>
      {user?.role === "organizer" && stats && (
        <div className="mb-4 rounded-lg bg-slate-100 p-4">
          <p><strong>Capacity:</strong> {stats.capacity}</p>
          <p><strong>Total Registered:</strong> {stats.totalRegistered}</p>
          <p><strong>Total Attended:</strong> {stats.totalAttended}</p>
          <p><strong>Remaining Seats:</strong> {stats.remainingSlots}</p>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        {!isRegistered ? (
          <button
            onClick={handleRegister}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            disabled={registering}
          >
            {registering ? "Registering..." : "Register for Event"}
          </button>
        ) : (
          <div className="text-green-600 font-semibold">You are registered!</div>
        )}
        <button
          onClick={addToCalendar}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Add to Calendar
        </button>
      </div>

      {isRegistered && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Ticket</h2>
          {ticket?.qrToken ? (
            <QRComponent value={ticket.qrToken} size={128} />
          ) : (
            <p className="text-sm text-gray-600">
              Ticket is being prepared. Please refresh in a moment.
            </p>
          )}
          {ticket?.ticketId && (
            <p className="mt-2 text-sm"><strong>Ticket ID:</strong> {ticket.ticketId}</p>
          )}
          <p className="mt-2 text-sm">Scan this QR code at the event entry.</p>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
