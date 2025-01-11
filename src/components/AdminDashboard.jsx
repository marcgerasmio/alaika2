import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaSearch } from "react-icons/fa"; // Icons for search and logout
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AdminDashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [topSales, setTopSales] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chartData, setChartData] = useState(null);
  const [chartBranchFilter, setChartBranchFilter] = useState("");
  const [cashOnDeliveryCount, setCashOnDeliveryCount] = useState(0);
  const [paypalCount, setPaypalCount] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/transactions?pagination[pageSize]=1000");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        const result = data.data;

        const paymentCounts = result.reduce(
          (acc, transaction) => {
            if (transaction.modeOfPayment === "Cash on Delivery") {
              acc.cashOnDelivery += 1;
            } else if (transaction.modeOfPayment === "Paypal") {
              acc.paypal += 1;
            }
            return acc;
          },
          { cashOnDelivery: 0, paypal: 0 }
        );

        setCashOnDeliveryCount(paymentCounts.cashOnDelivery);
        setPaypalCount(paymentCounts.paypal);

        // Extract unique branches
        const uniqueBranches = [
          ...new Set(result.map((transaction) => transaction.branch_name)),
        ];
        setBranches(uniqueBranches);

        // Sort transactions by date (newest first)
        const sortedTransactions = result.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setTransactions(sortedTransactions);

        const filteredData = selectedBranch
          ? result.filter(
              (transaction) => transaction.branch_name === selectedBranch
            )
          : result;

        const aggregatedData = filteredData.reduce((acc, transaction) => {
          const { product_name, quantity } = transaction;
          if (!acc[product_name]) {
            acc[product_name] = { product_name, quantity: 0 };
          }
          acc[product_name].quantity += quantity;
          return acc;
        }, {});

        const topSalesData = Object.values(aggregatedData)
          .filter((sale) => sale.quantity > 0)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 20);

        setTopSales(topSalesData);

        // Prepare chart data
        prepareChartData(result, chartBranchFilter);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [selectedBranch, chartBranchFilter]);

  const prepareChartData = (data, branch) => {
    const today = new Date();
    const days = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() - (3 - i)); 
      return date.toISOString().split("T")[0]; 
    });

    const filteredData = branch
      ? data.filter((transaction) => transaction.branch_name === branch)
      : data;

    const ordersPerDay = days.map((day) => {
      return filteredData.filter((transaction) =>
        transaction.date.startsWith(day)
      ).length;
    });

    setChartData({
      labels: days.map((day) => new Date(day).toLocaleDateString()),
      datasets: [
        {
          label: `Orders Per Day${branch ? ` (${branch})` : ""}`,
          data: ordersPerDay,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  // Search filter for transactions
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-gradient-to-br from-[#FFE4E1] to-[#FFC0CB]">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="text-3xl font-bold text-[#4B3D8F] flex items-center space-x-2">
            <span>REGALO</span>
            <span className="text-sm text-[#4B3D8F] font-light">GIFT SHOP</span>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button
                  onClick={logout}
                  className="text-[#4B3D8F] font-bold hover:underline flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Transactions Section */}
          <section className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-[#4B3D8F]">
              Transactions
            </h2>
            <div className="flex mb-3">
            <h2 className="me-3">Cash on Delivery: {cashOnDeliveryCount}</h2>
            <h2>Paypal: {paypalCount} </h2>
            </div>
            <div className="overflow-y-auto max-h-96">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Mode of Payment</th>
                    <th className="py-2 px-4 border-b">Order ID</th>
                    <th className="py-2 px-4 border-b">Customer Name</th>
                    <th className="py-2 px-4 border-b">Product Name</th>
                    <th className="py-2 px-4 border-b">Branch</th>
                    <th className="py-2 px-4 border-b">Quantity</th>
                    <th className="py-2 px-4 border-b">Date</th>
                    <th className="py-2 px-4 border-b">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="py-2 px-4 border-b">
                          {transaction.modeOfPayment}
                        </td>
                        <td className="py-2 px-4 border-b">{transaction.id}</td>
                        <td className="py-2 px-4 border-b">
                          {transaction.customer_name}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {transaction.product_name}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {transaction.branch_name}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {transaction.quantity}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {transaction.total.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No transactions available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Top Sales Section */}
          <section className="bg-white p-6 shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-[#4B3D8F]">Top Sales</h2>
            <select
              className="w-full px-4 py-2 mb-4 border rounded"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
            >
              <option value="">All Branches</option>
              {branches.map((branch, index) => (
                <option key={index} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
            <div className="overflow-y-auto max-h-96">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Product Name</th>
                    <th className="py-2 px-4 border-b">Total Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {topSales.length > 0 ? (
                    topSales.map((sale, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">
                          {sale.product_name}
                        </td>
                        <td className="py-2 px-4 border-b">{sale.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-4">
                        No sales data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Bar Chart Section */}
        {chartData && (
       <section className="bg-white p-6 shadow rounded-lg mt-8">
       <h2 className="text-2xl font-bold mb-4 text-[#4B3D8F]">
         Orders Per Day
       </h2>
       <select
         className="w-full px-4 py-2 mb-4 border rounded"
         value={chartBranchFilter}
         onChange={(e) => setChartBranchFilter(e.target.value)}
       >
         <option value="">All Branches</option>
         {branches.map((branch, index) => (
           <option key={index} value={branch}>
             {branch}
           </option>
         ))}
       </select>
       {chartData ? (
         <Bar data={chartData} />
       ) : (
         <p className="text-center text-gray-500">No data available</p>
       )}
     </section>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
