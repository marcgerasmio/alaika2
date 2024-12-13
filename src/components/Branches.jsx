import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Branches() {
  const navigate = useNavigate();
  const branches = [
    {
      id: 1,
      name: "Ampayon",
      description: "Located in the heart of Butuan.",
    },
    {
      id: 2,
      name: "Libertad",
      description: "Sunny vibes in the City of Butuan.",
    },
    { id: 3, name: "Lumbocan", description: "Experience the Butuan City." },
    { id: 4, name: "Masao", description: "Big hearts in Butuan." },
    {
      id: 5,
      name: "Pangabugan",
      description: "Enjoy the tropical atmosphere of Butuan City.",
    },
  ];

  const handleBranchClick = (branchName) => {
    sessionStorage.setItem("selectedBranch", branchName);
    navigate("/products");
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-8">
        <h2 className="text-3xl font-bold text-center text-[#4B3D8F] mb-8">
          Our Branches All Over the Country
        </h2>
        <hr />
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 mt-5">
          {branches.map((branch) => (
              <div
                key={branch.id}
                className="flex flex-col justify-between p-6 bg-gradient-to-br from-[#FFE4E1] to-[#FFC0CB] rounded-lg shadow-md hover:shadow-lg transition-shadow h-full"
                onClick={() => handleBranchClick(branch.name)}
              >
                <h3 className="text-xl font-semibold text-[#4B3D8F] mb-4">
                  {branch.name}
                </h3>
                <p className="text-sm text-gray-600 mb-6 flex-grow">
                  {branch.description}
                </p>
                <button className="bg-[#4B3D8F] hover:bg-[#3D2F7F] text-white px-4 py-2 rounded-md mt-auto">
                  Select
                </button>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Branches;
