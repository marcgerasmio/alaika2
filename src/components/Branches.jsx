import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa"; // Import location icon
import Navbar from "./Navbar"; // Import the Navbar component

function Branches() {
  const navigate = useNavigate();
  const branches = [
    { id: 1, name: "Manila", description: "Plaza Sta. Cruz, Santa Cruz, Manila" },
    { id: 2, name: "Makati", description: "Paseo De Roxas St ,Cor Makati Ave, Makati" },
    { id: 3, name: "Cebu", description: "Gothong, Mandaue City, 6014 Cebu" },
    { id: 4, name: "Leyte", description: "Sambulawan Junction, Calaguise, Calubian Rd, Leyte" },
    { id: 5, name: "Surigao", description: "San Nicolas corner Diez Streets, Surigao City, Surigao City" },
    { id: 6, name: "Butuan", description: "Jose Rosales Ave, Butuan City, Agusan Del Norte" },
    { id: 7, name: "Zamboanga", description: "Maria Clara Lorenzo Lobregat Hwy, Zamboanga del Sur" },
    { id: 8, name: "Batangas", description: "Yellowbell Country Inn, P.Prieto, Poblacion, Batangas" },
    { id: 9, name: "Baguio", description: "Mabini St, 42 Session Rd, Baguio, Benguet" },
    { id: 10, name: "Davao", description: "Reyes Drive, 2b Maryknoll Dr, Lanang, Davao City" },
  ];

  const handleBranchClick = (branchName) => {
    sessionStorage.setItem("selectedBranch", branchName);
    navigate("/products");
  };

  return (
    <>
      {/* Include Navbar */}
      <Navbar />

      {/* Branches Section */}
      <section className="bg-gradient-to-b from-[#FAF3F0] to-white py-16">
        <div className="container mx-auto px-8">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-center text-[#4B3D8F] mb-10">
            Our Branches Across the Nation
          </h2>
          <hr className="border-t-2 border-[#4B3D8F] mb-10 mx-auto w-1/3" />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-5">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="flex flex-col justify-between p-6 bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => handleBranchClick(branch.name)}
              >
                <h3 className="text-2xl font-bold text-[#4B3D8F] mb-4 text-center">
                  {branch.name}
                </h3>
                <div className="flex items-center justify-center text-gray-600 mb-6">
                  <FaMapMarkerAlt
                    className="text-[#4B3D8F] w-6 h-6 mr-2" // Fixed size using w-6 and h-6
                    aria-label="Location Icon"
                  />
                  <p className="text-sm text-center leading-tight">{branch.description}</p>
                </div>
                <button className="bg-[#4B3D8F] hover:bg-[#3D2F7F] text-white px-6 py-2 rounded-md transition-all duration-300 transform hover:scale-105">
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Branches;
