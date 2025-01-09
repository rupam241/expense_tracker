import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlCalender } from "react-icons/sl";
import { Link } from "react-router-dom";
import { IoMdCreate } from "react-icons/io";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  fetchEntriesRequest,
  fetchEntriesSuccess,
  fetchEntriesFailure,
  updateEntry,
  deleteEntry,
} from "../redux/entrySlice"; 
import Toaster from "../components/Toaster";
import { fetchSummaryFailure, fetchSummaryRequest,fetchSummarySuccess } from "../redux/summarySlice";

const Income = () => {
  const dispatch = useDispatch();
  const [message, setToastMessage] = useState(null);
  
  const { entries, error } = useSelector((state) => state.entrySlice);

  const { totalIncome, totalExpenses, balance } = useSelector((state)=>state.summarySlice)

  const [editEntry, setEditEntry] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "income",
  });


  const getSummaryDetails=async()=>{
    try {
      dispatch(fetchSummaryRequest())
      const res=await fetch('/api-v1/summary/get-summary',{
        method:'GET',
      credentials:'include'
      })
      if(res.ok){
        const data=await res.json()
        console.log(data);
        dispatch(fetchSummarySuccess(data))
       
        
        
      }
      else{
        dispatch(fetchSummaryFailure("Failed to update summary details"))
      }


    } catch (error) {


      
    }
  }
  useEffect(()=>{
    getSummaryDetails()
  },[])

  useEffect(() => {
    const fetchEntries = async () => {
      dispatch(fetchEntriesRequest()); 
      try {
        const res = await fetch(
          "/api-v1/entry/get-entry?type=income",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
         
          
          dispatch(fetchEntriesSuccess(data.entries));
          setToastMessage(data.message || "Entries loaded successfully");
        } else {
          dispatch(fetchEntriesFailure("Failed to fetch income entries"));
          setToastMessage("Failed to load income entries");
        }
      } catch (error) {
        dispatch(fetchEntriesFailure("Error fetching income entries"));
        setToastMessage("Error fetching income entries");
      }
    };

    fetchEntries();
  }, [dispatch]);



  const handleUpdate = async () => {
    if (!formData.description || isNaN(formData.amount) || formData.amount <= 0) {
      setToastMessage("Please provide a valid description and amount");
      return;
    }

    const updatedData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
    };
  
     if (updatedData.type === "income") {
    const currentIncomeAmount = entries.find((entry) => entry.id === editEntry)?.amount || 0;
    const newTotalIncome = totalIncome - currentIncomeAmount + updatedData.amount;

    if (newTotalIncome < totalExpenses) {
      setToastMessage(`Updated income cannot be less than the total expenses of $${totalExpenses}`);
      return;
    }
  }

    try {
      const res = await fetch(`/api-v1/entry/update-entry/${editEntry}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      const data=await res.json()

      if (res.ok) {
        dispatch(updateEntry({ id: editEntry, ...updatedData }));
        setToastMessage(data.message);
        setEditEntry(null);
        setFormData({ description: "", amount: "", type: "income" });
      } else {
        throw new Error("Failed to update entry");
      }
    } catch (error) {
      console.error(error);
      setToastMessage("Error updating income entry");
    }
    getSummaryDetails()
  };

  const handleDelete = async (id) => {
    const entryToDelete = entries.find((entry) => entry.id === id);
    if (entryToDelete) {
      const newTotalIncome = totalIncome - entryToDelete.amount;

      if (newTotalIncome < totalExpenses) {
        setToastMessage(`Total income cannot be less than total expenses of $${totalExpenses}`);
        return;
      }
    }

    


    try {
      const res = await fetch(`/api-v1/entry/delete-entry/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        dispatch(deleteEntry({ id }));
        setToastMessage("Entry deleted successfully");
      } else {
        throw new Error("Failed to delete entry");
      }
    } catch (error) {
      console.error(error);
      setToastMessage("Error deleting income entry");
    }
    getSummaryDetails()
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, type: e.target.value }));
  };

  return (
    <div className="py-4 px-3 flex flex-col gap-6">
      <h1 className="text-2xl font-medium font-serif">Incomes</h1>

      {/* Displaying the total income dynamically */}
      <div className="w-full bg-white-200 shadow-md p-5 flex justify-center items-center rounded-lg">
        {totalIncome !== undefined ? (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Total Income:</span>
            <span className="text-xl font-bold text-green-600">
              ${totalIncome.toFixed(2)}
            </span>
          </div>
        ) : (
          <span>Loading...</span>
        )}
      </div>

      {/* Displaying income entries */}
      {entries.length > 0 ? (
        entries.map((entry) =>
          entry.type === "income" ? (
            <div
              key={entry.id}
              className="flex gap-4 w-full shadow-md p-4 items-center bg-gray-100 rounded-lg"
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmCy16nhIbV3pI1qLYHMJKwbH2458oiC9EmA&s"
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-400 block"></span>
                    <h1 className="font-semibold text-lg">${entry.amount}</h1>
                  </div>
                  <div className="flex items-center gap-4">
                    <SlCalender />
                    <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-gray-600">{entry.description || "No description"}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditEntry(entry.id);
                      setFormData({
                        description: entry.description || "",
                        amount: entry.amount,
                        type: entry.type,
                      });
                    }}
                    className="text-blue-600 flex items-center gap-2"
                  >
                    <FiEdit />
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 flex items-center gap-2"
                  >
                    <FiTrash2 />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : null
        )
      ) : (
        <div className="flex flex-col items-center gap-4">
        <p className=" text-lg text-gray-600">No income to display.</p>
        <Link to="/createEntry">
          <div className="flex  items-center gap-1  w-48 h-12 bg-green-500 p-2 rounded-xl cursor-pointer hover:bg-gray-700">
            <IoMdCreate />
            <button>Create income</button>
          </div>
        </Link>
      </div>
      )}

      {/* Edit Form */}
      {editEntry && (
        <div className="w-full shadow-md p-4 bg-white rounded-lg">
          <h2 className="text-lg font-semibold">Update Entry</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="flex flex-col gap-4 mt-4"
          >
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="p-2 border rounded-lg"
            />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Amount"
              className="p-2 border rounded-lg"
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleTypeChange}
              className="p-2 border rounded-lg"
            >
              <option value="income">Income</option>
         
            </select>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditEntry(null);
                  setFormData({ description: "", amount: "", type: "income" });
                }}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <Toaster message={message} />
    </div>
  );
};

export default Income;
