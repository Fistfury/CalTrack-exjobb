import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { WorkoutPage } from "./pages/WorkoutPage";
import { NutritionPage } from "./pages/NutritionPage";
import { CalendarPage } from "./pages/CalendarPage";
import { MilestonesPage } from "./pages/MilestonesPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Header } from "./components/Header";
import TestFirestore from "./components/TestFirestore";

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workouts" element={<WorkoutPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/milestones" element={<MilestonesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/testfirestore" element={<TestFirestore />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
