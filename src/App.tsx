import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginView from "./views/LoginView";
import DashboardView from "./views/DashboardView";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginView />}
        />
        <Route
          path="/mapa"
          element={isAuthenticated ? <DashboardView /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/mapa" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
