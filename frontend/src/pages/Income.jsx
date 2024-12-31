import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SlCalender } from "react-icons/sl";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  fetchEntriesRequest,
  fetchEntriesSuccess,
  fetchEntriesFailure,
  addEntry,
  updateEntry,
  deleteEntry,
} from "../redux/entrySlice"; // Assuming entrySlice actions are imported

const Income = () => {
  const dispatch = useDispatch();

  // Access entries and financial summary from Redux store
  const { entries, isLoading, error } = useSelector((state) => state.entrySlice);
  const totalIncome = entries
    .filter((entry) => entry.type === "income")
    .reduce((acc, entry) => acc + entry.amount, 0);

  const [editEntry, setEditEntry] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "income", // Default to "income"
  });

  // Fetch income entries on mount
  useEffect(() => {
    const fetchEntries = async () => {
      dispatch(fetchEntriesRequest()); // Dispatch request action to indicate loading
      try {
        const res = await fetch(
          "http://localhost:3000/api-v1/entry/get-entry?type=income",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          dispatch(fetchEntriesSuccess(data.entries)); // Dispatch success action with fetched data
        } else {
          dispatch(fetchEntriesFailure("Failed to fetch income entries")); // Dispatch failure action
        }
      } catch (error) {
        dispatch(fetchEntriesFailure("Error fetching income entries")); // Dispatch failure action
      }
    };

    fetchEntries();
  }, [dispatch]);

  
  // Handle update income
  const handleUpdate = async () => {
    const updatedData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
    };

    try {
      const res = await fetch(`http://localhost:3000/api-v1/entry/update-entry/${editEntry}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      if (res.ok) {
        dispatch(updateEntry({ id: editEntry, ...updatedData })); 
      
        
        setEditEntry(null);
        setFormData({ description: "", amount: "", type: "income" }); // Reset form
      } else {
        throw new Error("Failed to update entry");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating income entry");
    }
  };

  // Handle delete income
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api-v1/entry/delete-entry/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        dispatch(deleteEntry({ id })); 
      } else {
        throw new Error("Failed to delete entry");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting income entry");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle type change (income or expense)
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
          entry.type === "income" ? ( // Only show income entries
            <div
              key={entry.id}
              className="flex gap-4 w-full shadow-md p-4 items-center bg-gray-100 rounded-lg"
            >
              {/* Profile Image */}
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmCy16nhIbV3pI1qLYHMJKwbH2458oiC9EmA&s"
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Entry Details */}
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

                {/* Update and Delete Buttons */}
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
        <span>No entries found.</span>
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
            
            {/* Type Select */}
            <select
              name="type"
              value={formData.type}
              onChange={handleTypeChange}
              className="p-2 border rounded-lg"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
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
    </div>
  );
};

export default Income;
