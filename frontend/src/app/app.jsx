import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import AuthProvider from "../features/auth/context/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}