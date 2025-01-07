import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Cart = ({ onClose }) => {
  const userDetails = JSON.parse(sessionStorage.getItem("user"));
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
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
        console.error("Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const toggleSelection = (productId) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(productId)
        ? prevSelectedItems.filter((id) => id !== productId)
        : [...prevSelectedItems, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((item) => item.id));
    }
    setSelectAll(!selectAll);
  };

  const removeFromCart = async (item) => {
    try {
      const response = await fetch(
        `http://localhost:1337/api/carts/${item.documentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== item.id));
        setSelectedItems((prevSelectedItems) =>
          prevSelectedItems.filter((id) => id !== item.id)
        );
      } else {
        console.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    const selectedCartItems = cart.filter((item) =>
      selectedItems.includes(item.id)
    );

    for (const item of selectedCartItems) {
      const cartData = {
        data: {
          product_name: item.product_name,
          quantity: item.quantity,
          total: item.price * item.quantity,
          customer_name: item?.user_name || "Guest",
          date: formattedDate,
          branch_name: item.branch_name,
        },
      };

      try {
        await fetch("http://localhost:1337/api/transactions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartData),
        });
      } catch (error) {
        console.error("Error:", error);
      }
    }

    handleDelete(selectedCartItems);
  };

  const handleDelete = async (items) => {
    for (const item of items) {
      try {
        const response = await fetch(
          `http://localhost:1337/api/carts/${item.documentId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== item.id));
          setSelectedItems((prevSelectedItems) =>
            prevSelectedItems.filter((id) => id !== item.id)
          );
        } else {
          console.error("Failed to delete item");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    alert("Checkout successful");
    window.location.reload();
  };

  const totalPrice = cart.reduce(
    (acc, item) =>
      selectedItems.includes(item.id) ? acc + item.price * item.quantity : acc,
    0
  );

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
              Total: ₱{totalPrice.toFixed(2)}
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
    </div>
  );
};

export default Cart;
