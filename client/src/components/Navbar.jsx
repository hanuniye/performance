import {
  Menu,
} from "@mui/icons-material";
import { useGlobalProvider } from "../HOOKS/useGlobalProvider";
import { memo, useEffect, useState } from "react";
import useLogout from "../HOOKS/useLogout";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { sidebarToggle, setSidebarToggle } = useGlobalProvider();
  const logout = useLogout();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = (e) => {
    if (!e.target.closest("#dropdown-container")) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <div className="navbar flex justify-between items-center px-5 py-2 border-b-2">
      {/* left  */}
      <div className="left flex items-center space-x-5 ">
        <Menu
          onClick={() => setSidebarToggle(!sidebarToggle)}
          style={{ fontSize: "18px", cursor: "pointer" }}
        />
      </div>

      <div className="relative inline-block text-left" id="dropdown-container">
        <div>
          <div
            className="image"
            id="profile"
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={toggleDropdown}
          >
            <img
              className="w-10 h-10 rounded-full cursor-pointer border"
              src='/care.png'
              alt="profile-image"
            />
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="profile"
          >
            <div className="py-1" role="none">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700"
                role="menuitem"
                id="menu-item-2"
              >
                Profile
              </Link>
              <button
                type="submit"
                className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                role="menuitem"
                id="menu-item-3"
                onClick={() => logout()}
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* right */}
    </div>
  );
};

export default memo(Navbar);
