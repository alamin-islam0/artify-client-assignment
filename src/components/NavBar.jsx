import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Switch from "./ThemeSwitcher";

const Navbar = () => {
  const { user, logout } = useAuth();

  const navLinks = (
    <>
      <li>
        <Link to={"/"}>Home</Link>
      </li>
      <li>
        <Link to={"/explore"}>Explore</Link>
      </li>
      {
        user && <>
            <li>
        <Link to={"/add-artwork"}>Add Artwork</Link>
      </li>
      <li>
        <Link to={"/gallery"}>My Gallery</Link>
      </li>
      <li>
        <Link to={"/favorites"}>My Favorites</Link>
      </li>
        </>
      }
    </>
  );
  return (
    <div className="navbar max-w-6xl mx-auto  shadow-sm z-10">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {navLinks}
          </ul>
        </div>
        <Link to={"/"} className="text-primary font-bold text-4xl">
          <h1>Artify</h1>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>
      <div className="navbar-end">
        <div className="pr-6">
        < Switch/>
        </div>
        {user ? (
          <div className="flex justify-center items-center gap-6">
            <img src={user.photoURL} className="w-8 h-8 rounded-full" />
            <button className="btn btn-primary" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <Link className="btn btn-primary" to={"/login"}>
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
