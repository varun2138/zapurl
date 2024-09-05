import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LiaLinkSolid } from "react-icons/lia";
import { TbLogout } from "react-icons/tb";
import { UrlState } from "../Context";
import UseFetch from "../hooks/UseFetch";
import { logout } from "../db/apiAuth";
import { BarLoader } from "react-spinners";

const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();
  const { loading, fn: logoutFn } = UseFetch(logout);
  return (
    <>
      <nav className="px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <img
            src="/logo.png"
            className=" z-10 fixed h-20 top-2 rounded-full "
            alt="zapUrl logo"
          />
        </Link>
        <div className="mr-6">
          {!user ? (
            <motion.button
              onClick={() => navigate("/auth")}
              className=" shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] bg-green-100 text-lg py-1 px-3 rounded-lg font-semibold  text-black"
              whileTap={{ scale: 0.85 }}
            >
              login
            </motion.button>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    className="object-contain"
                    alt="Tailwind CSS Navbar component "
                    src={user?.user_metadata?.profile_pic}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content   bg-gradient-to-r from-gray-900 to-black rounded-lg z-[1] mt-3 w-52 p-2  "
              >
                <li className=" pb-1  border-b hover:bg-none focus:bg-none border-blue-100">
                  <a className="font-bold text-lg">
                    {user?.user_metadata?.username}
                  </a>
                </li>
                <Link to="/dashboard">
                  <li className="text-md flex cursor-pointer gap-2 items-center mt-2 ">
                    <LiaLinkSolid className="text-blue-500 text-xl" />
                    <a>My Links</a>
                  </li>
                </Link>
                <li className="text-md text-red-500 flex cursor-pointer gap-2 items-center mt-2 ">
                  <TbLogout className="  text-xl" />
                  <a
                    onClick={() => {
                      logoutFn().then(() => {
                        fetchUser();
                        navigate("/");
                      });
                    }}
                  >
                    logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      {loading && <BarLoader width={"100%"} color="#36d7b7" />}
    </>
  );
};

export default Header;
