import React from "react";
import { User, LayoutDashboard, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Switch from "./ThemeSwitcher";

const Navbar = () => {
  const { user, logout } = useAuth();

  const navLinks = (
    <>
      <li>
        <Link className="text-white" to={"/"}>
          Home
        </Link>
      </li>
      <li>
        <Link className="text-white" to={"/explore"}>
          Explore
        </Link>
      </li>
      <li>
        <Link className="text-white" to={"/about"}>
          About Us
        </Link>
      </li>
      <li>
        <Link className="text-white" to={"/contact"}>
          Contact
        </Link>
      </li>
      <li>
        <Link className="text-white" to={"/add-artwork"}>
          Add Artwork
        </Link>
      </li>
      <li>
        <Link className="text-white" to={"/gallery"}>
          My Gallery
        </Link>
      </li>
      {user && (
        <>
          <li>
            <Link className="text-white" to={"/favorites"}>
              My Favorites
            </Link>
          </li>
        </>
      )}
    </>
  );
  return (
    <div className="mr-2 lg:mr-0 ml-2 lg:ml-0 p-2">
      <div className="navbar sticky top-2 lg:top-4 lg:mt-4 mt-4 z-50 mx-auto bg-primary/90 backdrop-blur-md rounded-full px-4 lg:px-6 max-w-6xl shadow-lg border border-white/10 transition-all duration-300">
        <div className="navbar-start">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost lg:hidden text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg gap-2"
            >
              {React.Children.map(navLinks.props.children, (child) => {
                if (child)
                  return React.cloneElement(child, {
                    children: React.cloneElement(child.props.children, {
                      className: "text-base-content",
                    }),
                  });
                return child;
              })}
            </ul>
          </div>
          <Link
            to={"/"}
            className="flex items-center gap-2 text-white font-bold text-3xl font-montserrat tracking-wide"
          >
            <span>Artify</span>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">{navLinks}</ul>
        </div>
        <div className="navbar-end gap-2">
          <div className="hidden lg:block mr-2">
            <Switch />
          </div>
          {user ? (
            <>
              {/* Desktop / Tablet: show avatar dropdown */}
              <div className=" hidden lg:flex items-center">
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="avatar cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full ring ring-white/20 ring-offset-base-100 ring-offset-2">
                      <img src={user.photoURL} alt="User" />
                    </div>
                  </div>

                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 gap-2 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
                  >
                    <li>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User size={18} />
                        My Profile
                      </Link>
                    </li>

                    <li>
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>
                    </li>

                    <li className="divider"></li>

                    <li>
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 text-error"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Mobile: DaisyUI dropdown menu */}
              <div className="dropdown dropdown-end lg:hidden">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost w-20 btn-circle avatar"
                >
                  <div className="w-10 h-10 rounded-full border border-white/30">
                    <img
                      src={user.photoURL}
                      alt="User"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://ui-avatars.com/api/?name=User")
                      }
                    />
                  </div>
                </div>

                <ul
                  tabIndex="-1"
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
                >
                  <li>
                    <Link to="/profile" className="justify-between">
                      Profile
                      <span className="badge badge-primary badge-sm">New</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/gallery">My Gallery</Link>
                  </li>
                  <li>
                    <Link to="/favorites">My Favorites</Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button onClick={logout} className="text-error">
                      Logout
                    </button>
                  </li>
                  <li className="mt-2">
                    <div className="flex justify-between items-center bg-base-200">
                      <span className="text-xs">Theme</span> <Switch />
                    </div>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="btn bg-transparent text-white border border-white shadow-none !rounded-full !px-6 !py-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
