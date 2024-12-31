import React, { useEffect, useState } from 'react';

const Toaster = ({ message }) => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (message) {
      setShowToast(true);

      // Hide the toast after 3 seconds
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!showToast) return null;

  return (
    <div className="fixed bottom-5 right-5 flex items-center space-x-3 p-3 bg-black text-white rounded-lg shadow-lg animate-slideIn animate-fadeOut">
      <span>{message}</span>
    </div>
  );
};

export default Toaster;
