import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Toaster from '../components/Toaster';
import {useDispatch} from "react-redux"
import { addEntry, fetchEntriesRequest, fetchEntriesSuccess } from '../redux/entrySlice';

const CreateEntry = () => {
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'income', // Default type is 'income'
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the amount is less than or equal to 0
    if (formData.amount <= 0) {
      setMessage('Amount should be greater than zero');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      return;
    }

    if (!formData.description || !formData.amount) {
      setMessage('Please fill out all fields.');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      return;
    }

    const newEntry = {
      description: formData.description,
      amount: formData.amount,
      type: formData.type,
    };

    try {
      dispatch(fetchEntriesRequest())

      const res = await fetch('/api-v1/entry/create-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        dispatch(fetchEntriesSuccess(data.entry))
        dispatch(addEntry(data.entry))
        navigate('/dashboard');
        setFormData({
          description: '',
          amount: '',
          type: 'income',
        });
        setMessage('Entry created successfully');
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.message || 'Failed to create entry.'}`);
      }
    } catch (error) {
      setMessage(`Error creating entry: ${error.message}`);
    }

    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  return (
    <div className="py-4 px-6 flex flex-col gap-6">
      <h1 className="text-2xl font-medium font-serif">Add New Entry</h1>

      <div className="w-full bg-white shadow-md p-6 rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="p-3 border rounded-lg"
          />

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            className="p-3 border rounded-lg"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="p-3 border rounded-lg"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg mt-4"
          >
            Submit Entry
          </button>
        </form>
      </div>

      <Toaster message={message} />
    </div>
  );
};

export default CreateEntry;
