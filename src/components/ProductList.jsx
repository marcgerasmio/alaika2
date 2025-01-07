import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

function ProductList() {
  const selectedBranch = sessionStorage.getItem("selectedBranch");
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProductDetailModalVisible, setIsProductDetailModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:1337/api/products?filters[branch_name][$eq]=${selectedBranch}`
        );
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedBranch]);

  const getProductPrice = (price) => {
    return parseFloat(price.replace('₱', '').replace(',', ''));
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery = product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category ? product.category_name === category : true;
    const matchesMinPrice = minPrice ? getProductPrice(product.product_price) >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice ? getProductPrice(product.product_price) <= parseFloat(maxPrice) : true;
    return matchesSearchQuery && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const handleAddToCart = async (product) => {
    const cartData = {
      data: {
        product_name: product.product_name,
        quantity: 1,
        price: product.product_price,
        user_name: userDetails.name,
        branch_name: product.branch_name,
      }
    };
    const jsonString = JSON.stringify(cartData);
    try {
      const response = await fetch("http://localhost:1337/api/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      });

      if (response.ok) {
        const data = await response.json();
        alert("Product added to cart!");
        window.location.reload();
      } else {
        const errorData = await response.text();
        alert("Failed to add to cart!");
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding to cart!");
    }
  };

  const handleCheckoutClick = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleQuantityChange = (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleConfirmOrder = () => {
    setIsModalVisible(false);
    setIsConfirmationModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleCloseConfirmationModal = async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const cartData = {
      data: {
        product_name: selectedProduct.product_name,
        quantity: quantity,
        total: selectedProduct.product_price * quantity,
        customer_name: userDetails.name,
        date: formattedDate,
        branch_name : selectedProduct.branch_name,
      }
    };
    const jsonString = JSON.stringify(cartData);
    try {
      const response = await fetch("http://localhost:1337/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonString,
      });

      if (response.ok) {
        const data = await response.json();
        window.location.reload();
      } else {
        const errorData = await response.text();
        console.error(errorData);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding to cart!");
    }
    setIsConfirmationModalVisible(false);
  };

  // Function to show product details
  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
    setIsProductDetailModalVisible(true);
  };

  return (
    <>
      <Navbar />
      <section className="bg-gray-100 py-8">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-center text-[#4B3D8F] mb-8">
            {selectedBranch} Branch
          </h2>

          <div className="mb-8 text-center">
  <div className="flex flex-wrap justify-center gap-4">
    {/* Search Bar */}
    <input
      type="text"
      placeholder="Search products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border border-[#4B3D8F] rounded-md p-2 w-full md:w-1/3 lg:w-1/4 shadow-sm focus:outline-none focus:ring focus:ring-[#4B3D8F] focus:ring-opacity-50"
    />

    {/* Category Filter */}
    <select
      value={category}
      onChange={(e) => setCategory(e.target.value)}
      className="border border-[#4B3D8F] rounded-md p-2 w-full md:w-1/4 lg:w-1/6 shadow-sm focus:outline-none focus:ring focus:ring-[#4B3D8F] focus:ring-opacity-50"
    >
      <option value="">All Categories</option>
      {Array.from(new Set(products.map((product) => product.category_name))).map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>

    {/* Price Range Filters */}
    <input
      type="number"
      placeholder="Min Price"
      value={minPrice}
      onChange={(e) => setMinPrice(e.target.value)}
      className="border border-[#4B3D8F] rounded-md p-2 w-full md:w-1/6 lg:w-1/8 shadow-sm focus:outline-none focus:ring focus:ring-[#4B3D8F] focus:ring-opacity-50"
    />
    <input
      type="number"
      placeholder="Max Price"
      value={maxPrice}
      onChange={(e) => setMaxPrice(e.target.value)}
      className="border border-[#4B3D8F] rounded-md p-2 w-full md:w-1/6 lg:w-1/8 shadow-sm focus:outline-none focus:ring focus:ring-[#4B3D8F] focus:ring-opacity-50"
    />

    {/* Clear Filters Button */}
    <button
      onClick={() => {
        setSearchQuery("");
        setCategory("");
        setMinPrice("");
        setMaxPrice("");
      }}
      className="bg-[#4B3D8F] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#392E70] transition-all"
    >
      Clear Filters
    </button>
  </div>
</div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
              >
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-full h-56 object-cover rounded-xl mb-4 transition-transform duration-300 transform hover:scale-105"
                />
                <h3 className="text-xl font-semibold text-[#4B3D8F] mb-4 hover:text-[#3D2F7F] transition-colors duration-300">
                  {product.product_name}
                </h3>
              
                <div className="flex justify-between items-center mb-4">
                  <p className="text-l font-bold text-[#4B3D8F]">
                    ₱{product.product_price}
                  </p>
                  <span
                    className="text-sm text-[#4B3D8F] hover:text-[#3D2F7F] cursor-pointer underline transition-all duration-300"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                <button
                    onClick={() => handleViewProductDetails(product)}
                    className="text-[#4B3D8F] hover:text-[#3D2F7F] text-sm font-medium underline mt-2 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4B3D8F] rounded-md"
                  >
                    View Product
                  </button>
                  <button
                    onClick={() => handleCheckoutClick(product)}
                    className="bg-[#4B3D8F] hover:bg-[#3D2F7F] text-white text-lg font-semibold px-5 py-3 rounded-lg w-full transition-all duration-300"
                  >
                    Check Out
                  </button>
          
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Modal for Product Details */}
      {isProductDetailModalVisible && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 max-h-[90vh] overflow-y-auto p-6 md:p-8 relative transition-all transform hover:scale-105">
            <button
              onClick={() => setIsProductDetailModalVisible(false)}
              className="absolute top-4 right-4 text-[#4B3D8F] font-semibold text-xl hover:text-[#3D2F7F] transition-all"
            >
              ✕
            </button>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4B3D8F] mb-6 text-center">
              {selectedProduct.product_name}
            </h2>
            <div className="flex justify-center mb-6">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.product_name}
                className="w-full max-w-[400px] sm:max-w-[500px] h-auto object-contain rounded-lg shadow-lg"
              />
            </div>
            <p className="text-sm sm:text-base text-gray-700 mb-6 text-center px-4 md:px-0">
              {selectedProduct.description}
            </p>
            <p className="text-lg sm:text-xl font-semibold text-[#4B3D8F] text-center">
              Price: <span className="text-2xl font-bold">₱{selectedProduct.product_price}</span>
            </p>
          </div>
        </div>
      )}

      {/* Modal for Checkout */}
      {isModalVisible && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-[#4B3D8F] font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-[#4B3D8F] mb-4">
              Review Your Order
            </h2>
            <div className="overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col">
                <img src={selectedProduct.image} alt="" />
                <h4 className="text-lg font-semibold text-[#4B3D8F]">
                  {selectedProduct.product_name}
                </h4>
                <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                <p className="text-sm font-bold text-[#4B3D8F] mb-4">
                  Price: ₱{selectedProduct.product_price}
                </p>
                <div className="flex items-center justify-start gap-3">
                  <label htmlFor="quantity" className="text-sm text-[#4B3D8F]">
                    Quantity:
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    onChange={(e) => setQuantity(e.target.value)}
                    className="border border-[#4B3D8F] rounded-md p-2 w-16"
                  />
                </div>
                <div className="mt-4 text-sm text-[#4B3D8F]">
                  <p>
                    <strong>Total Quantity:</strong> {quantity}
                  </p>
                  <p>
                    <strong>Total Price:</strong> ₱{getProductPrice(selectedProduct.product_price) * quantity}
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right mt-6">
              <button
                onClick={handleConfirmOrder}
                className="bg-[#4B3D8F] hover:bg-[#3D2F7F] text-white px-6 py-2 rounded-md"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmationModalVisible && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6 relative">
            <button
              onClick={handleCloseConfirmationModal}
              className="absolute top-4 right-4 text-[#4B3D8F] font-bold"
            >
              ✕
            </button>
            <p className="text-2xl font-bold text-green-500 mb-2">
              Your order has been successfully placed!
            </p>
            <div className="bg-gradient-to-br from-[#FFE4E1] to-[#FFC0CB] p-4 rounded-md">
              <h4 className="text-lg font-semibold text-[#4B3D8F] mb-2">
                {selectedProduct.product_name}
              </h4>
              <p className="text-sm font-bold text-[#4B3D8F] mb-2">
                Price: ₱{selectedProduct.product_price}
              </p>
              <div className="text-sm text-[#4B3D8F] mb-4">
                <p>
                  <strong>Total Quantity:</strong> {quantity}
                </p>
                <p>
                  <strong>Total Price:</strong> ₱{getProductPrice(selectedProduct.product_price) * quantity}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductList;