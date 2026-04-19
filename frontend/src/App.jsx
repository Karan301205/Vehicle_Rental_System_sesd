import { Outlet } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext.jsx";

export default function App() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
