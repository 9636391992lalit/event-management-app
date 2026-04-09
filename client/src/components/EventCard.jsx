import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl transition duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img
          src={event.banner || "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=900&q=80"}
          alt={event.title}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
          {event.category || "General"}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between text-slate-500">
          <span>{new Date(event.date).toLocaleDateString()}</span>
          <span>{event.location}</span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-slate-900">{event.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {event.description?.slice(0, 110) || "No description available yet."}
        </p>
        <Link
          to={`/events/${event._id}`}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;