import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeExpenseChart = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30'); // Default to last 30 days
  const [chartHeight, setChartHeight] = useState(400); // Default height

 
  const fetchSummary = async () => {
    try {
      const response = await fetch(`/api-v1/summary/get-summary?period=${period}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        const formattedData = formatChartData(result);
        setData(formattedData);
      } else {
        console.error('Failed to fetch summary data');
      }
    } catch (error) {
      console.error('Error fetching summary data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to format the data for the chart
  const formatChartData = (data) => {
    if (!data) return null;
  
    return {
      labels: ['Total Income', 'Total Expenses'], // X-axis categories
      datasets: [
        {
          label: 'Income',
          data: [data.totalIncome || 0, 0], // Map income to the first label
          backgroundColor: 'rgba(0, 128, 0, 0.5)', // Green color
        },
        {
          label: 'Expenses',
          data: [0, data.totalExpenses || 0], // Map expenses to the second label
          backgroundColor: 'rgba(255, 0, 0, 0.5)', // Red color
        },
      ],
    };
  };
  


  useEffect(() => {
    fetchSummary(); 
  }, [period]);

  
  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setChartHeight(300);
      } else if (window.innerWidth >= 768) {
        setChartHeight(350); 
      } else {
        setChartHeight(400); 
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize); 

    return () => {
      window.removeEventListener('resize', handleResize); 
    };
  }, []);

  if (loading) {
    return <p>Loading chart data...</p>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
     

      {/* Dropdown to select period */}
      <div className="mt-32 flex justify-center">
        <select
          value={period}
          onChange={handlePeriodChange}
          className="p-2 border rounded-md w-full bg-slate-600 sm:w-1/2 md:w-1/3 lg:w-1/4"
        >
          <option value="3">Last 3 Days</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="1">Last 1 Year</option>
        </select>
        
      </div>

      {/* Render the chart */}
      {data ? (
        <div className="my-4 w-full">
          <Bar
            data={data}
            options={chartOptions}
            height={chartHeight} // Use dynamic height
          />
        </div>
      ) : (
        <p className="text-center">No data available for the selected period.</p>
      )}
    </div>
  );
};

// Chart options with customization
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allow the chart to adjust height freely
  plugins: {
    title: {
      display: true,
      text: 'Income and Expenses Comparison',
      font: {
        size: 18,
      },
    },
    tooltip: {
      callbacks: {
        label: (tooltipItem) => `${tooltipItem.dataset.label}: $${tooltipItem.raw}`,
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `$${value}`, // Formatting y-axis ticks as currency
      },
    },
  },
};

export default IncomeExpenseChart;
