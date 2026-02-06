import { FiMenu } from "react-icons/fi";
import logo from "../assets/logo.png"

export default function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="rounded-3xl px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-softGreen shadow-sm">
              <img
                src={logo}
                alt="Pet-Care Logo"
                className="h-10 w-10"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-semibold text-primary">
                Pet-Care
              </span>
            </div>
          </div>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-6 text-md text-lg font-5px  text-black">
            {["Home", "Adopt", "Rescue", "Services", "Community", "Donate"].map(
              (item) => (
                <li
                  key={item}
                  className="cursor-pointer transition hover:text-primary"
                >
                  {item}
                </li>
              )
            )}
          </ul>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4 text-lg font-medium">
            <button className="text-black hover:text-primary transition">
              Login
            </button>
            <button className="rounded-full bg-primary px-5 py-2 text-white shadow-soft hover:bg-primary/90 transition">
              Register
            </button>
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
