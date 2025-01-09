import React, { useEffect, useState } from 'react';
import { IoMdCreate } from "react-icons/io";
import {Link} from "react-router-dom"

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch('/api-v1/entry/get-entry', {
          method: 'GET',
          credentials: 'include',
        });
        const response = await res.json();
        setTransactions(response.entries);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Transactions</h2>

      {transactions.length === 0 ? (
        <div className='flex flex-col items-center gap-4'>
          <p className=" text-lg text-gray-600">No transactions to display.</p>
                <Link to="/createEntry">
                <div className='flex  items-center gap-1  w-48 h-12 bg-green-500 p-2 rounded-xl cursor-pointer hover:bg-gray-700'>
                <IoMdCreate />
                <button>Create transaction</button>      
                </div>
                
                </Link>
        </div>
        
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((entry) => (
            <div
              key={entry.id}
              className={`bg-white shadow-md rounded-lg p-5 border-l-4 ${
                entry.type === 'income' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <p className="text-lg font-semibold text-gray-700 mb-2">{entry.description}</p>
              <p className="text-sm text-gray-500">
                <strong>Amount:</strong> ₹{entry.amount}
              </p>
              <p
                className={`text-sm font-medium ${
                  entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                <strong>Type:</strong> {entry.type}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Date:</strong> {new Date(entry.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Transaction;
