import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const LeftBar = () => {
  const navigate=useNavigate()
  const currentUser = useSelector((state) => state.user);
  const username = currentUser.currentuser?.data?.username;

  const handleAccountDelete = async () => {
   try {
    const res=await fetch('/api-v1/user/delete-account',{
      method:"DELETE",
      credentials:"include"
    })
    if(res.ok){
      navigate("/signin")

    }
   
   } catch (error) {
    console.log(error);
    
   }
  };

  const handleSignOut = async () => {
    try {
      const res=await fetch('/api-v1/user/sign-out',{
        method:"DELETE",
        credentials:"include"
      })
      if(res.ok){
        navigate("/signin")
  
      }
     
     } catch (error) {
      console.log(error);
      
     }
  };

  return (
    <div className="w-full sm:w-1/4 lg:w-1/5 h-auto sm:h-[92vh] bg-customPink px-6 py-8 flex flex-col items-center gap-5 overflow-hidden rounded-lg border-2">
      <div className="flex flex-col items-center space-y-4">
        <span className="text-2xl font-semibold">{`Hello ${username}`}</span>
        <span className="text-sm text-gray-400">Hey, it's your finance tracker</span>
      </div>

      <div className="flex flex-col items-center space-y-4 w-full">
        <Link
          to="dashboard"
          className="w-full text-center py-2 px-4 rounded-md bg-teal-700 hover:bg-teal-600 transition-colors duration-300"
        >
          Dashboard
        </Link>
        <Link
          to="income"
          className="w-full text-center py-2 px-4 rounded-md bg-teal-700 hover:bg-teal-600 transition-colors duration-300"
        >
          Incomes
        </Link>
        <Link
          to="expense"
          className="w-full text-center py-2 px-4 rounded-md bg-teal-700 hover:bg-teal-600 transition-colors duration-300"
        >
          Expenses
        </Link>
        <Link
          to="createEntry"
          className="w-full text-center py-2 px-4 rounded-md bg-teal-700 hover:bg-teal-600 transition-colors duration-300"
        >
          Create Entry
        </Link>
      </div>

      <button
        className="bg-slate-400 p-3 rounded-md hover:bg-red-200"
        onClick={handleAccountDelete}
      >
        Delete Account
      </button>
      <button
        className="bg-slate-400 p-3 rounded-md hover:bg-red-200"
        onClick={handleSignOut}
      >
        Sign Out
      </button>
    </div>
  );
};

export default LeftBar;
