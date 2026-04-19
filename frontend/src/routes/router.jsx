import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import { RootLayout } from "../layouts/RootLayout.jsx";
import { HomePage } from "../pages/HomePage.jsx";
import { LoginPage } from "../pages/LoginPage.jsx";
import { RegisterPage } from "../pages/RegisterPage.jsx";
import { VehicleListingPage } from "../pages/VehicleListingPage.jsx";
import { BookingPage } from "../pages/BookingPage.jsx";
import { CustomerDashboardPage } from "../pages/CustomerDashboardPage.jsx";
import { AdminDashboardPage } from "../pages/AdminDashboardPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RootLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
          { path: "vehicles", element: <VehicleListingPage /> },
          { path: "bookings/new", element: <BookingPage /> },
          { path: "dashboard", element: <CustomerDashboardPage /> },
          { path: "admin", element: <AdminDashboardPage /> }
        ]
      }
    ]
  }
]);

