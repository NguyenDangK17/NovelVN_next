"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/UserContext";
import { Menu, MenuItems, MenuItem, MenuButton } from "@headlessui/react";

const Navbar: React.FC = () => {
  const { user, setUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTop, setIsTop] = useState(true);

  const controlNavbar = () => {
    setIsTop(window.scrollY === 0);
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  const isProfilePage = pathname === "/profile";

  const navLink = (href: string, label: string) => (
    <li>
      <Link
        href={href}
        className={`block py-2 px-3 rounded-sm lg:p-0 hover:cursor-pointer ${
          pathname === href
            ? "text-primary-500"
            : "text-white hover:text-primary-500"
        }`}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <nav
      className={`fixed w-full transition-all duration-300 ease-in-out z-[1000] ${
        isTop && !isProfilePage
          ? "bg-transparent border-b-2 border-transparent"
          : "bg-[#1f1f1f] border-b-2 border-primary-500"
      }`}
    >
      <div className="border-gray-200">
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto py-2 lg:px-10 px-2">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg text-sm p-2.5"
              onClick={() => {
                setMenuOpen(!isMenuOpen);
                setDropdownOpen(false);
              }}
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 6h14M3 10h14M3 14h14"
                />
              </svg>
              <span className="sr-only">Menu</span>
            </button>

            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="https://mangadex.org/img/brand/mangadex-logo.svg"
                alt="MangaVN Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white hidden sm:block">
                MangaVN
              </span>
            </Link>
          </div>

          <div className="flex items-center lg:order-2 space-x-3">
            <button
              type="button"
              className="lg:hidden text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg text-sm p-2.5 me-1"
              onClick={() => setSearchOpen(!isSearchOpen)}
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>

            <div className="relative hidden lg:block w-[250px]">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
                placeholder="Search..."
              />
            </div>

            {user ? (
              <Menu as="div" className="relative">
                <div>
                  <MenuButton className="flex text-sm rounded-full lg:me-0 focus:ring-2 focus:ring-primary-500">
                    <Image
                      width={40}
                      height={40}
                      className="rounded-full"
                      src={user.avatar}
                      alt="user photo"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  modal={false}
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                  <div className="p-2">
                    <span className="block text-sm text-gray-900">
                      {user.username}
                    </span>
                    <span className="block text-sm text-gray-500 truncate">
                      {user.email}
                    </span>
                  </div>
                  <div className="py-1">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => router.push("/profile")}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Profile
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => router.push("/dashboard")}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Dashboard
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => router.push("/settings")}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          Settings
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } w-full text-left px-4 py-2 text-sm text-red-600`}
                        >
                          Sign out
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
            ) : (
              <Link
                href="/login"
                className="text-sm text-white font-semibold hover:text-primary-500 p-2.5"
              >
                Login
              </Link>
            )}
          </div>

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } items-center justify-between w-full lg:flex lg:w-auto lg:order-1`}
          >
            <ul className="flex flex-col font-semibold text-md p-4 lg:p-0 mt-4 bg-[#1f1f1f] xl:space-x-8 lg:space-x-4 lg:flex-row lg:mt-0 lg:border-0 lg:bg-transparent gap-4">
              {navLink("/", "Home")}
              {navLink("/browse", "Browse")}
              {navLink("/forums", "Forums")}
              {navLink("/ranking", "Ranking")}
              {navLink("/about-us", "About Us")}
            </ul>
          </div>
        </div>

        <div
          className={`relative lg:hidden w-full transition-all duration-300 ease-in-out ${
            isSearchOpen ? "max-h-screen opacity-100 p-4" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="absolute inset-y-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search..."
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
