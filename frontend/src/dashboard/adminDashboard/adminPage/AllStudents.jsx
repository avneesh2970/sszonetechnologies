import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";


const UsersWithPurchases = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // full user object
  const [isOpen, setIsOpen] = useState(false); 

   const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/all`, {
        withCredentials: true,
      });
      if (res.data?.success) setAllUsers(res.data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const openDetails = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const closeDetails = () => {
    setSelectedUser(null);
    setIsOpen(false);
  };

  const fmt = (d) => (d ? dayjs(d).format("DD MMM YYYY, hh:mm A") : "-");

  // normalize purchases to array of items with title/price/date
  const getPurchaseItems = (user) => {
    const purchases = Array.isArray(user.purchasedCourse) ? user.purchasedCourse : [];
    const items = [];

    purchases.forEach((purchase) => {
      const createdAt = purchase.createdAt;
      const amount = purchase.amount ?? 0;

      // purchase.product may be an array of course objects
      if (Array.isArray(purchase.product) && purchase.product.length > 0) {
        purchase.product.forEach((prod) => {
          items.push({
            title: prod?.title || prod?.name || prod?.courseTitle || "Untitled",
            price: prod?.price ?? prod?.discountPrice ?? amount ?? 0,
            date: prod?.createdAt || createdAt,
          });
        });
      } else {
        // fallback: show purchase as single row
        items.push({
          title: purchase?.productTitle || `Order ${purchase.receipt || purchase._id}`,
          price: amount,
          date: createdAt,
        });
      }
    });

    return items;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Users & Purchases</h2>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-gray-600">Sr No</th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">Name</th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">Email</th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">Contact No</th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">Total Purchases</th>
              <th className="px-4 py-3 text-center text-sm text-gray-600">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : allUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">No users found.</td>
              </tr>
            ) : (
              allUsers.map((user, idx) => {
                const purchasedCount = Array.isArray(user.purchasedCourse) ? user.purchasedCourse.length : 0;
                return (
                  <tr key={user._id || idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{user.name || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{user.email || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{user.phone || user.contact || "-"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{purchasedCount}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button
                        onClick={() => openDetails(user)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">User Details</h3>
                <p className="text-sm text-gray-500">View user info & purchased courses</p>
              </div>
              <div>
                <button onClick={closeDetails} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Close</button>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">{selectedUser.name || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{selectedUser.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="font-medium text-gray-800">{selectedUser.phone || selectedUser.contact || "-"}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">Purchased Courses</h4>
                <div className="overflow-x-auto border rounded">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm text-gray-600">#</th>
                        <th className="px-4 py-2 text-left text-sm text-gray-600">Title</th>
                        <th className="px-4 py-2 text-left text-sm text-gray-600">Price</th>
                        {/* <th className="px-4 py-2 text-left text-sm text-gray-600">Date</th> */}
                      </tr>
                    </thead>

                    <tbody>
                      {getPurchaseItems(selectedUser).length === 0 ? (
                        <tr>
                          <td colSpan="4" className="px-4 py-6 text-center text-gray-500">No purchases found.</td>
                        </tr>
                      ) : (
                        getPurchaseItems(selectedUser).map((item, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-4 py-3 text-sm text-gray-700">{i + 1}</td>
                            <td className="px-4 py-3 text-sm text-gray-800">{item.title}</td>
                            <td className="px-4 py-3 text-sm text-gray-700">₹{item.price || 0}</td>
                            {/* <td className="px-4 py-3 text-sm text-gray-700">{fmt(item.date)}</td> */}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={closeDetails} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default UsersWithPurchases;
