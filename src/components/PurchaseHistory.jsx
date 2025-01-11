import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const PurchaseHistory = () => {
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/transactions?filters[customer_name][$eq]=${userDetails.name}`
        );
        const data = await response.json();

        // Sort transactions by date (newest first)
        const sortedData = data.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setTransactionData(sortedData);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userDetails]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-[#4B3D8F] text-center mb-8">
          Your Purchase History
        </h2>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          ) : (
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-[#4B3D8F] text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Product Name</th>
                  <th className="py-3 px-4 text-left">Quantity</th>
                  <th className="py-3 px-4 text-left">Total</th>
                </tr>
              </thead>
              <tbody>
                {transactionData.length > 0 ? (
                  transactionData.map((purchase) => (
                    <tr
                      key={purchase.id}
                      className="border-t hover:bg-gray-100 transition duration-200"
                    >
                      <td className="py-3 px-4">{new Date(purchase.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{purchase.product_name}</td>
                      <td className="py-3 px-4">{purchase.quantity}</td>
                      <td className="py-3 px-4">₱{purchase.total}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-3 px-4 text-center text-gray-600">
                      No purchase history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default PurchaseHistory;
