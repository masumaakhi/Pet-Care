import React, { useMemo, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import {
  FaHome,
  FaHeart,
  FaAmbulance,
  FaDonate,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaConciergeBell,
  FaUsers,
} from "react-icons/fa";

import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { name: "Home", path: "/", icon: <FaHome /> },
  { name: "Adopt", path: "/adopt", icon: <FaHeart /> },
  { name: "Rescue", path: "/rescue", icon: <FaAmbulance /> },
  { name: "Services", path: "/services", icon: <FaConciergeBell /> },
  { name: "Community", path: "/community", icon: <FaUsers /> },
  { name: "Donate", path: "/donate", icon: <FaDonate /> },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { isAuthed, user } = useAuth();

  const mobileBottomItems = useMemo(() => {
    return [
      { name: "Home", path: "/", icon: <FaHome /> },
      { name: "Adopt", path: "/adopt", icon: <FaHeart /> },
      { name: "Rescue", path: "/rescue", icon: <FaAmbulance /> },
      { name: "Donate", path: "/donate", icon: <FaDonate /> },
      { name: "Menu", type: "menu" },
    ];
  }, []);

  const mobileTopProfile = useMemo(() => {
    return isAuthed
      ? { name: "Profile", path: "/profile" }
      : { name: "Profile", path: "/login" };
  }, [isAuthed]);

  const tabletDrawerItems = useMemo(() => {
    const authItems = isAuthed
      ? [
          { name: "Profile", path: "/profile", icon: <FaUserCircle /> },
          { name: "My Donations", path: "/donations", icon: <FaDonate /> },
        ]
      : [
          { name: "Login", path: "/login", icon: <FaSignInAlt /> },
          { name: "Register", path: "/register", icon: <FaUserPlus /> },
        ];

    return [...navItems, ...authItems];
  }, [isAuthed]);

  const mobileDrawerItems = useMemo(() => {
    return [
      { name: "Community", path: "/community", icon: <FaUsers /> },
      { name: "Services", path: "/services", icon: <FaConciergeBell /> },
    ];
  }, []);

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleMenu = () => setOpen((v) => !v);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 pt-4">
          <div className="rounded-3xl px-3 sm:px-6 py-2 flex items-center justify-between backdrop-blur-md shadow-sm bg-white/45 border border-white/40">
            <NavLink to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-softGreen shadow-sm">
                <img src={logo} alt="Pet-Care Logo" className="h-10 w-10" />
              </div>
              <span className="text-2xl font-semibold text-primary">
                Pet-Care
              </span>
            </NavLink>

            <div className="hidden md:flex flex-1 items-center">
              <div className="mx-auto">
                <ul className="flex items-center gap-4 lg:gap-6 text-base lg:text-lg text-black whitespace-nowrap">
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
              </div>

              <div className="ml-auto flex items-center gap-3 lg:gap-4 text-base lg:text-lg font-medium whitespace-nowrap shrink-0">
                {isAuthed ? (
                  <>
                    <NavLink
                      to="/donations"
                      className="text-black hover:text-primary transition"
                    >
                      My Donations
                    </NavLink>

                    <NavLink
                      to="/profile"
                      className="rounded-full bg-primary px-4 lg:px-5 py-2 text-white shadow-soft hover:bg-primary/90 transition"
                    >
                      {user?.fullName ? user.fullName.split(" ")[0] : "Profile"}
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/login"
                      className="text-black hover:text-primary transition"
                    >
                      Login
                    </NavLink>

                    <NavLink
                      to="/register"
                      className="rounded-full bg-primary px-4 lg:px-5 py-2 text-white shadow-soft hover:bg-primary/90 transition"
                    >
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <NavLink
                to={mobileTopProfile.path}
                className="inline-flex sm:hidden h-9 w-9 items-center justify-center rounded-full border border-emerald-100 bg-white/70 backdrop-blur-xl text-primary shadow-sm"
                aria-label="Profile"
              >
                <FaUserCircle className="text-xl" />
              </NavLink>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="hidden sm:inline-flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-emerald-100 bg-white text-primary shadow-sm"
                aria-label="Open menu"
              >
                <FiMenu className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <div className="absolute inset-0" onClick={() => setOpen(false)} />

          <div className="absolute left-0 right-0 bottom-[5.4rem]">
            <div className="mx-auto max-w-8xl px-4">
              <div className="rounded-3xl bg-white/55 backdrop-blur-2xl border border-white/45 shadow-2xl overflow-hidden">
                <div className="px-4 pt-3 pb-2">
                  <div className="mx-auto h-1.5 w-12 rounded-full bg-black/10" />
                </div>

                <div className="px-4 pb-4">
                  <div className="grid grid-cols-1 gap-2">
                    {mobileDrawerItems.map((it) => (
                      <DrawerLink
                        key={it.path}
                        to={it.path}
                        icon={it.icon}
                        label={it.name}
                      />
                    ))}

                    {isAuthed ? (
                      <>
                        <DrawerLink
                          to="/profile"
                          icon={<FaUserCircle />}
                          label="Profile"
                        />
                        <DrawerLink
                          to="/donations"
                          icon={<FaDonate />}
                          label="My Donations"
                        />
                      </>
                    ) : (
                      <>
                        <DrawerLink
                          to="/login"
                          icon={<FaSignInAlt />}
                          label="Login"
                        />
                        <DrawerLink
                          to="/register"
                          icon={<FaUserPlus />}
                          label="Register"
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] hidden sm:block md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white/65 backdrop-blur-2xl border-l border-white/40 shadow-2xl">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-softGreen flex items-center justify-center">
                  <img src={logo} alt="Pet-Care" className="h-9 w-9" />
                </div>
                <div>
                  <div className="font-bold text-[#2f3e2c]">Pet-Care</div>
                  <div className="text-xs text-[#6b7d67]">Menu</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 w-10 rounded-2xl bg-white/70 border border-white/50 flex items-center justify-center"
                aria-label="Close menu"
              >
                <FiX className="text-xl text-[#2f3e2c]" />
              </button>
            </div>

            <div className="px-4 pb-4">
              <div className="grid grid-cols-1 gap-2">
                {tabletDrawerItems.map((it) => (
                  <DrawerLink
                    key={`${it.name}-${it.path}`}
                    to={it.path}
                    icon={it.icon}
                    label={it.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0 z-[70] sm:hidden">
        <div className="mx-auto max-w-8xl px-4 pb-3">
          <div className="rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/45 shadow-lg px-2 py-2">
            <div className="flex items-center justify-between">
              {mobileBottomItems.map((it) =>
                it.type === "menu" ? (
                  <button
                    key={it.name}
                    type="button"
                    onClick={toggleMenu}
                    className={`flex-1 min-w-0 flex flex-col items-center justify-center py-2 rounded-2xl transition ${
                      open
                        ? "bg-primary/15 text-primary"
                        : "text-[#2f3e2c] hover:bg-white/60"
                    }`}
                    aria-label={open ? "Close menu" : "Open menu"}
                  >
                    <span className="text-xl">{open ? <FiX /> : <FiMenu />}</span>
                    <span className="text-[11px] mt-1">
                      {open ? "Close" : "Menu"}
                    </span>
                  </button>
                ) : (
                  <BottomLink
                    key={it.name}
                    to={it.path}
                    icon={it.icon}
                    label={it.name}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden h-0" />
    </>
  );
}

function DrawerLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 border transition ${
          isActive
            ? "bg-primary/15 border-primary/30 text-primary font-semibold"
            : "bg-white/55 border-white/40 text-[#2f3e2c] hover:bg-white/70"
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[15px]">{label}</span>
    </NavLink>
  );
}

function BottomLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex-1 min-w-0 flex flex-col items-center justify-center py-2 rounded-2xl transition ${
          isActive
            ? "bg-primary/15 text-primary"
            : "text-[#2f3e2c] hover:bg-white/60"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      <span className="text-[11px] mt-1">{label}</span>
    </NavLink>
  );
}