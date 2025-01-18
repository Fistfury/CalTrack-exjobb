import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Header } from "./components/Header";
import { JSX } from "react";
import { useUser } from "./hooks/useUser";
import { UserProvider } from "./context/UserContext";
import { Footer } from "./components/Footer";
import "./i18n";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </UserProvider>
  );
};

export default App;
