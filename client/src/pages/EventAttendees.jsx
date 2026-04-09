import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

const EventAttendees = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [qrToken, setQrToken] = useState("");
  const [stats, setStats] = useState(null);

  const fetchEvent = async () => {
    try {
      const [eventRes, statsRes] = await Promise.all([
        API.get(`/events/${id}`),
        API.get(`/events/${id}/stats`),
      ]);
      setEvent(eventRes.data.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error("Failed to load attendees");
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  const markAttendance = async (userId) => {
    try {
      await API.post(`/events/${id}/attendance`, { userId });
      toast.success("Marked present");
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark attendance");
    }
  };

  const handleQrCheckIn = async (e) => {
    e.preventDefault();
    if (!qrToken.trim()) {
      toast.error("Paste scanned QR token first");
      return;
    }
    try {
      await API.post(`/events/${id}/checkin`, { qrToken: qrToken.trim() });
      toast.success("QR check-in successful");
      setQrToken("");
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || "QR check-in failed");
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

      <p className="mb-4">
        Total Registered: {event.registeredUsers.length}
      </p>

      <p className="mb-6">
        Attended:{" "}
        {
          event.registeredUsers.filter((u) => u.attended).length
        }
      </p>
      {stats && (
        <div className="mb-6 rounded-lg bg-slate-100 p-4">
          <p><strong>Capacity:</strong> {stats.capacity}</p>
          <p><strong>Remaining Seats:</strong> {stats.remainingSlots}</p>
          <p><strong>Not Attended Yet:</strong> {stats.notAttendedYet}</p>
        </div>
      )}
      <form onSubmit={handleQrCheckIn} className="mb-6">
        <label className="block mb-2 font-semibold">
          QR Check-in (paste scanned QR token)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Paste QR token here"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Check In
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {event.registeredUsers.map((attendee) => (
          <div
            key={attendee.user._id}
            className="border p-4 rounded-lg flex justify-between items-center"
          >
            <span>{attendee.user.name}</span>

            {attendee.attended ? (
              <span className="text-green-600 font-semibold">
                Attended
              </span>
            ) : (
              <button
                onClick={() => markAttendance(attendee.user._id)}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Mark Present
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventAttendees;