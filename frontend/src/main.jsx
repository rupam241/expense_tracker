import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CreateEntry from "./pages/CreateEntry.jsx";
import Expense from "./pages/Expense.jsx";
import Income from "./pages/Income.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LeftBar from "./components/LeftBar.jsx";
import RightBar from "./components/RightBar.jsx";
import Signin from "./pages/auth/Signin.jsx";
import Signup from "./pages/auth/Signup.jsx"; 
import { Provider } from "react-redux";
import store, { persistor } from './app/store.js'; 
import PrivateRoute from "./components/Privateroute.jsx";
import { PersistGate } from 'redux-persist/integration/react';
import Profile from "./pages/Profile.jsx";
import ChangePass from "./pages/ChangePass.jsx";

// Define routes
const router = createBrowserRouter([
  {
    path: "/signin", 
    element: <Signin />,
  },
  {
    path: "/signup", 
    element: <Signup />,
  },
  {
    path: "/",
    element: <PrivateRoute />, 
    children: [
      {
        path: "/",
        element: (
          <div className="flex flex-col lg:flex-row p-4 gap-4">
          <LeftBar />
          <RightBar  />
        </div>
        
        ),
        children: [
          { path: "createEntry", element: <CreateEntry /> }, 
          { path: "expense", element: <Expense /> }, 
          { path: "income", element: <Income /> }, 
          { path: "dashboard", element: <Dashboard /> }, 
          { path: "profile", element: <Profile/> },
          { path: "change-password", element: <ChangePass/> }, 
        ],
      },
    ],
  },
]);


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
