import { motion } from "framer-motion";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/vehicles", label: "Vehicles" },
  { to: "/dashboard", label: "Customer" },
  { to: "/admin", label: "Admin" }
];

export function RootLayout() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            WheelCheck
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm transition-colors ${isActive ? "text-ink" : "text-muted hover:text-ink"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm text-muted sm:inline">{user?.fullName}</span>
                <button onClick={logout} className="rounded-full border border-line px-4 py-2 text-sm font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-muted transition hover:text-ink">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Create account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <Outlet />
      </motion.main>
    </div>
  );
}
