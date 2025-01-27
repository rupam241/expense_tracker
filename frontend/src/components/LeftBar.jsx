import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteAccountFailure,
  deleteAccountStart,
  deleteAccountSucess,
  signInFailure,
  signoutStart,
  signoutSucess,
} from "../redux/userSlice";

const LeftBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentuser, error } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleAccountDelete = async () => {
    dispatch(deleteAccountStart());
    try {
      const res = await fetch("/api-v1/user/delete-account", {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        dispatch(deleteAccountSucess());
        navigate("/signin");
      }
    } catch (error) {
      console.log(error);
      dispatch(deleteAccountFailure());
    }
  };

  const handleSignOut = async () => {
    setOpen(false);
    dispatch(signoutStart());
    try {
      const res = await fetch("/api-v1/user/sign-out", {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        dispatch(signoutSucess());
        navigate("/signin");
      }
    } catch (error) {
      dispatch(signInFailure());
      console.log(error);
    }
  };

  return (
    <div className="w-full sm:w-1/4 lg:w-1/5 h-auto sm:h-[92vh] bg-customPink px-6 py-8 flex flex-col items-center gap-5 overflow-hidden rounded-lg border-2">
      <div className="relative flex flex-col items-center space-y-4">
        <span
          className="text-2xl font-semibold flex flex-col items-center"
          onClick={handleOpen}
        >
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover text-center cursor-pointer"
          />
          <span className="font-bold text-sm cursor-pointer">
            See the details. Click me!
          </span>
        </span>
        {open && (
          <div className="absolute top-full mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden border-2">
            <ul className="text-gray-700">
              <Link to="/profile" onClick={() => setOpen(false)}>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
              </Link>
              <Link to="/transactions" onClick={() => setOpen(false)}>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Transactions</li>
              </Link>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setShowSignOutModal(true)}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
        <span className="text-sm text-gray-400">Hey, it's your finance tracker</span>
      </div>

      <div className="flex flex-col items-center space-y-4 w-full">
        <Link to="dashboard" className="w-full text-center py-2 px-4 rounded-md bg-teal-700 hover:bg-teal-600 transition-colors duration-300">
          Dashboard
        </Link>
        <Link to="income" className="w-full text-center py-2 px-4 rounded-md bg-teal-700 hover:bg-teal-600 transition-colors duration-300">
          Incomes
        </Link>
        <Link to="expense" className="w-full text-center py-2 px-4 rounded-md bg-teal-700 hover:bg-teal-600 transition-colors duration-300">
          Expenses
        </Link>
        <Link to="createEntry" className="w-full text-center py-2 px-4 rounded-md bg-teal-700 hover:bg-teal-600 transition-colors duration-300">
          Create Entry
        </Link>
      </div>

      <button className="bg-slate-400 p-3 rounded-md hover:bg-red-200" onClick={() => setShowDeleteModal(true)}>
        Delete Account
      </button>
      <button className="bg-slate-400 p-3 rounded-md hover:bg-red-200" onClick={() => setShowSignOutModal(true)}>
        Sign Out
      </button>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
            <p className="mb-6">This action will permanently delete your account.</p>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleAccountDelete}
            >
              Confirm
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded-md"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold mb-4">Sign Out</h2>
            <p className="mb-6">Are you sure you want to sign out?</p>
            <button
              className="bg-teal-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleSignOut}
            >
              Confirm
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded-md"
              onClick={() => setShowSignOutModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftBar;
