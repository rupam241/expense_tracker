import React, { useState } from "react";
import { useNavigate} from "react-router-dom"
import Toaster from "../components/Toaster";

function ChangePass() {
  const navigate=useNavigate()
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
const [message,setMessage]=useState(null)
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    
    try {
      const res = await fetch("/api-v1/user/change-password", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json", // Ensure correct content type
        },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setMessage("Password changed successfully!");
        const timer=setTimeout(()=>{
          (navigate("/profile"))
        },3000)

      } else {
        const data = await res.json();
        setMessage(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to change password.");
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Change Password</h2>

        {/* Current Password */}
        <div className="mb-4">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-semibold text-gray-700"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Confirm New Password */}
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-teal-600 text-white rounded-md hover:bg-teal-500 transition duration-300"
          >
            Submit New Password
          </button>
        </div>
      </div>
      <Toaster message={message}/>
    </div>
  );
}

export default ChangePass;
