import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PenLine,
  BarChart3,
  User,
  CalendarDays,
  Target,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: Props) {
  const location = useLocation();

  const navItems = [
    { to: "/", icon: <LayoutDashboard />, label: "Dashboard" },
    { to: "/track", icon: <PenLine />, label: "Track Day" },
    { to: "/history", icon: <BarChart3 />, label: "History" },
    { to: "/calendar", icon: <CalendarDays />, label: "Calendar" },
    { to: "/goals", icon: <Target />, label: "Goals" },
    { to: "/predict", icon: <Sparkles />, label: "AI Insights" },
    { to: "/weekly", icon: <TrendingUp />, label: "Weekly Report" },
  ];

  return (
    <div
      className={`h-full bg-[#020617]/80 backdrop-blur-xl border-r border-white/10
      transition-all duration-300 flex flex-col justify-between
      ${isOpen ? "w-64 p-5" : "w-16 p-3"}`}
    >
      {/* LOGO */}
      <div>
        <h2 className="text-xl font-bold mb-8 text-center tracking-wide">
          {isOpen ? (
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              AI LIFE
            </span>
          ) : (
            <Sparkles className="mx-auto text-indigo-400" />
          )}
        </h2>

        {/* NAV */}
        <nav className="space-y-2 relative">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300
                ${
                  isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {/* 🔥 MOVING INDICATOR */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 h-full w-1 flex items-center"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    <div className="h-5 w-1 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
                  </motion.div>
                )}

                {/* BACKGROUND GLOW */}
                {isActive && (
                  <motion.div
                    layoutId="activeBg"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  />
                )}

                {/* ICON */}
                <span className="w-5 h-5">{item.icon}</span>

                {/* LABEL */}
                {isOpen && (
                  <span className="text-sm font-medium tracking-wide">
                    {item.label}
                  </span>
                )}

                {/* TOOLTIP */}
                {!isOpen && (
                  <span className="absolute left-14 bg-black text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* PROFILE */}
      <div>
        <NavLink
          to="/profile"
          className="relative flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5"
        >
          <span className="w-5 h-5">
            <User />
          </span>
          {isOpen && <span className="text-sm">Profile</span>}
        </NavLink>
      </div>
    </div>
  );
}
