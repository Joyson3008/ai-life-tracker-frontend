import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";

import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import TrackDay from "./pages/TrackDay";
import History from "./pages/History";
import Profile from "./pages/Profile";
import CalendarView from "./pages/Calenderview";
import GoalTracker from "./pages/Goaltracker";
import PredictionEngine from "./pages/Predictionengine";
import WeeklyReport from "./pages/WeeklyReport";

function App() {
  const [userId, setUserId] = useState<number | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  // ✅ AUTH SCREEN
  if (!userId) {
    return (
      <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[120px] top-[-100px] left-[-100px]" />
          <div className="absolute w-[400px] h-[400px] bg-indigo-600/30 blur-[120px] bottom-[-100px] right-[-100px]" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center min-h-screen px-6">
          
          {showRegister ? (
            <Register
              onRegisterSuccess={() => setShowRegister(false)}
              goToLogin={() => setShowRegister(false)}   // ✅ FIXED
            />
          ) : (
            <Login
              setUserId={setUserId}
              goToRegister={() => setShowRegister(true)} // ✅ FIXED
            />
          )}

          {/* Toggle Text */}
          <div className="mt-6 text-center">
            {showRegister ? (
              <p
                onClick={() => setShowRegister(false)}
                className="text-sm text-gray-400 hover:text-indigo-400 cursor-pointer"
              >
                Already have an account?{" "}
                <span className="text-indigo-400 font-medium">Login</span>
              </p>
            ) : (
              <p
                onClick={() => setShowRegister(true)}
                className="text-sm text-gray-400 hover:text-indigo-400 cursor-pointer"
              >
                Don’t have an account?{" "}
                <span className="text-indigo-400 font-medium">Create one</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ✅ MAIN APP AFTER LOGIN
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard userId={userId} />} />
          <Route path="track" element={<TrackDay userId={userId} />} />
          <Route path="history" element={<History userId={userId} />} />
          <Route path="profile" element={<Profile userId={userId} />} />
          <Route path="calendar" element={<CalendarView userId={userId} />} />
          <Route path="goals" element={<GoalTracker userId={userId} />} />
          <Route path="predict" element={<PredictionEngine userId={userId} />} />
          <Route path="weekly" element={<WeeklyReport userId={userId} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
