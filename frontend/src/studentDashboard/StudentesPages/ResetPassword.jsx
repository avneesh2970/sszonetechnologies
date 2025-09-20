import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetData, setResetData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Step 1: Request OTP
  const handleForgotSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, { email });
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`, { email, otp });
      toast.success(data.message);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

// Step 3: Reset Password
const handleResetSubmit = async () => {
  if (resetData.newPassword !== resetData.confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  setLoading(true);
  try {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
      email,
      otp,  // ✅ include otp
      newPassword: resetData.newPassword,
      confirmPassword: resetData.confirmPassword,
    });
    toast.success("Password updated successfully");
    onClose();
  } catch (err) {
    toast.error(err.response?.data?.message || "Error resetting password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-gray-200 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        {/* Close Button */}
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded"
              />
              <button
                type="button"
                onClick={handleForgotSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                required
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-2 rounded"
              />
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="text-gray-500">
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleOtpSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <div className="flex flex-col gap-3">
              <input
                type="password"
                required
                placeholder="New Password"
                value={resetData.newPassword}
                onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="password"
                required
                placeholder="Confirm Password"
                value={resetData.confirmPassword}
                onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                className="border p-2 rounded"
              />
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="text-gray-500">
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleResetSubmit}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
