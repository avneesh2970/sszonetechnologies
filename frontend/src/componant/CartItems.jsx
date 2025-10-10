import { FaStar } from "react-icons/fa";
import { MdCurrencyRupee } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useStudentAuth } from "../studentDashboard/StudentesPages/studentAuth";
import { useCartContext } from "../context/CartContext";

function CartItems() {
  // const [cartItems, setCartItems] = useState([]);
  const { cartItems, fetchCartItems } = useCartContext();
  const [promoCode, setPromoCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const subtotal = (cartItems || []).reduce(
    (acc, item) => acc + (item.course?.discountPrice || 0),
    0
  );
  const total = subtotal - discount;

  // Apply promo
  const applyPromo = () => {
    if (promoCode === "25BBUYVNJHV4774" && !applied) {
      setDiscount(500);
      setApplied(true);
    } else {
      toast.error("Wrong coupon code");
    }
  };

  const removePromo = () => {
    setDiscount(0);
    setApplied(false);
    setPromoCode("");
  };

  // Remove item from cart
  const removeItem = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${id}`, {
        withCredentials: true,
      });
      toast.success("Item removed from cart");
      fetchCartItems(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item" + err);
    }
  };

  // Razorpay checkout
  // const handleCheckout = async (amount) => {
  //   try {
  //     const { data } = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
  //       {
  //         amount,
  //         cartItems, // send current cart
  //         // make sure you have user ID
  //       },
  //       { withCredentials: true }
  //     );

  //     if (!data.success) return toast.error("Failed to create order");

  //     const options = {
  //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //       amount: data.order.amount,
  //       currency: data.order.currency,
  //       name: "My Shop",
  //       description: "Course Purchase",
  //       order_id: data.order.id,
  //       handler: async function (response) {
  //         await axios.post(
  //           `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`,
  //           {
  //             ...response,
  //             purchaseId: data.purchaseId, // pass the purchase document ID
  //           },
  //           { withCredentials: true }
  //         );

  //         await axios.delete(
  //           `${import.meta.env.VITE_BACKEND_URL}/api/cart/clear`,
  //           { withCredentials: true }
  //         );

  //         toast.success("Payment successful!");
  //         fetchCartItems(null); // optional: refresh cart after payment
  //       },
  //       theme: { color: "#296AD2" },
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();
  //   } catch (err) {
  //     console.log(err);
  //     toast.error("Something went wrong with checkout");
  //   }
  // };

  const handleCheckout = async (amount) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
      { amount, cartItems },
      { withCredentials: true }
    );

    if (!data.success) return toast.error("Failed to create order");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "My Shop",
      description: "Course Purchase",
      order_id: data.order.id,
      handler: async function (response) {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`,
          { ...response, purchaseId: data.purchaseId },
          { withCredentials: true }
        );

        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/cart/clear`,
          { withCredentials: true }
        );

        toast.success("Payment successful!");
        fetchCartItems(null);
      },
      theme: { color: "#296AD2" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    if (err.response?.data?.message?.includes("already purchased")) {
      toast.info(" You already purchased this course.");
    } else {
      toast.error("Something went wrong with checkout");
    }
  }
};   

// for status paid ----------------------------------
//  const [paid, setPaid] = useState(false);

//   useEffect(() => {
//     (async () => {
//       try {
//         const { data } = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/purchases/is-paid/${course._id}`,
//           { withCredentials: true }
//         );
//         setPaid(data.paid);
//       } catch (err) {
//         console.log("Not logged in or error checking purchase");
//       }
//     })();
//   }, [course._id]);


  return (
    <div className="font-[Manrope] max-w-screen-2xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-10 w-full">
        {/* Cart List */}
        <div className="flex-1 space-y-6 max-h-[500px] overflow-auto">
          {cartItems.length === 0 ? (
            <p className="font-semibold text-[18px] text-[#1C4ED9] pb-6">
              Your cart is empty
            </p>
          ) : (
            <p className="font-semibold text-[18px] text-[#1C4ED9] pb-6">
              {cartItems.length} {cartItems.length === 1 ? "Course" : "Courses"}{" "}
              in Cart
            </p>
          )}

          {(cartItems || []).map((item) => {
            const averageRating =
              item.course.reviews && item.course.reviews.length > 0
                ? (
                    item.course.reviews.reduce(
                      (sum, review) => sum + review.rating,
                      0
                    ) / item.course.reviews.length
                  ).toFixed(1)
                : null;

            return (
              <div
                key={item._id}
                className="w-full border border-[#E3E3E3] rounded-md p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="p-2">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${
                        item.course?.thumbnail || ""
                      }`}
                      alt={item.course?.title || "Course"}
                      className="w-[127px] h-[80px] rounded-md object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-[#292929] pb-1">
                      {item.course?.title || "N/A"}
                    </h3>
                    <p className="text-sm text-[#6F6F6F] pb-1">
                      {item.course?.instructor.name || "N/A"}
                    </p>
                    <div className="flex items-center gap-1 text-sm pb-1 text-[#C08B00] font-bold">
                      {averageRating}{" "}
                      <FaStar className="text-[#FABF23] text-sm" />
                    </div>
                    <p className="text-sm text-[#6F6F6F]">
                      <span className="pr-3">
                        •{" "}
                        {item?.course.additionalInfo?.duration
                          ? `${item.course.additionalInfo.duration.hour}h ${item.course.additionalInfo.duration.minute}m`
                          : "N/A"}
                      </span>
                      <span className="pr-3">
                        •{" "}
                        {item?.course?.modules?.reduce(
                          (sum, module) => sum + (module.lessons?.length || 0),
                          0
                        )}{" "}
                        Lectures
                      </span>
                      <span className="pr-3">
                        • {item?.course?.overview?.courseLevel}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-lg text-[#232323]">
                  <MdCurrencyRupee className="text-[20px]" />
                  <p className="text-[18px]">
                    {item.course?.discountPrice || 0}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item._id)}
                  className="text-sm text-[#296AD2] font-medium hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="w-full lg:w-[400px] space-y-6 my-10">
            <div className="border border-[#E3E3E3] rounded-md p-6">
              <h3 className="font-bold text-lg text-[#1A1A1A] pb-5">
                Order Summary
              </h3>

              <div className="flex justify-between pb-4">
                <p className="font-semibold uppercase text-sm text-[#1A1A1A]">
                  Subtotal
                </p>
                <div className="flex items-center">
                  <MdCurrencyRupee className="text-[#232323]" />
                  <p className="font-semibold text-sm">{subtotal}</p>
                </div>
              </div>

              <div className="flex justify-between pb-4">
                <p className="font-normal uppercase text-sm text-[#1A1A1A]">
                  Promo Discount
                </p>
                <div className="flex items-center">
                  <MdCurrencyRupee className="text-[#232323]" />
                  <p className="text-sm">{discount}</p>
                </div>
              </div>

              <div className="flex justify-between border-b pb-4 mb-5">
                <p className="font-bold uppercase text-base text-[#1A1A1A]">
                  Total
                </p>
                <div className="flex items-center">
                  <MdCurrencyRupee className="text-[#232323]" />
                  <p className="font-bold text-sm">{total}</p>
                </div>
              </div>

              <button
                className="w-full py-3 bg-[#296AD2] text-white font-medium rounded-md uppercase text-sm cursor-pointer"
                onClick={() => handleCheckout(total)}
              >
                Checkout
              </button>
              
              {/* {paid ? (
        <div className="w-full py-3 bg-green-600 text-white font-medium rounded-md text-center">
          ✅ Already Purchased
        </div>
      ) : (
        <button
          className="w-full py-3 bg-[#296AD2] text-white font-medium rounded-md uppercase text-sm"
          onClick={() => handleCheckout(total)}
        >
          Checkout
        </button>
      )} */}
            </div>

            {/* Promotions */}
            <div className="border border-[#E3E3E3] rounded-md p-6 space-y-5">
              <h3 className="font-bold text-lg text-[#1A1A1A]">Promotions</h3>

              {applied ? (
                <div className="border border-dashed border-[#296AD2] p-3 rounded-md flex justify-between items-center">
                  <p className="text-sm font-semibold">
                    25BBUYVNJHV4774{" "}
                    <span className="font-normal text-[#6F6F6F]">
                      is applied <br />
                      Udemy coupon
                    </span>
                  </p>
                  <button
                    onClick={removePromo}
                    className="bg-[#EBF5FF] p-1 rounded"
                  >
                    <IoMdClose className="text-[#296AD2] text-xl cursor-pointer" />
                  </button>
                </div>
              ) : (
                <div className="flex sm:flex-row flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Enter Coupon"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 p-2 border border-[#DEE0E4] rounded-md text-sm"
                  />
                  <button
                    onClick={applyPromo}
                    className="py-2 px-5 bg-[#296AD2] text-white rounded-md text-sm font-medium cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartItems;
