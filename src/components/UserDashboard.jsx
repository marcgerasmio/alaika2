import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

function UserDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFE4E1] to-[#FFC0CB]">
      <Navbar />
      <main className="flex-grow">
        <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
          <div className="container mx-auto px-8 h-full">
            <div className="grid lg:grid-cols-2 gap-8 items-center h-full">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-[#4B3D8F] leading-tight">
                  The Best Way to Make Someone Happy...
                </h1>
                <p className="text-lg text-gray-600 max-w-lg">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt.
                </p>
                <Link to="/branches">
                  <button className="bg-[#4B3D8F] hover:bg-[#3D2F7F] mt-8 text-white px-8 py-3 text-lg rounded-md flex gap-2">
                    Explore Branches
                    <FaArrowRightLong className="mt-1" />
                  </button>
                </Link>
              </div>
              <div className="relative h-[500px]">
                <img
                  src="img.jpg"
                  alt="Gift box with various items"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
