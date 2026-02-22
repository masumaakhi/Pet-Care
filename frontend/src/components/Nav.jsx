import { FiMenu } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Adopt", path: "/adopt" },
  { name: "Health & Medical", path: "/health" },
  { name: "Rescue", path: "/rescue" },
  { name: "Services", path: "/services" },
  { name: "Community", path: "/community" },
  { name: "Donate", path: "/donate" },
];

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="rounded-3xl px-3 sm:px-6 py-2 flex items-center justify-between backdrop-blur-md shadow-sm">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-softGreen shadow-sm">
              <img src={logo} alt="Pet-Care Logo" className="h-10 w-10" />
            </div>
            <span className="text-2xl font-semibold text-primary">
              Pet-Care
            </span>
          </NavLink>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-6 text-lg text-black">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `transition ${
                      isActive
                        ? "text-primary font-semibold"
                        : "hover:text-primary"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4 text-lg font-medium">
            <NavLink
              to="/login"
              className="text-black hover:text-primary transition"
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="rounded-full bg-primary px-5 py-2 text-white shadow-soft hover:bg-primary/90 transition"
            >
              Register
            </NavLink>
          </div>

          {/* Mobile menu icon */}
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100 bg-white text-primary shadow-sm md:hidden">
            <FiMenu className="text-xl" />
          </button>
        </div>
      </div>
    </nav>
  );
}
