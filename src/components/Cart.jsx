import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = ({ onClose }) => {
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [paypalPhone, setPaypalPhone] = useState("");
  const [paypalName, setPaypalName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (userDetails) {
      fetchCartItems();
    } else {
      console.error("User details not found in session storage.");
    }
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:1337/api/carts?filters[user_name][$eq]=${userDetails.name}&_limit=1000`
      );
      if (response.ok) {
        const data = await response.json();
        setCart(data.data);
      } else {
        console.error("Failed to fetch cart items. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const toggleSelection = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : cart.map((item) => item.id));
  };

  const removeFromCart = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:1337/api/carts/${item.documentId}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } }
      );
      if (response.ok) {
        setCart((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
        setSelectedItems((prev) => prev.filter((id) => id !== item.id));
      } else {
        console.error("Failed to delete item from cart.");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleCheckout = () => setShowModal(true);

  const handlePayment = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    const selectedCartItems = cart.filter((item) => selectedItems.includes(item.id));

    for (const item of selectedCartItems) {
      const transactionData = {
        data: {
          product_name: item.product_name,
          quantity: item.quantity,
          total: item.price * item.quantity,
          customer_name: item.user_name || "Guest",
          date: today,
          branch_name: item.branch_name,
          modeOfPayment: paymentMethod,
        },
      };

      try {
        await fetch("http://localhost:1337/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionData),
        });
      } catch (error) {
        console.error("Error creating transaction:", error);
      }
    }

    handleDelete(selectedCartItems);
  };

  const handleDelete = async (items) => {
    for (const item of items) {
      try {
        const response = await fetch(
          `http://localhost:1337/api/carts/${item.documentId}`,
          { method: "DELETE", headers: { "Content-Type": "application/json" } }
        );
        if (response.ok) {
          setCart((prev) => prev.filter((cartItem) => cartItem.id !== item.id));
          setSelectedItems((prev) => prev.filter((id) => id !== item.id));
        } else {
          console.error("Failed to delete item from cart.");
        }
      } catch (error) {
        console.error("Error deleting cart item:", error);
      }
    }

    setReceiptDetails(items);
    setShowModal(false);
    setShowReceiptModal(true);
  };

  const calculateTotal = (items) =>
    items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl max-w-2xl mx-auto mt-8">
      <h2 className="text-4xl font-extrabold text-[#4B3D8F] mb-6 text-center">
        Your Cart
      </h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-3 rounded border-gray-400"
            />
            <span className="text-gray-700">Select All</span>
          </div>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gradient-to-r from-[#FDE7F0] to-[#FCD4E4] p-4 rounded-md shadow-md hover:shadow-lg transition"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleSelection(item.id)}
                  className="mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold text-[#4B3D8F]">
                    {item.product_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    ₱{item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <p className="text-lg font-bold text-[#4B3D8F]">
                  ₱{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <span className="text-lg font-semibold text-[#4B3D8F]">
              Total: ₱{calculateTotal(cart.filter((item) => selectedItems.includes(item.id))).toFixed(2)}
            </span>
            <button
              className="bg-[#4B3D8F] text-white px-8 py-3 rounded-md shadow-md hover:bg-[#3D2F7F] transition"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            <ul>
              {cart
                .filter((item) => selectedItems.includes(item.id))
                .map((item) => (
                  <li key={item.id} className="mb-2">
                    {item.product_name} - ₱{(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
            </ul>
            <p className="mt-4 font-bold">
              Total: ₱{calculateTotal(cart.filter((item) => selectedItems.includes(item.id))).toFixed(2)}
            </p>
            <div className="mt-4">
              <label className="block mb-2">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Paypal">PayPal</option>
              </select>
              {paymentMethod === "Paypal" && (
                <div className="mt-4">
                  <input
                    type="email"
                    placeholder="PayPal Email"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full border rounded p-2 mb-2"
                  />
                  <input
                    type="text"
                    placeholder="PayPal Phone"
                    value={paypalPhone}
                    onChange={(e) => setPaypalPhone(e.target.value)}
                    className="w-full border rounded p-2 mb-2"
                  />
                    <input
                    type="text"
                    placeholder="PayPal Name"
                    value={paypalName}
                    onChange={(e) => setPaypalName(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#4B3D8F] text-white px-4 py-2 rounded"
                onClick={handlePayment}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showReceiptModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Order Invoice</h3>
            <p className="mt-4 font-bold mb-2">
              Mode of Payment: {paymentMethod}
            </p>
            <hr></hr>
            <ul>
              {receiptDetails.map((item) => (
                <li key={item.id} className="mb-2">
                  {item.product_name} - ₱{(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-bold">
              Total: ₱{calculateTotal(receiptDetails).toFixed(2)}
            </p>
            <button
              className="bg-[#4B3D8F] text-white px-4 py-2 rounded mt-4"
              onClick={() => {
                setShowReceiptModal(false);
                window.location.reload();
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
