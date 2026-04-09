import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Eventify</h2>
            <p className="mt-4 text-slate-400">
              Your hub for local events, tickets, and unforgettable experiences.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-slate-400">
              <li>
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-4 text-slate-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-blue-500" />
                <span>123 Event Street, Cityville</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500" />
                <span>support@eventify.com</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-blue-500" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">Stay connected</h3>
            <p className="mt-4 text-slate-400">
              Follow us for news, event updates, and exclusive offers.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="rounded-full bg-slate-800 p-3 text-slate-300 hover:bg-blue-600 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="rounded-full bg-slate-800 p-3 text-slate-300 hover:bg-blue-600 hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="rounded-full bg-slate-800 p-3 text-slate-300 hover:bg-blue-600 hover:text-white">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-500">
          © 2026 Eventify. All rights reserved. Built for seamless event discovery.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
