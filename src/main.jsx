import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home.jsx";
import AuthProvider from "./providers/AuthProvider.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Explore from "./pages/Explore.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import AddArtwork from "./pages/AddArtwork.jsx";
import Details from "./pages/Details.jsx";
import Gallery from "./pages/Gallery.jsx";
import Favorites from "./pages/Favorites.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Contact from "./pages/Contact.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import DashboardHome from "./pages/Dashboard/DashboardHome.jsx";
import Profile from "./pages/Dashboard/Profile.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";
import DashboardAdminHome from "./pages/Dashboard/Admin/DashboardAdminHome.jsx";
import ManageUsers from "./pages/Dashboard/Admin/ManageUsers.jsx";
import ManageArts from "./pages/Dashboard/Admin/ManageArts.jsx";
import ReportedArts from "./pages/Dashboard/Admin/ReportedArts.jsx";
import AdminProfile from "./pages/Dashboard/Admin/AdminProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "art/:id",
        element: <Details />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "add-artwork",
        element: <AddArtwork />,
      },
      {
        path: "gallery",
        element: <Gallery />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      // Admin Routes
      {
        path: "admin",
        element: (
          <AdminRoute>
            <Outlet />
          </AdminRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardAdminHome />,
          },
          {
            path: "manage-users",
            element: <ManageUsers />,
          },
          {
            path: "manage-arts",
            element: <ManageArts />,
          },
          {
            path: "reported-arts",
            element: <ReportedArts />,
          },
          {
            path: "profile",
            element: <AdminProfile />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
