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
    return showRegister ? (
      <Register
        onRegisterSuccess={() => setShowRegister(false)}
        goToLogin={() => setShowRegister(false)}
      />
    ) : (
      <Login setUserId={setUserId} goToRegister={() => setShowRegister(true)} />
    );
  }

  // ✅ MAIN APP
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
          <Route
            path="predict"
            element={<PredictionEngine userId={userId} />}
          />
          <Route path="weekly" element={<WeeklyReport userId={userId} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
