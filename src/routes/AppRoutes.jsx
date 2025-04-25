import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/Login";
import Profile from "../pages/Profile";
import ResetPassword from "../pages/ResetPassword";
import Register from "../pages/Register";
import Library from "../pages/Library";
import Movies from "../pages/Movies";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ROTAS PÚBLICAS */}
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Movies />} />
        {/* outras rotas publicas */}
      </Route>

      {/* ROTAS PRIVADAS */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/library" element={<Library />} />
        {/* outras rotas protegidas */}
      </Route>
    </Routes>
  );
}
