"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserName(payload.sub);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUserName(null);
    setShowUserMenu(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg shadow-lg shadow-black/5"
          : "bg-white"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          <a
            href="/"
            className="group flex items-center gap-3 transition-transform hover:scale-105"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 transition-shadow group-hover:shadow-xl group-hover:shadow-blue-500/40">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-400 opacity-0 blur transition-opacity group-hover:opacity-50" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              SpamGuard
            </span>
          </a>

          <div className="flex items-center gap-1">
            {userName ? (
              <>
                <a
                  href="/history"
                  className="group relative px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  History
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:left-0 group-hover:w-full" />
                </a>

                <div className="relative ml-3">
                  <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className="group flex items-center gap-2.5 rounded-full pl-3 pr-1 py-1 transition-all hover:bg-gray-100"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {userName}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-semibold text-white shadow-md ring-2 ring-white transition-transform group-hover:scale-110">
                      {getInitials(userName)}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                      <div className="rounded-xl bg-white p-1.5 shadow-xl ring-1 ring-black/5">
                        <div className="px-3 py-2.5 border-b border-gray-100">
                          <p className="text-xs font-medium text-gray-500">
                            Signed in as
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-gray-900">
                            {userName}
                          </p>
                        </div>

                        <button
                          onClick={logout}
                          className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <a
                href="/login"
                className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            )}
          </div>
        </div>
      </div>

      {showUserMenu && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
}