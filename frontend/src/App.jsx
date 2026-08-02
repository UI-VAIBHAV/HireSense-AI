import { useContext } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataContext } from "./context/DataProvider";
import MainPage from "./pages/MainPage";

function App() {
  const { user, authLoading } = useContext(DataContext);

  // Don't make any redirect decisions until we actually know the login state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/"
          element={user ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/room"
          element={user ? <MainPage /> : <Navigate to="/login" />}
        />
        {/* Catch-all: unknown routes go home (or login, if logged out) */}
        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;