import React, { useState } from "react";
import Cart from "./Cart";

const Navbar = () => {
  const [isCartVisible, setCartVisible] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleCartClick = () => setCartVisible(true);
  const handleCloseCart = () => setCartVisible(false);
  const toggleMenu = () => setMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="border-b bg-gradient-to-br from-[#FFE4E1] to-[#FFC0CB] shadow-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="/dashboard" className="text-3xl font-bold text-[#4B3D8F] flex items-center space-x-2">
            <span>REGALO</span>
            <span className="text-sm text-[#4B3D8F] font-light">GIFT SHOP</span>
          </a>

          {/* Hamburger Menu */}
          <button
            className="md:hidden text-[#4B3D8F] text-3xl"
            onClick={toggleMenu}
          >
            ☰
          </button>

          {/* Navigation Links */}
          <nav
            className={`absolute md:static top-20 left-0 w-full md:w-auto bg-[#FFE4E1] md:bg-transparent z-40 p-4 md:p-0 transition-transform transform ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-8">
              <li className="mb-2 md:mb-0">
                <a
                  href="/branches"
                  className="text-[#4B3D8F] font-semibold hover:text-[#3D2F7F] hover:underline transition duration-300"
                >
                  Branches
                </a>
              </li>
              <li className="mb-2 md:mb-0">
                <span
                  className="text-[#4B3D8F] font-semibold hover:text-[#3D2F7F] hover:underline cursor-pointer transition duration-300"
                  onClick={handleCartClick}
                >
                  Cart
                </span>
              </li>
              <li className="mb-2 md:mb-0">
                <a
                  href="/history"
                  className="text-[#4B3D8F] font-semibold hover:text-[#3D2F7F] hover:underline transition duration-300"
                >
                  Purchase History
                </a>
              </li>
              <li>
                <a
                  href="/"
                  className="text-[#4B3D8F] font-semibold hover:text-[#3D2F7F] hover:underline transition duration-300"
                >
                  Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Cart Modal */}
      {isCartVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6 relative max-h-[80vh] overflow-auto">
            <button
              onClick={handleCloseCart}
              className="absolute top-4 right-4 text-[#4B3D8F] font-bold text-2xl"
            >
              ✕
            </button>
            <Cart onClose={handleCloseCart} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
