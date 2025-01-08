import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateFailure, updateStart, updateSucess,deleteAccountFailure,deleteAccountSucess,deleteAccountStart } from "../redux/userSlice";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";



function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentuser } = useSelector((state) => state.user);
  const username = currentuser.data.username;
  const email = currentuser.data.email;

  const [data, setData] = useState({
    username: username || "",
    email: email || "",
    password: "",
  });
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const handleAccountDelete = async () => {
    dispatch(deleteAccountStart())
   try {
    const res=await fetch('/api-v1/user/delete-account',{
      method:"DELETE",
      credentials:"include"
    })
    if(res.ok){
      dispatch(deleteAccountSucess())
      navigate("/signin")

    }
   
   } catch (error) {
    console.log(error);
    dispatch(deleteAccountFailure())
    
   }
  };

  const handleUpdate = async () => {
    dispatch(updateStart());
    try {
      const res = await fetch(
        "/api-v1/user/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
            password: data.password,
          }),
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log(data.data);
        dispatch(updateSucess(data.data));
      } else {
        dispatch(updateFailure);
      }
    } catch (error) {}
  };

  return (
    <div className="w-full max-w-2xl mt-10 mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
      </div>

      {/* Username */}
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-sm font-semibold text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          name="username" // Added name attribute
          type="text"
          value={data.username}
          onChange={handleChange}
          className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={data.email}
          onChange={handleChange}
          className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="flex justify-center">
        <button
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-300"
          onClick={handleUpdate}
        >
          Update Profile
        </button>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-between gap-4 mb-2 mt-3">
        {/* Delete Account Button */}
        <button className="w-1/2 py-3 bg-red-600 text-white rounded-md hover:bg-red-500 transition duration-300" onClick={handleAccountDelete}>
          Delete Account
        </button>

        {/* Change Password Button */}
        <Link
          to="/change-password"
          className="w-1/2 py-3 bg-teal-600 text-white rounded-md text-center hover:bg-teal-500 transition duration-300"
        >
          <button className="w-full bg-transparent border-none text-white">
            Change Password
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Profile;
