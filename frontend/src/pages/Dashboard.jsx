import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import IncomeExpenseChart from "../components/chart/Chart";

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });

  const [entries, setEntries] = useState([]); // State to store the entries
  const dispatch = useDispatch();

  // Fetching entries
  const getEntries = async () => {
    try {
      const res = await fetch('http://localhost:3000/api-v1/entry/get-entry?page=1', {
        method: 'GET',
        credentials: 'include', // Ensure the cookies are included in the request
      });

      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries); // Assuming the response has an 'entries' array
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
  };

  // Fetching summary data
  useEffect(() => {
    const getSummary = async () => {
      try {
  

        const res = await fetch('http://localhost:3000/api-v1/summary/get-summary', {
          method: 'GET',
          credentials: 'include', // Ensure the cookies are included in the request
        });

        if (res.ok) {
          const data = await res.json();
          setSummaryData({
            totalIncome: data.totalIncome || 0,
            totalExpenses: data.totalExpenses || 0,
            balance: data.balance || 0,
          });

          
        } else {
        
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      
      }
    };

    getSummary();
  }, []);

  // Fetch entries when the component mounts
  useEffect(() => {
    getEntries();
  }, []);

  return (
    <div className="w-full h-full bg-custompink py-6 px-4 flex flex-col lg:flex-row gap-6 overflow-hidden">
  {/* Right side */}
  <div className="w-full lg:w-[60%] flex flex-col gap-6 overflow-y-auto">
    <h1 className="font-serif text-2xl font-medium text-center lg:text-left">All Transactions</h1>

    {/* Chart */}
    <div className="w-full h-96 md:h-80 lg:h-64 rounded-lg flex items-center justify-center text-white">
      <IncomeExpenseChart />
    </div>

    {/* Show details */}
    <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mt-20">
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
        <span className="text-lg font-medium">Total Income</span>
        <span className="text-xl font-bold text-green-600">${summaryData.totalIncome.toFixed(2)}</span>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
        <span className="text-lg font-medium">Total Expense</span>
        <span className="text-xl font-bold text-red-600">${summaryData.totalExpenses.toFixed(2)}</span>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center md:col-span-2">
        <span className="text-lg font-medium">Total Balance</span>
        <span className="text-xl font-bold text-blue-600">${summaryData.balance.toFixed(2)}</span>
      </div>
    </div>
  </div>

  {/* Left side */}
  <div className="w-full lg:w-[40%] bg-white p-6 rounded-lg shadow-md overflow-y-auto">
    <h2 className="text-xl font-semibold">Recent History of Entries</h2>
    <div className="mt-4 space-y-4">
      {entries.length > 0 ? (
        entries.map((entry, index) => (
          <div key={index} className="p-4 bg-slate-200 rounded-lg flex items-center justify-between">
            <span>{entry.description}</span>
            <span className={entry.type === "income" ? "text-green-600" : "text-red-600"}>
              {entry.type === "income" ? "+" : "-"}${Math.abs(entry.amount).toFixed(2)}
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
