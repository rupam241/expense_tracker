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
} from "../redux/entrySlice";
import {
  fetchSummaryRequest,
  fetchSummarySuccess,
  fetchSummaryFailure,
} from "../redux/summarySlice";
import Toaster from "../components/Toaster";

const Expense = () => {
  const dispatch = useDispatch();


  // Access entries, loading state, and errors from Redux store
  const { entries, isLoading, error } = useSelector(
    (state) => state.entrySlice
  );
  const { totalIncome, totalExpenses, balance } = useSelector(
    (state) => state.summarySlice
  );

  const [editEntry, setEditEntry] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "expense",
  });
  const [toastMessage, setToastMessage] = useState("");

  const getSummaryDetails = async () => {
    try {
      dispatch(fetchSummaryRequest()); // Dispatch the summary request to Redux
      const res = await fetch(
        "http://localhost:3000/api-v1/summary/get-summary",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(fetchSummarySuccess(data)); // Dispatch summary success with data
        setToastMessage(data.message);
      } else {
        dispatch(fetchSummaryFailure("Failed to fetch summary details"));
        setToastMessage("Failed to fetch summary details");
      }
    } catch (error) {
      console.error(error);
      dispatch(fetchSummaryFailure("Error fetching summary details"));
      setToastMessage("Error fetching summary details");
    }
  };

  useEffect(() => {
    getSummaryDetails();
  }, []);

  useEffect(() => {
    const fetchEntries = async () => {
      dispatch(fetchEntriesRequest()); // Dispatch the request to start loading
      try {
        const res = await fetch(
          "http://localhost:3000/api-v1/entry/get-entry?type=expense",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          dispatch(fetchEntriesSuccess(data.entries)); // Dispatch success with data
        } else {
          dispatch(fetchEntriesFailure("Failed to fetch expense entries"));
        }
      } catch (error) {
        dispatch(fetchEntriesFailure("Error fetching expense entries"));
      }
    };

    fetchEntries();
  }, [dispatch]);

  // Handle updating an expense entry
  const handleUpdate = async () => {
    const updatedData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
    };
    if (updatedData.type === "expense") {
    
      const currentExpenseAmount = entries.find((entry) => entry.id === editEntry)?.amount || 0;
    
      // Calculate the new total expenses after updating the entry
      const newTotalExpenses = totalExpenses - currentExpenseAmount + updatedData.amount;
    
    
      if (newTotalExpenses > totalIncome) {
        setToastMessage(`Updated expenses cannot exceed the total income of $${totalIncome}`);
        return;
      }
    }
    

    try {
      const res = await fetch(
        `http://localhost:3000/api-v1/entry/update-entry/${editEntry}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(updateEntry({ id: editEntry, ...updatedData }));
        setEditEntry(null);
        setFormData({ description: "", amount: "", type: "expense" }); // Reset form fields
      } else {
        alert("Failed to update expense entry");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating expense entry");
    }
    getSummaryDetails(); // Fetch updated summary after update
  };

  // Handle deleting an expense entry
  const handleDelete = async (id) => {

    


    try {
      const res = await fetch(
        `http://localhost:3000/api-v1/entry/delete-entry/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        dispatch(deleteEntry({ id }));
        // Fetch updated summary after delete
      } else {
        alert("Failed to delete expense entry");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting expense entry");
    }
    getSummaryDetails();
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, type: e.target.value }));
  };

  return (
    <div className="py-4 px-3 flex flex-col gap-6">
      <h1 className="text-2xl font-medium font-serif">Expenses</h1>

      {/* Displaying Total Expenses */}
      <div className="w-full bg-white-200 shadow-md p-5 flex justify-center items-center rounded-lg">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Total Expense:</span>
          <span className="text-xl font-bold text-red-600">
            {totalExpenses}
          </span>
        </div>
      </div>

      {entries.length > 0 ? (
        entries.map((entry) =>
          entry.type === "expense" ? (
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
                    <span className="w-3 h-3 rounded-full bg-red-400 block"></span>
                    <h1 className="font-semibold text-lg">${entry.amount}</h1>
                  </div>

                  <div className="flex items-center gap-4">
                    <SlCalender />
                    <span>
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600">
                  {entry.description || "No description"}
                </p>

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

      {/* Update Form */}
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
                  setFormData({ description: "", amount: "", type: "expense" });
                }}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
          <Toaster message={toastMessage}/>
    </div>

  );
};

export default Expense;
