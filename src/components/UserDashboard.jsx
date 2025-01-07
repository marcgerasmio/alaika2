import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

function UserDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF1F0] to-[#FFDDE1]">
      <Navbar />
      <main className="flex-grow">
        <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
          <div className="container mx-auto px-6 lg:px-12 h-full">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center h-full">
              {/* Left Section */}
              <div className="space-y-8">
                <h1 className="text-5xl lg:text-6xl font-extrabold text-[#4B3D8F] leading-tight tracking-wide text-shadow-md">
                  The Best Way to Make Someone Happy...
                </h1>
                <p className="text-lg lg:text-xl text-gray-700 max-w-xl leading-relaxed">
                  Your one-stop e-commerce shop for unique, thoughtful gifts! Explore a world of joy, surprises, and perfect presents for every occasion. Whether it's a birthday, anniversary, or just a special moment, we've got you covered.
                </p>
                <Link to="/branches">
                  <button className="bg-[#4B3D8F] hover:bg-[#3D2F7F] transition-all duration-300 ease-in-out mt-8 text-white px-8 py-3 text-lg rounded-full flex items-center gap-4 shadow-lg hover:shadow-2xl transform hover:scale-105">
                    Explore Branches
                    <FaArrowRightLong className="mt-1 transform transition-all duration-300 ease-in-out" />
                  </button>
                </Link>
              </div>

              {/* Right Section */}
              <div className="relative h-[450px] lg:h-[550px]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFE8E6] to-[#FFC4C7] rounded-xl transform scale-95 shadow-xl"></div>
                <img
                  src="img.jpg"
                  alt="Gift box with various items"
                  className="relative object-cover w-full h-full rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default UserDashboard;
