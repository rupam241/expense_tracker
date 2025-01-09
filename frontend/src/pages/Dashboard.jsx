import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import IncomeExpenseChart from "../components/chart/Chart";
import {
  fetchSummaryRequest,
  fetchSummarySuccess,
  fetchSummaryFailure,
} from "../redux/summarySlice";
import Toaster from "../components/Toaster";
import {
  fetchEntriesFailure,
  fetchEntriesRequest,
  fetchEntriesSuccess,
} from "../redux/entrySlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { totalIncome, totalExpenses, balance } = useSelector(
    (state) => state.summarySlice
  );
  const { entries, error } = useSelector((state) => state.entrySlice);

  const [toastMessage, setToastMessage] = useState(null); // State to manage toast messages

  const getEntries = async () => {
    dispatch(fetchEntriesRequest());
    try {
      const res = await fetch(
        "/api-v1/entry/get-entry?page=1",
        {
          method: "GET",
          credentials: "include", // Ensure cookies are included
        }
      );

      if (res.ok) {
        const data = await res.json();

        dispatch(fetchEntriesSuccess(data.entries));
      } else {
        dispatch(fetchEntriesFailure("Failed to fetch entries!"));
        setToastMessage("Failed to fetch entries!");
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      setToastMessage("Error fetching entries");
    }
  };

  // Fetching summary data
  useEffect(() => {
    const getSummary = async () => {
      dispatch(fetchSummaryRequest());
      try {
        const res = await fetch(
          "/api-v1/summary/get-summary",
          {
            method: "GET",
            credentials: "include", // Ensure cookies are included
          }
        );

        if (res.ok) {
          const data = await res.json();
          dispatch(fetchSummarySuccess(data)); // Dispatch success action with fetched data
        } else {
          dispatch(fetchSummaryFailure());
          
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
        dispatch(fetchSummaryFailure());
        
      }
    };

    getSummary();
  }, [dispatch]);

  
  useEffect(() => {
    getEntries();
  }, []);

  return (
    <div className="w-full h-full bg-custompink py-6 px-4 flex flex-col lg:flex-row gap-6 overflow-hidden">
      {/* Toast message */}
      {toastMessage && (
        <Toaster message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Right side */}
      <div className="w-full lg:w-[60%] flex flex-col gap-6 overflow-y-auto">
        <h1 className="font-serif text-2xl font-medium text-center lg:text-left">
          All Transactions
        </h1>

        {/* Chart */}
        <div className="w-full h-96 md:h-80 lg:h-64 rounded-lg flex items-center justify-center text-white">
          <IncomeExpenseChart />
        </div>

        {/* Summary details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-20">
          <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <span className="text-lg font-medium">Total Income</span>
            <span className="text-xl font-bold text-green-600">
              ${totalIncome}
            </span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <span className="text-lg font-medium">Total Expense</span>
            <span className="text-xl font-bold text-red-600">
              ${totalExpenses}
            </span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center md:col-span-2">
            <span className="text-lg font-medium">Total Balance</span>
            <span className="text-xl font-bold text-blue-600">${balance}</span>
          </div>
        </div>
      </div>

      {/* Left side */}
      <div className="w-full lg:w-[40%] bg-white p-6 rounded-lg shadow-md overflow-y-auto">
        <h2 className="text-xl font-semibold">Recent History of Entries</h2>
        <div className="mt-4 space-y-4">
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <div
                key={index}
                className="p-4 bg-slate-200 rounded-lg flex items-center justify-between"
              >
                <span>{entry.description}</span>
                <span
                  className={
                    entry.type === "income" ? "text-green-600" : "text-red-600"
                  }
                >
                  {entry.type === "income" ? "+" : "-"}$
                  {Math.abs(entry.amount).toFixed(2)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No entries found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
