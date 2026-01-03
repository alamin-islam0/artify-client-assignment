import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Image as ImageIcon,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Palette,
  Users,
  ShieldAlert,
  Shield,
} from "lucide-react";
import { useAuth } from "../providers/AuthProvider";
import useAdmin from "../hooks/useAdmin";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isAdmin] = useAdmin(); // Check admin status
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when route changes on mobile
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const userNavItems = [
    {
      name: "Overview",
      path: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      end: true, // Exact match for root index
    },
    {
      name: "My Gallery",
      path: "/dashboard/gallery",
      icon: <ImageIcon size={20} />,
    },
    {
      name: "Add Artwork",
      path: "/dashboard/add-artwork",
      icon: <PlusCircle size={20} />,
    },
    {
      name: "My Favorites",
      path: "/dashboard/favorites",
      icon: <Heart size={20} />,
    },
    { name: "Profile", path: "/dashboard/profile", icon: <User size={20} /> },
  ];

  const adminNavItems = [
    {
      name: "Admin Home",
      path: "/dashboard/admin",
      icon: <LayoutDashboard size={20} />,
      end: true,
    },
    {
      name: "Manage Users",
      path: "/dashboard/admin/manage-users",
      icon: <Users size={20} />,
    },
    {
      name: "Manage Arts",
      path: "/dashboard/admin/manage-arts",
      icon: <Palette size={20} />,
    },
    {
      name: "Reported Arts",
      path: "/dashboard/admin/reported-arts",
      icon: <ShieldAlert size={20} />,
    },
    {
      name: "Admin Profile",
      path: "/dashboard/admin/profile",
      icon: <Shield size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-base-200 flex font-sans text-base-content">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-base-100 shadow-xl transition-transform duration-300 ease-in-out border-r border-base-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo / Brand */}
          <div className="p-6 border-b border-base-300 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 font-montserrat font-bold text-2xl text-primary"
            >
              <Palette size={28} className="text-primary" />
              <span>Artify</span>
            </Link>
            <button
              className="lg:hidden btn btn-ghost btn-sm btn-circle"
              onClick={toggleSidebar}
            >
              <X size={20} />
            </button>
          </div>

          {/* User Info (Mini) */}
          <div className="p-6 flex items-center gap-3 border-b border-base-300/50 bg-base-100/50">
            <div className="avatar">
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user?.photoURL}
                  alt="User"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold truncate text-sm">
                {user?.displayName}
              </h3>
              <p className="text-xs text-base-content/60 truncate">
                {isAdmin ? "Administrator" : "User Dashboard"}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-6">
            {/* Admin Menu */}
            {isAdmin && (
              <div>
                <div className="px-4 mb-2 text-xs font-bold text-base-content/40 uppercase tracking-wider">
                  Admin Controls
                </div>
                <ul className="space-y-2">
                  {adminNavItems.map((item) => {
                    const isActive = item.end
                      ? location.pathname === item.path
                      : location.pathname.startsWith(item.path);
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                            isActive
                              ? "bg-primary text-primary-content font-medium shadow-md shadow-primary/20"
                              : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
                          }`}
                        >
                          <span
                            className={`transition-colors duration-200 ${
                              isActive
                                ? "text-primary-content"
                                : "group-hover:text-primary"
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span>{item.name}</span>
                          {isActive && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Standard User Menu */}
            <div>
              <div className="px-4 mb-2 text-xs font-bold text-base-content/40 uppercase tracking-wider">
                {isAdmin ? "Personal Dashboard" : "Menu"}
              </div>
              <ul className="space-y-2">
                {userNavItems.map((item) => {
                  const isActive = item.end
                    ? location.pathname === item.path
                    : location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                          isActive
                            ? "bg-primary text-primary-content font-medium shadow-md shadow-primary/20"
                            : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
                        }`}
                      >
                        <span
                          className={`transition-colors duration-200 ${
                            isActive
                              ? "text-primary-content"
                              : "group-hover:text-primary"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span>{item.name}</span>
                        {isActive && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white/20 rounded-l-full" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-base-300">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-all duration-200"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header - Mobile Only Trigger & Page Title */}
        <header className="bg-base-100/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-30 px-6 py-4 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="btn btn-ghost btn-circle btn-sm lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-bold">Dashboard</h1>
          </div>
          <div className="avatar w-8 h-8">
            <img src={user?.photoURL} alt="User" className="rounded-full" />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
